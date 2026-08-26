# HSGenius — Product & Design Spec (working)

> Living document. Updated as we lock decisions. Full dashboard/QCM visuals come from Figma.

## Design language
- **Arctic Depths glassmorphism** — frosted surfaces (`.glass`), glow, depth.
- Palette: `#0DB8D3` cyan · `#1B7FDC` blue · `#065B98` deep · `#193546` navy.
- Light + dark, both fully polished. Minimal but with a **strong HSGenius identity** — not a generic AI look.

## Navigation — collapsible sidebar + top bar
`Accueil · Tuteur IA · Cours & Leçons · Exercices · Examens · Classement · Objectifs & Planning · Communauté · — · Réglages · Déconnexion`
Progression is surfaced on the Accueil home (balanced overview).

## Dashboard (Accueil) — balanced overview
- Greeting + niveau/filière selector
- Stat cards: **Questions · Accuracy % · Rang** (subtle gamification)
- Subject cards with progress % + difficulty badge
- Today's recommendation ("révise X aujourd'hui")
- Rankers / leaderboard preview (Classement)
- Progress **radar** (mastery per chapter)
- Level / XP in profile menu · Upgrade-to-Pro card

## QCM ENGINE — the core feature ("Examens + corrections", built first)
**Flow:** choose Subject (ex. Maths) → choose Chapter/Lesson → get **all QCM questions from national exams** for that chapter.
Per question (options A–E) three actions:
1. **Répondre** — reveal the correct answer
2. **Correction officielle** — our own written correction (proprietary)
3. **Expliquer avec l'IA** — the AI tutor explains step by step  ← our differentiator
Also filter/group by exam **session/year** (Juin 2019, …). Per-chapter progress (ex. 15/22 · 68%).

### Data model mapping (ALREADY supported by our schema)
| QCM concept | Database |
|---|---|
| Subject (Maths) | `subjects` |
| Chapter / Lesson | `chapters` |
| QCM question | `questions` (kind = `mcq`) + `answer_options` |
| "from national exams" | `exercises.exam_id → exams` (type `national`, year, session) |
| Official correction | `solutions` (author = `hsgenius`) |
| "Expliquer avec l'IA" | `lib/ai/gateway.askTutor()` |
| Progress / accuracy | `chapter_mastery`, `attempts` |

No schema change needed — the foundation handles this exactly.

## Adapted from inspiration (e-qe, Niond)
QCM-by-lesson-from-exams · session sidebar · Répondre/Officielle/Expliquer buttons ·
stat cards (Questions/Accuracy/Rang) · rankers table · progress radar · subject cards with % ·
level/XP · upgrade card.

## Our edge over static QCM sites
The **"Expliquer avec l'IA"** button — a real coach on every question. e-qe & co. only show a static official correction. This is the wedge.

## Status
Foundation + schema ready. **Awaiting full Figma design** for dashboard + QCM screens, then we build.
