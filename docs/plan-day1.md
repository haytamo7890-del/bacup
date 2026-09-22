# Bac-up — Product Blueprint & Day-1 Plan (v2)

## Product structure (locked)
- **Landing → choose:** `1bac-up` (régional) or `2bac-up` (national).
- **Filières (science):** Sciences Maths A · Sciences Maths B · Sciences Physiques (PC) · SVT.
- **Content:** maximum real past-exam sujets **+ unlimited examens blancs** (assembled/generated).
- **Exam mode:** **timed** (2h or 3h, per subject) · **QCU** (single choice) · a shared **CONTEXTE** per exercice · per-question **points** (e.g. 0.5 pt) · **math in LaTeX**.
- **After "Terminer":** results page → **score /20** + **corrections détaillées** (correct in green, wrong in red) + **AI explain menu**: *Explique autrement · Étapes · Cours · Erreurs · Méthode*.
- Plus (already planned): gamification/XP, note estimée, note calculator, coach. Theme: Bac-up glassy blue, dark default.

## The line we hold — build vs copy
Build MonBac's *capabilities*, better. But:
- **Official past sujets = public** → fine to use.
- **MonBac's corrections, wording, and design = theirs** → we write our **own** corrections and use our **own** Bac-up design.
This keeps you legally clean **and** is your moat (proprietary corrections + brand).

## NEW technical requirement
- **Math rendering (KaTeX / react-katex).** Questions, options, and corrections are stored **with LaTeX** and rendered properly (e.g. `\cos\frac{\pi}{6}`, `e^{i\pi/12}`). Without this, math questions look broken.

---

## Day-1 focus — one subject, real, functional
Principle unchanged: **one filière, one real exam, working end-to-end** — but in the real *exam-engine* shape.

### Prereqs (~15 min)
- Add $5 Anthropic credits · commit current work · pick the **first filière + one real exam** you have files for.

### Block A — Content + math (morning)
- Update content model: add `points` to questions, store statements/options/solutions **as LaTeX**, `exam.duration_minutes`.
- Install **KaTeX**; render math in questions/options/corrections.
- CSV import format (+ loader) → load **one real exam** (contexte, QCU, points).
- ✅ Done: one real exam's questions render correctly, math and all.

### Block B — The timed exam engine (midday) ← the core of the vision
- Exam runner: header with **Q x/33 + timer (3h/2h) + Terminer**, one QCU at a time (or scroll), pick one answer.
- On **Terminer** → compute **/20** from points → **results page**: score ring, per-question **correct/wrong**, the **CONTEXTE**, and the **AI explain menu**.
- ✅ Done: take a real exam, submit, see your /20 and corrections with AI explanations.

### Block C — Make it count (afternoon)
- `record_attempt` loop: attempts → chapter_mastery → **XP** (rules below) → **streak**.
- Wire dashboard ratios + coach to real data.
- ✅ Done: finishing an exam moves XP, précision, mastery, streak.

### Block D — Note de Bac + polish (stretch)
- Note estimée (from mastery) on dashboard · free calculator (coefficients).
- `1bac-up / 2bac-up` choice on landing · auth UI polish. (Cut first if short.)

## XP rules
Correct 1st try +10 · retry +3 · answered +1 · exam finished +25 · streak day +5.
Niveau = floor(totalXP/100)+1.

## AI explain menu (5 modes → 5 prompts, all via the gateway)
- **Explique autrement** — re-explain differently (uses stored correction as context).
- **Étapes** — step-by-step breakdown.
- **Cours** — the underlying lesson/rappel.
- **Erreurs** — common mistakes / why the wrong options are wrong.
- **Méthode** — the general method for this type of question.

## Consciously NOT doing Day 1
Community, parental report, payments, all filières, the calculator's every edge case.
One filière · one real exam · the engine · the loop. Everything else compounds after.
