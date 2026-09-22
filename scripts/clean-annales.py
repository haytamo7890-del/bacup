#!/usr/bin/env python3
"""
clean-annales.py — strip MonBac branding from official BAC sujets and stamp the
Bac Up footer. Text-only redaction + targeted QR removal, so figure-heavy PDFs
(SVT/PC) are NOT re-encoded and don't bloat.

Usage:
    pip install pymupdf --break-system-packages
    python3 clean-annales.py <input_dir> <output_dir>

Only run on PUBLIC official annales (or content you own).
"""
import os, re, sys
import pymupdf as fitz

ARCTIC = (0.106, 0.498, 0.863); INK = (0.047, 0.086, 0.133); GREY = (0.54, 0.56, 0.60)

def _star(page, ox, oy, s):
    star = [(50,10),(58,41),(90,50),(58,59),(50,90),(42,59),(10,50),(42,41)]
    bolt = [(55,31),(44,53),(51,53),(46,69),(58,45),(51,45),(57,31)]
    sh = page.new_shape()
    sh.draw_polyline([(ox+x*s, oy+y*s) for x,y in star] + [(ox+star[0][0]*s, oy+star[0][1]*s)])
    sh.draw_polyline([(ox+x*s, oy+y*s) for x,y in bolt] + [(ox+bolt[0][0]*s, oy+bolt[0][1]*s)])
    sh.finish(fill=ARCTIC, color=None, even_odd=True, closePath=True); sh.commit()

def clean(inp, outp):
    d = fitz.open(inp)
    for p in d:
        H, W = p.rect.height, p.rect.width
        tops = [r.y0 for t in ("monbac","bac.ma","voir la","scanne") for r in p.search_for(t)]
        band_top = (min(tops) - 6) if tops else (H - 52)
        band_top = max(band_top, H - 64)
        # find footer images (the QR) BEFORE redacting
        qr_xrefs = []
        for im in p.get_images(full=True):
            try:
                for r in p.get_image_rects(im[0]):
                    if r.y0 > H - 70: qr_xrefs.append(im[0]); break
            except Exception: pass
        # remove MonBac TEXT only (keeps figures intact → no bloat)
        p.add_redact_annot(fitz.Rect(0, band_top, W, H), fill=(1,1,1))
        p.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        # delete just the QR image(s)
        for x in set(qr_xrefs):
            try: p.delete_image(x)
            except Exception: pass
        # clean any residual pixels then stamp Bac Up footer
        p.draw_rect(fitz.Rect(0, band_top, W, H), fill=(1,1,1), color=None)
        by = H - 20
        p.draw_line(fitz.Point(40, band_top+6), fitz.Point(W-40, band_top+6), color=ARCTIC, width=0.6)
        _star(p, 40, by-9, 0.12)
        p.insert_text((56, by), "Bac Up", fontname="hebo", fontsize=9.5, color=INK)
        p.insert_text((92, by), "— Réussis ton BAC, sans t'ennuyer.", fontname="helv", fontsize=8, color=GREY)
        rt = "bacup.ma"; w = fitz.get_text_length(rt, fontname="hebo", fontsize=8.5)
        p.insert_text((W-40-w, by), rt, fontname="hebo", fontsize=8.5, color=ARCTIC)
    d.save(outp, garbage=3, deflate=True, clean=True); d.close()

def tidy(n): return re.sub(r"\s+", " ", re.sub(r"(?i)mon\s*bac", "", n)).strip(" -_") or "divers"

def main(src, out):
    ok = fail = 0
    for root, _, files in os.walk(src):
        for fn in files:
            if not fn.lower().endswith(".pdf"): continue
            rel = os.path.relpath(root, src)
            od = os.path.join(out, *[tidy(x) for x in rel.split(os.sep)]) if rel != "." else out
            os.makedirs(od, exist_ok=True)
            try: clean(os.path.join(root, fn), os.path.join(od, fn)); ok += 1
            except Exception as e: fail += 1; print("  ✗", fn, e)
    print(f"cleaned {ok} | failed {fail}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: python3 clean-annales.py <input_dir> <output_dir>"); sys.exit(1)
    main(sys.argv[1], sys.argv[2])
