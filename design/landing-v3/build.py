#!/usr/bin/env python3
"""Assemble design/bacup-landing-v3.html (self-contained) from landing-v3/parts.

    python3 design/landing-v3/build.py

Images are inlined as data URIs so the page works as a single file.
"""
import base64, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
PARTS = ROOT / "parts"
ASSETS = ROOT.parent / "assets-v3"
OUT = ROOT.parent / "bacup-landing-v3.html"
rd = lambda n: (PARTS / n).read_text(encoding="utf-8")


def data_uri(path: pathlib.Path) -> str:
    mime = "image/webp" if path.suffix == ".webp" else "image/png"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


# ---------------------------------------------------------------- CSS
TOKENS = """/* Layout: sticky nav → hero (your laptop + phone mockups, live UI warped onto the screens) → stats → features →
   Cours shelf → Examens blancs → « Essaie l'app » → plan → « La bac app. → Bac Up. » → programme partout →
   Monk Mode (Launchpad badges) → communauté + carte → tarif + paiements → FAQ → CTA. Clair / Sombre switch. */
:root{
  color-scheme:dark;
  --bg:#0A0F15;--bg2:#0C131A;--ink:#EEF3F7;--muted:#9AA7B2;--faint:#66737E;--line:#1E2A35;--card:#111922;
  --accent:#3D9BF0;--cyan:#0DB8D3;--night:#070B12;
  --a-bg:#070B12;--a-glass:rgba(255,255,255,.045);--a-border:rgba(255,255,255,.09);--a-ink:#F2F6FA;--a-muted:#8B97A3;--a-faint:#5D6873;
  --o5:#F97316;--o6:#EA580C;--v5:#8B5CF6;--v7:#6D28D9;--e5:#10B981;--e7:#047857;--r5:#EF4444;--am5:#F59E0B;
  --w:255,255,255;--t1:#F2F6FA;--t2:#C8D1D9;--t3:#9AA7B2;--t4:#7D8A96;--t5:#66737E;--t6:#5D6873;--cy:#7FE3F2;
  --dusk:linear-gradient(var(--bg2),#2A3540 45%,var(--night));--dot:#2A3A48;--dot2:#3B5568;
  --f-ui:"Plus Jakarta Sans","Satoshi",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  --ease:cubic-bezier(.2,.7,.2,1);
  --spring:linear(0,.32 8%,.82 22%,1.04 36%,1.02 48%,1);
}
:root[data-theme="light"]{
  color-scheme:light;
  --bg:#F7F9FB;--bg2:#EDF2F7;--ink:#0B1520;--muted:#5B6976;--faint:#93A0AB;--line:#E1E7ED;--card:#FFFFFF;
  --accent:#1B7FDC;--night:#EEF3F8;
  --w:11,21,32;--t1:#0B1520;--t2:#2C3A47;--t3:#53616E;--t4:#66737E;--t5:#7C8995;--t6:#98A4AE;--cy:#0A86A0;
  --dusk:linear-gradient(var(--bg2),var(--night));--dot:#C9D5DF;--dot2:#9FB4C4;
}

"""

REMOVE_PREFIXES = (
    "nav.top{", ".brand{", ".brand svg{", ".links{", ".links a{", "@media (max-width:900px){.links{display:none}}",
    ".hero{", "@media (max-width:960px){.hero{",
    ".shot{", "@media (max-width:960px){.shot{", ".rig{", ".mbp{", ".lidx{", ".lid{", ".lid .notch", ".mscreen{", ".mscreen .glare",
    ".deck{", ".deck .kb", ".deck .tp", ".deck .lip", ".ip{", ".ipf{", ".ipf::before", ".ipf::after", ".ips{",
    ".di{", ".di .dl", ".di .dr", ".di.live", ".floor{", ".float{", ".gcard",
    "@media (max-width:960px){.gcard", "@media (max-width:520px){.gcard",
    ':root[data-theme="dark"] .gcard', "@media (prefers-color-scheme: dark){:root:not([data-theme=\"light\"]) .gcard",
    "/* hero: floating", "/* ===== hero:", ".count{", ".count b{", ".count i{",
)

css = rd("orig.css")
css = css[css.index("*{box-sizing:border-box}"):]
kept, skip = [], 0
for l in css.split("\n"):
    if skip:
        skip += l.count("{") - l.count("}")
        continue
    if l.startswith(REMOVE_PREFIXES):
        skip = max(0, l.count("{") - l.count("}"))
        continue
    kept.append(l)
