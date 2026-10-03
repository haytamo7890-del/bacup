# -*- coding: utf-8 -*-
"""Boîte à outils pour remplir les scaffolds bacup.prep/v2."""
import json, os, re, unicodedata, copy

def _find_root():
    """Trouve content/prep/scaffolds en remontant depuis le cwd, ou via BACUP_PREP_ROOT."""
    env = os.environ.get('BACUP_PREP_ROOT')
    if env:
        return os.path.abspath(env)
    d = os.path.abspath(os.getcwd())
    while True:
        cand = os.path.join(d, 'content', 'prep', 'scaffolds')
        if os.path.isdir(cand):
            return cand
        parent = os.path.dirname(d)
        if parent == d:
            raise SystemExit(
                "Scaffolds introuvables. Lance la commande depuis la racine du depot, "
                "ou exporte BACUP_PREP_ROOT=/chemin/vers/content/prep/scaffolds")
        d = parent


ROOT = _find_root()
# Par defaut on remplit les scaffolds EN PLACE (c'est ce qu'attend l'importeur).
# Mets BACUP_PREP_OUT pour ecrire ailleurs.
OUT = os.path.abspath(os.environ.get('BACUP_PREP_OUT', ROOT))

FIGURES = set("""tvi gendarmes asymptote suite-monotone-bornee suite-escalier convexite-inflexion
ln-exp-symetrie plan-complexe complexe-rotation onde-transversale onde-corde diffraction radioactivite
diagramme-nz courbe-aston diagramme-energie-nucleaire rc-charge rc-decharge cinetique titrage-ph pile
projectile vecteurs-cinematiques chute-fluide-forces chute-fluide-vitesse projectile-portee
chronophoto-projectile particule-champ-e particule-champ-b satellite-orbite kepler-ellipse
pendule-torsion pendule-pesant oscillations-amorties energie-oscillateur niveaux-energie
montage-celerite onde-types retard-temporel onde-phase diffraction-ecran dispersion-prisme montage-rl
rl-rupture rl-etablissement montage-rlc-libre rlc-energie rlc-regimes rlc-oscillation fresnel-rlc
montage-rsf resonance-intensite modulation-amplitude demodulation-enveloppe montage-modulation
spectre-modulation facteurs-cinetiques vitesse-tangente demi-reaction montage-conductimetrie
equilibre-dynamique pile-daniell montage-electrolyse esterification-rendement savon-micelle
catalyse-profil indicateurs-colores predominance-acide-base dosage-conductimetrique dosage-derivee
pendule-elastique montage-rc montage-titrage cuve-ondes montage-reflux montage-gaz moteur-cc si-chaine
si-grafcet si-asservissement si-capteur svt-dorsale svt-subduction svt-chaines-types svt-collision
svt-facies-metamorphiques svt-solidus-peridotite svt-granite-anatexie svt-granite-intrusif
svt-schistosite svt-cycle-cellulaire svt-replication-adn svt-transcription-traduction svt-code-genetique
svt-transgenese svt-pli-faille svt-metamorphisme svt-exao svt-myogramme svt-adn svt-electrophorese
svt-anticorps svt-meiose svt-station-epuration svt-dechets svt-cellule svt-mitose svt-effet-serre""".split())


def Q(notion, diff, statement, opts, hint, solution, methode=None, points=1, part=None):
    """opts : liste de 4 tuples (label, why) — le PREMIER est la bonne réponse."""
    assert len(opts) == 4, (notion, "il faut 4 options", len(opts))
    o = []
    for i, (label, why) in enumerate(opts):
        d = {"label": label}
        if i == 0:
            d["correct"] = True
        d["why"] = why
        o.append(d)
    q = {"notion": notion, "difficulty": diff, "statement": statement,
         "options": o, "hint": hint, "solution": solution}
    if methode: q["methode"] = methode
    q["points"] = points
    if part: q["part"] = part
    return q


