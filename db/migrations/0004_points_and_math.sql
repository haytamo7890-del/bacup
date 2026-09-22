-- =====================================================================
--  0004 — per-question points + a LaTeX demo to verify math rendering
-- =====================================================================

-- points per question (e.g. 0.5 pt), used to compute the /20 exam score
alter table questions add column if not exists points numeric(4,2) not null default 1;

-- Demo: add an inline LaTeX formula to a seeded question so we can see
-- KaTeX render it. (Backslashes are literal in standard Postgres strings.)
update questions
set statement = statement || '   Rappel : $P(A\mid B) = \dfrac{P(A\cap B)}{P(B)}$'
where statement like 'On tire une carte%'
  and statement not like '%Rappel%';