css = "\n".join(kept)

# theme-aware dark sections: swap hard-coded greys / white-alphas for tokens
a = css.index("/* ===== section 3")
b = css.index("@keyframes hover")
region = css[a:b]
region = region.replace("rgba(255,255,255,", "rgba(var(--w),")
for hx, v in {"#F2F6FA": "var(--t1)", "#EEF3F7": "var(--t1)", "#C8D1D9": "var(--t2)", "#9AA7B2": "var(--t3)", "#7D8A96": "var(--t4)",
              "#66737E": "var(--t5)", "#5D6873": "var(--t6)", "#7FE3F2": "var(--cy)"}.items():
    region = region.replace(hx, v)
region = region.replace(".dusk{height:340px;background:linear-gradient(var(--bg2),#2A3540 45%,var(--night))}", ".dusk{height:240px;background:var(--dusk)}")
region = region.replace(".seg .th{position:absolute;top:4px;bottom:4px;left:4px;border-radius:999px;background:#fff;", ".seg .th{position:absolute;top:4px;bottom:4px;left:4px;border-radius:999px;background:var(--ink);")
region = region.replace('.seg button[aria-pressed="true"]{color:#0B0F15}', '.seg button[aria-pressed="true"]{color:var(--bg)}')
region = region.replace(".join .jh .mk{", ".join .jh .mk-old{")
region = region.replace(".ph.now h4{color:#fff}", ".ph.now h4{color:var(--t1)}")
region = region.replace(".parents p b{color:#fff}", ".parents p b{color:var(--t1)}")
region = region.replace("background:linear-gradient(90deg,var(--cy),#fff)", "background:linear-gradient(90deg,var(--cy),var(--t1))")
region = region.replace(".chart .rv text{fill:#B9E9F2;", ".chart .rv text{fill:var(--cy);")
css = css[:a] + region + css[b:]

new_css = rd("new.css").replace("animation:gIn 1s var(--ease) both}", "animation:fadeOnly 1s var(--ease) both}")
new_css += """
@keyframes fadeOnly{from{opacity:0}to{opacity:1}}
.join .jh .mk2{display:grid;place-items:center}
.join .jh .mk2 svg{width:40px;height:35px;color:#fff;display:block}
.join .jh b{font-size:18px}
"""
full_css = TOKENS + css + "\n" + new_css

# ---------------------------------------------------------------- SVG symbols
NEW_SYMBOLS = """
    <symbol id="n-moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
    <symbol id="n-notebook" viewBox="0 0 24 24"><path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M8 9h7M8 13h5"/></symbol>
    <symbol id="n-clipboard" viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></symbol>
    <symbol id="n-shuffle" viewBox="0 0 24 24"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></symbol>
    <symbol id="n-cal" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/></symbol>
    <symbol id="n-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></symbol>
    <symbol id="n-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></symbol>
    <symbol id="n-phone" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></symbol>
    <symbol id="n-laptop" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></symbol>
    <symbol id="n-tablet" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="3"/><path d="M11 18h2"/></symbol>
    <symbol id="n-refresh" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/></symbol>
    <symbol id="n-shield" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></symbol>
    <symbol id="n-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
    <symbol id="n-bank" viewBox="0 0 24 24"><path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/></symbol>
"""
defs_a = rd("defs_a.svg").rstrip()
assert defs_a.endswith("</defs>\n</svg>") or defs_a.endswith("</defs></svg>"), defs_a[-40:]
defs_a = re.sub(r"</defs>\s*</svg>\s*$", "", defs_a)
defs_b = rd("defs_b.svg").rstrip()
defs_b = re.sub(r"</defs>\s*$", "", defs_b)
defs = defs_a + "\n" + defs_b + NEW_SYMBOLS + "  </defs>\n</svg>\n"

# ---------------------------------------------------------------- fragments
dash = rd("dash.html")
dash = re.sub(r'<div class="av">SB</div>\s*<div class="who">Salma B\.<small>(.*?)</small></div>',
              r'<div class="who-m"><span class="mm-medal laureat" style="--mm:62px"></span><b>Lauréat</b><small>\1</small></div>', dash, flags=re.S)
dash = re.sub(r'<div class="nm">Salma B\.<small>(.*?)</small></div><span class="mini-av">SB</span>',
              r'<div class="nm"><div>Lauréat<small>\1</small></div><span class="mm-medal laureat" style="--mm:32px"></span></div>', dash, flags=re.S)