class Chapter:
    def __init__(self, relpath, base=None):
        self.relpath = relpath
        self.path = os.path.join(base or ROOT, relpath)
        self.data = json.load(open(self.path))
        self.sc = self.data['_scaffold']
        self.notions = set(self.sc['notions'])
        self.code = self.sc['chapter']['code']
        self.blocks = {x['ref']: x for x in self.data['exercises']}

    def brief(self):
        rows = []
        for x in self.data['exercises']:
            b = x.get('_brief', {})
            if x['kind'] == 'qcu':
                rows.append((x['ref'], b.get('notion'), b.get('role'), b.get('target_new_questions'), b.get('difficulty_mix')))
        return rows

    def fill(self, ref, questions):
        x = self.blocks[ref]
        bn = (x.get('_brief') or {}).get('notion')
        x.pop('_todo', None)
        base = x['ref']
        out = []
        for i, q in enumerate(questions, 1):
            q = dict(q); q['ref'] = "%s-q%d" % (base, i)
            if q.get('notion') is None:
                assert bn, ("pas de notion dans _brief pour "+ref)
                q['notion'] = bn
            q.pop('_todo', None)
            out.append(q)
        x['questions'] = out
        # difficulté du bloc = max des questions
        x['difficulty'] = max(q['difficulty'] for q in out)
        if 'origin' not in x: x['origin'] = {"type": "original"}
        return self

    def fill_probleme(self, ref, title, context, questions, figure=None, origin=None, difficulty=3):
        x = self.blocks[ref]
        x.pop('_todo', None)
        x['title'] = title
        x['difficulty'] = difficulty
        x['context'] = context
        x['origin'] = origin or {"type": "original"}
        if figure: x['figure'] = figure
        elif 'figure' in x: x.pop('figure')
        out = []
        for i, q in enumerate(questions, 1):
            q = dict(q); q['ref'] = "%s-q%d" % (ref, i); q.pop('_todo', None)
            out.append(q)
        x['questions'] = out
        return self

    def serie(self, slug, refs, title=None, description=None):
        for s in self.data['series']:
            if s['slug'] == slug:
                s.pop('_todo', None)
                s['questions'] = list(refs)
                if title: s['title'] = title
                if description: s['description'] = description
                return self
        raise KeyError(slug)

    def all_qrefs(self, only_todo_done=True):
        out = []
        for x in self.data['exercises']:
            if only_todo_done and x.get('_todo'): continue
            for q in x['questions']:
                out.append(q['ref'])
        return out

    def save(self):
        os.makedirs(os.path.join(OUT, os.path.dirname(self.relpath)), exist_ok=True)
        p = os.path.join(OUT, self.relpath)
        json.dump(self.data, open(p, 'w'), ensure_ascii=False, indent=2)
        return p