dash = dash.replace("Bonjour, Salma.", "Bonjour, Lauréat.").replace("--c1:#1B7FDC;--hi:#7FE3F2", "--c1:#6B7A8A;--hi:#CBD5E1")
assert "Salma" not in dash and "SB<" not in dash

phone = "\n".join(rd("phone.html").rstrip().split("\n")[:-1])  # drop the stray canvas closer
phone = phone.replace('<span class="mini-av">SB</span>', '<span class="mm-medal laureat" style="--mm:30px"></span>')
assert "Salma" not in phone and "SB<" not in phone

plan = rd("plan.html")
plan = re.sub(r'<symbol id="t-sprout".*?</defs>', "</defs>", plan, flags=re.S)
plan = plan.replace('fill="#7FE3F2"', 'style="fill:var(--cy)"')

monk = rd("monk.html").rstrip()
assert monk.endswith("</div>")
monk = monk[: -len("</div>")] + """
      <div class="ach-h" style="margin-top:84px"><div class="eyebrow">Récompenses</div><h3 class="h2" style="font-size:clamp(28px,3.4vw,44px);max-width:20ch">Des badges à collectionner, un par victoire.</h3></div>
      <div class="ach" id="ach"></div>
      <div class="ctabar" style="margin-top:48px"><p>Commence ta série aujourd'hui.<span>Le premier jour compte autant que le centième.</span></p><a class="pbtn grad lg" href="/signup">Lancer mon Monk Mode<span class="arr"><svg class="i"><use href="#i-arrow"/></svg></span></a></div>
    </div>
"""

comm = rd("comm.html")
comm = comm.replace('<span class="mk"><svg><use href="#logo"/></svg></span>', '<span class="mk2"><svg><use href="#logo"/></svg></span>')
comm = comm.replace('placeholder="Salma"', 'placeholder="Ton prénom"')
comm = re.sub(r'<div class="mapmini"><svg id="map"([^>]*)></svg></div>',
              r'<div class="mapbox"><div class="mapmini"><svg id="map"\1></svg>'
              r'<div class="mapstat m1"><span class="ic sm" style="--c1:#2DD4BF;--c2:#0F766E"><svg class="i"><use href="#i-users"/></svg></span><div><b>Binômes et groupes</b><span>par filière, partout au Maroc</span></div></div>'
              r'<div class="mapstat m2"><span class="ic sm" style="--c1:#FB923C;--c2:#C2410C"><svg class="i"><use href="#i-swords"/></svg></span><div><b>Défis hebdo</b><span>ville contre ville</span></div></div></div>'
              r'<div class="cities" id="cities"></div></div>', comm)
assert "mapstat" in comm and "Salma" not in comm

READER = """<div class="rd">
  <div class="top"><b><svg><use href="#logo"/></svg>Bac Up</b><span class="jpill"><span class="jd">J-236</span> <small>· BAC</small></span></div>
  <div class="top" style="margin-top:6px"><span>‹ Physique-Chimie</span><span>Chapitre 3 sur 29</span></div>
  <h4>Ondes mécaniques progressives</h4>
  <p class="sub">Sciences Physiques · 2bac · 18 QCU</p>
  <div class="tabs"><span class="on">Cours</span><span>Résumé</span><span>QCU</span></div>
  <div class="rbar"><i></i></div>
  <div class="co"><b>À retenir</b>Une onde transporte de l'énergie sans transporter de matière.</div>
  <div class="fm" id="rdFm"></div>
  <div class="sec3">
    <div class="sr3"><i><svg class="i" style="font-size:11px;stroke-width:3.4"><use href="#i-check"/></svg></i>La célérité<em>3 min</em></div>
    <div class="sr3"><i><svg class="i" style="font-size:11px;stroke-width:3.4"><use href="#i-check"/></svg></i>Le retard temporel<em>4 min</em></div>
    <div class="sr3 o"><i></i>Transversale ou longitudinale<em>5 min</em></div>
  </div>
  <div class="bt"><span class="s">Résumé</span><span class="p">S'entraîner · 18 QCU</span></div>
</div>"""