# ------------------------------------------------------------------ validateur
def validate(path, strict_targets=True):
    d = json.load(open(path))
    sc = d.get('_scaffold', {})
    notions = set(sc.get('notions', []))
    err, warn = [], []
    name = os.path.basename(path)
    def E(m): err.append("%s :: %s" % (name, m))
    def W(m): warn.append("%s :: %s" % (name, m))

    if d.get('format') != 'bacup.prep/v2': E("format inattendu: %r" % d.get('format'))
    refs = {}
    qrefs = {}
    for x in d['exercises']:
        if x.get('_todo'):
            W("bloc encore _todo (ignoré à l'import) : %s" % x['ref']); continue
        if x['ref'] in refs: E("ref de bloc dupliquée: %s" % x['ref'])
        refs[x['ref']] = x
        if x.get('chapter') != sc.get('chapter', {}).get('code'):
            E("%s : chapter=%r ≠ %r" % (x['ref'], x.get('chapter'), sc.get('chapter', {}).get('code')))
        if x['kind'] not in ('qcu', 'probleme'): E("%s : kind=%r" % (x['ref'], x['kind']))
        if not x.get('origin', {}).get('type'): E("%s : origin manquant" % x['ref'])
        if x.get('figure') and x['figure'] not in FIGURES: E("%s : figure inconnue %r" % (x['ref'], x['figure']))
        if x['kind'] == 'probleme':
            if not x.get('context'): E("%s : context manquant" % x['ref'])
            n = len(x['questions'])
            if not (5 <= n <= 8): E("%s : %d sous-questions (attendu 5–8)" % (x['ref'], n))
            if not all(q.get('part') for q in x['questions']): E("%s : 'part' manquant sur une sous-question" % x['ref'])
            ds = [q['difficulty'] for q in x['questions']]
            if ds != sorted(ds): E("%s : difficultés non croissantes %s" % (x['ref'], ds))
            if min(ds) != 1 or max(ds) != 3: W("%s : difficultés de %d à %d (attendu 1 → 3)" % (x['ref'], min(ds), max(ds)))
        for q in x['questions']:
            if q.get('_todo'): E("%s : question encore _todo" % q.get('ref'))
            r = q.get('ref')
            if not r: E("%s : question sans ref" % x['ref']); continue
            if r in qrefs: E("ref de question dupliquée: %s" % r)
            qrefs[r] = q
            if not r.startswith(x['ref'] + '-q'): E("%s : ref hors préfixe du bloc" % r)
            if notions and q.get('notion') not in notions:
                E("%s : notion %r absente de _scaffold.notions" % (r, q.get('notion')))
            if q.get('difficulty') not in (1, 2, 3): E("%s : difficulty=%r" % (r, q.get('difficulty')))
            for f in ('statement', 'hint', 'solution'):
                if not (q.get(f) or '').strip(): E("%s : %s vide" % (r, f))
            if 'TODO' in json.dumps(q, ensure_ascii=False): E("%s : contient encore 'TODO'" % r)
            opts = q.get('options') or []
            if len(opts) != 4: E("%s : %d options (attendu 4)" % (r, len(opts)))
            nc = sum(1 for o in opts if o.get('correct'))
            if nc != 1: E("%s : %d bonne(s) réponse(s)" % (r, nc))
            for o in opts:
                if not (o.get('label') or '').strip(): E("%s : option sans label" % r)
                if not (o.get('why') or '').strip(): E("%s : option sans why : %r" % (r, o.get('label')))
            labs = [o['label'] for o in opts]
            if len(set(labs)) != len(labs): E("%s : deux options identiques" % r)
            for o in opts:
                if re.search(r'aucune des r[ée]ponses|toutes les r[ée]ponses|aucune de ces r[ée]ponses|toutes ces r[ée]ponses', o['label'], re.I):
                    E("%s : option interdite %r" % (r, o['label']))
            # LaTeX
            for f in ('statement', 'hint', 'solution', 'methode'):
                t = q.get(f) or ''
                if t.count('$') % 2: E("%s[%s] : nombre impair de $" % (r, f))
            for o in opts:
                for f in ('label', 'why'):
                    if (o.get(f) or '').count('$') % 2: E("%s : $ impair dans option[%s]" % (r, f))
            # virgule décimale française hors LaTeX ET dans LaTeX
            for m in re.finditer(r'\$[^$]*\$', q.get('statement', '') + ' ' + ' '.join(labs)):
                if re.search(r'\d\.\d', m.group(0)): W("%s : point décimal dans %r" % (r, m.group(0)[:40]))
            if not (q.get('methode') or '').strip(): W("%s : methode absente" % r)
    # séries
    for s in d.get('series', []):
        if s.get('_todo'):
            W("série encore _todo : %s" % s['slug']); continue
        qs = s.get('questions') or []
        if not (8 <= len(qs) <= 12): E("série %s : %d refs (attendu 8–12)" % (s['slug'], len(qs)))
        for r in qs:
            if r not in qrefs: E("série %s : ref inconnue %s" % (s['slug'], r))
        if len(set(qs)) != len(qs): E("série %s : refs dupliquées" % s['slug'])
        ds = [qrefs[r]['difficulty'] for r in qs if r in qrefs]
        if ds != sorted(ds): W("série %s : ordre de difficulté non croissant %s" % (s['slug'], ds))
    # cibles
    if strict_targets:
        for x in d['exercises']:
            b = x.get('_brief', {})
            t = b.get('target_new_questions')
            if x['kind'] == 'qcu' and t and not x.get('_todo'):
                if len(x['questions']) != t:
                    E("%s : %d questions écrites pour une cible de %d" % (x['ref'], len(x['questions']), t))
                mix = b.get('difficulty_mix') or {}
                if mix and sum(mix.values()) == t:
                    from collections import Counter
                    got = Counter(str(q['difficulty']) for q in x['questions'])
                    if {k: v for k, v in got.items()} != {k: v for k, v in mix.items() if v}:
                        W("%s : mix obtenu %s ≠ mix visé %s" % (x['ref'], dict(got), mix))
    return err, warn, len(qrefs)


if __name__ == '__main__':
    import sys
    tot = 0
    allerr = []
    for p in sys.argv[1:]:
        e, w, n = validate(p)
        tot += n; allerr += e
        for m in w: print(" ~", m)
    print()
    if allerr:
        for m in allerr: print(" ✗", m)
        print("\n%d ERREUR(S)" % len(allerr))
    else:
        print("✓ VALIDATION OK — %d questions, aucune erreur." % tot)