PAYLOGOS = """
<span class="pl" title="Carte bancaire marocaine"><svg viewBox="0 0 70 30" role="img" aria-label="CMI"><rect width="70" height="30" rx="7" fill="#0B3A7A"/><text x="35" y="21.5" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="17" fill="#fff" letter-spacing="1">CMI</text></svg><small>Carte<br>bancaire</small></span>
<span class="pl" title="Visa"><svg viewBox="0 0 62 22" role="img" aria-label="Visa"><text x="0" y="19" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-style="italic" font-size="24" fill="#1A1F71" letter-spacing="-1">VISA</text></svg></span>
<span class="pl" title="Mastercard"><svg viewBox="0 0 48 30" role="img" aria-label="Mastercard"><circle cx="17" cy="15" r="13" fill="#EB001B"/><circle cx="31" cy="15" r="13" fill="#F79E1B"/><path d="M24 4.6a13 13 0 0 1 0 20.8 13 13 0 0 1 0-20.8z" fill="#FF5F00"/></svg></span>
<span class="pl" title="Cashplus"><svg viewBox="0 0 92 24" role="img" aria-label="Cashplus"><text x="0" y="18" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="19" fill="#0F8F4A" letter-spacing="-.5">cash</text><text x="40" y="18" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="19" fill="#F59E0B" letter-spacing="-.5">plus</text></svg></span>
<span class="pl" title="Wafacash"><svg viewBox="0 0 104 26" role="img" aria-label="Wafacash"><rect width="104" height="26" rx="6" fill="#FDC400"/><text x="52" y="18.5" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="15" fill="#111" letter-spacing="-.3">wafacash</text></svg></span>
<span class="pl dk" title="Virement bancaire"><svg class="i" style="height:22px;width:22px"><use href="#n-bank"/></svg><small>Virement<br>bancaire</small></span>
<span class="pl dk" title="Paiement à la livraison"><svg class="i" style="height:22px;width:22px"><use href="#i-truck"/></svg><small>À la<br>livraison</small></span>
"""

body = rd("body.html")
body = (body.replace("{{DASH}}", dash).replace("{{PHONE}}", phone).replace("{{S2}}", rd("s2.html")).replace("{{PLAN}}", plan)
        .replace("{{MONK}}", monk).replace("{{COMM}}", comm).replace("{{READER}}", READER).replace("{{PAYLOGOS}}", PAYLOGOS)
        .replace("{{IMG_LAPTOP}}", data_uri(ASSETS / "mockup-laptop.webp")).replace("{{IMG_PHONE}}", data_uri(ASSETS / "mockup-phone.webp")))
assert "{{" not in body, re.findall(r"\{\{\w+\}\}", body)

# ---------------------------------------------------------------- JS
js = rd("orig.js")
def cut(s, start, end):
    i, j = s.index(start), s.index(end)
    return s[:i] + s[j:]
js = cut(js, "function fit(){", "/* MacBook: the day plays out")
js = cut(js, "/* keyboard keys */", "/* ===== Diagnostic ===== */")
js = cut(js, "/* Morocco network map */", "/* ===== Monk Mode")
js = cut(js, "/* ===== Monk Mode (TIERS", "/* ===== community request")
js = js[: js.index("function boot(){")]
js, n = re.subn(r'\$\("shelf"\)\.innerHTML=BOOKS\.map\((.*?)\)\.join\(""\);',
                lambda m: 'const shelfHTML=()=>BOOKS.map(' + m.group(1) + ').join("");$("shelf").innerHTML=shelfHTML();if($("shelf2"))$("shelf2").innerHTML=shelfHTML();', js, flags=re.S)
assert n == 1
js = js.replace('fill="#7FE3F2"', 'style="fill:var(--cy)"').replace('fill="#66737E"', 'style="fill:var(--t5)"')
js += "\n" + rd("new.js")

# ---------------------------------------------------------------- document
HEAD = """<!doctype html>
<html lang="fr" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bac Up · La bac app des lycéens marocains</title>
<meta name="description" content="Programme complet 1bac et 2bac, cours et résumés, 10 000+ QCU, 100+ annales corrigées et examens blancs notés sur 20. Commence gratuitement.">
<meta name="theme-color" content="#0A0F15">
<script>(function(){var t="dark";try{t=localStorage.getItem("bacup-theme")||"dark"}catch(e){}document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");document.documentElement.classList.add("js")})()</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&display=swap">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<style>
"""
html = (HEAD + full_css + "\n</style>\n</head>\n<body>\n" + defs + "\n" + body +
        "\n" + rd("data_bank.html") + "\n" + rd("data_map.html") + "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n")
OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({len(html)/1024:.0f} KB)")
