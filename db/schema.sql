-- =====================================================================
--  HSGenius — Core database schema  (PostgreSQL / Supabase)
--  Multi-curriculum by design: BAC Maroc is only the FIRST instance.
--  The same tables support other levels, tracks, subjects, and countries
--  (ENCG, higher-ed, MENA) without a rebuild.
--
--  Design principles
--   1. Curriculum is generic:  country > education_system > level > track
--                              > subject > chapter > lesson > exercise > question
--   2. Exam library stores OFFICIAL sujets by reference (source_url); the
--      CORRECTIONS are authored by HSGenius (proprietary = legal + moat).
--   3. Student intelligence (mastery, mistakes, recommendations) is first-class.
--   4. Students may be MINORS: minimal PII + Row Level Security everywhere.
--   5. Everything scoped to a student is protected by RLS (see bottom).
--
--  Conventions: uuid PKs, timestamptz, snake_case, FK ON DELETE rules explicit.
--  Run order: extensions > enums > curriculum > content > exams > users >
--             activity > tutor > gamification > billing > indexes > RLS > seed.
-- =====================================================================

create extension if not exists "pgcrypto";     -- gen_random_uuid()

-- ---------------------------------------------------------------------
--  ENUMS
-- ---------------------------------------------------------------------
create type exam_type       as enum ('national', 'regional', 'blanc', 'other');
create type exam_session    as enum ('normale', 'rattrapage');
create type question_kind   as enum ('mcq', 'open', 'numeric', 'proof');
create type content_source  as enum ('official_exam', 'hsgenius', 'partner');
create type app_role        as enum ('student', 'parent', 'teacher', 'admin');
create type attempt_status  as enum ('correct', 'partial', 'incorrect', 'skipped');
create type reco_status     as enum ('pending', 'seen', 'done', 'dismissed');
create type msg_role        as enum ('user', 'assistant', 'system');
create type sub_status      as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');
create type pay_method      as enum ('cmi_card', 'wallet', 'cash_point', 'bank_transfer', 'manual');
create type pay_status      as enum ('pending', 'succeeded', 'failed', 'refunded');
create type referral_status as enum ('pending', 'qualified', 'rewarded', 'void');

-- =====================================================================
--  1. CURRICULUM (shared reference data — mostly read-only content)
-- =====================================================================
create table countries (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,              -- ISO-3166-1 alpha-2, e.g. 'MA'
  name        text not null
);

create table education_systems (
  id          uuid primary key default gen_random_uuid(),
  country_id  uuid not null references countries(id) on delete cascade,
  code        text not null,                     -- e.g. 'ma_secondaire_qualifiant'
  name        text not null,                     -- 'Maroc — Secondaire qualifiant'
  unique (country_id, code)
);

-- Grade / niveau: 1bac, 2bac  (ordered)
create table levels (
  id                   uuid primary key default gen_random_uuid(),
  education_system_id  uuid not null references education_systems(id) on delete cascade,
  code                 text not null,            -- '1bac', '2bac'
  name                 text not null,            -- '1ère année Baccalauréat'
  position             int  not null default 0,
  unique (education_system_id, code)
);

-- Track / filière: SM-A, SM-B, PC, SVT, STE, STM, ECO, SGC, Lettres...
create table tracks (
  id                   uuid primary key default gen_random_uuid(),
  education_system_id  uuid not null references education_systems(id) on delete cascade,
  code                 text not null,            -- 'sm_a', 'pc', 'svt'
  name                 text not null,
  unique (education_system_id, code)
);

-- Subject / matière: Mathématiques, Physique-Chimie, SVT, Français...
create table subjects (
  id                   uuid primary key default gen_random_uuid(),
  education_system_id  uuid not null references education_systems(id) on delete cascade,
  code                 text not null,            -- 'maths', 'pc', 'svt', 'francais'
  name                 text not null,
  unique (education_system_id, code)
);

-- Which subjects a (level, track) studies, with coefficient + how it's examined.
-- This is the join that makes the curriculum flexible per filière.
create table track_subjects (
  id           uuid primary key default gen_random_uuid(),
  level_id     uuid not null references levels(id)   on delete cascade,
  track_id     uuid not null references tracks(id)   on delete cascade,
  subject_id   uuid not null references subjects(id) on delete cascade,
  coefficient  numeric(4,1),
  exam_type    exam_type,                          -- how it is examined at this level
  unique (level_id, track_id, subject_id)
);

-- Chapter / module (scoped to subject + level; track optional when it differs)
create table chapters (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references subjects(id) on delete cascade,
  level_id     uuid not null references levels(id)   on delete cascade,
  track_id     uuid references tracks(id) on delete cascade,   -- null = common to all tracks
  code         text,
  name         text not null,
  position     int  not null default 0
);

create table lessons (
  id           uuid primary key default gen_random_uuid(),
  chapter_id   uuid not null references chapters(id) on delete cascade,
  title        text not null,
  body         text,                               -- markdown lesson content
  position     int  not null default 0,
  created_at   timestamptz not null default now()
);

-- =====================================================================
--  2. EXAM LIBRARY
--  The official SUJET is referenced (source_url). We DO NOT store third-party
--  corrections. Our own corrections live in `solutions` (author = hsgenius).
-- =====================================================================
create table regions (                            -- for examen régional (1bac)
  id          uuid primary key default gen_random_uuid(),
  country_id  uuid not null references countries(id) on delete cascade,
  name        text not null,
  unique (country_id, name)
);

create table exams (
  id                   uuid primary key default gen_random_uuid(),
  education_system_id  uuid not null references education_systems(id) on delete cascade,
  level_id             uuid not null references levels(id)   on delete cascade,
  track_id             uuid references tracks(id)   on delete set null,
  subject_id           uuid not null references subjects(id) on delete cascade,
  exam_type            exam_type    not null,
  session              exam_session,
  year                 int          not null,
  region_id            uuid references regions(id) on delete set null,  -- only régional
  title                text,
  source_url           text,                        -- link to the OFFICIAL sujet PDF
  duration_minutes     int,
  created_at           timestamptz not null default now()
);

-- =====================================================================
--  3. EXERCISES / QUESTIONS / SOLUTIONS  (practice + exam content)
-- =====================================================================
create table exercises (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references subjects(id) on delete cascade,
  chapter_id   uuid references chapters(id) on delete set null,
  lesson_id    uuid references lessons(id)  on delete set null,
  exam_id      uuid references exams(id)    on delete set null,   -- set when from an exam
  source       content_source not null default 'hsgenius',
  difficulty   int check (difficulty between 1 and 5),
  title        text,
  statement    text,
  position     int not null default 0,
  created_at   timestamptz not null default now()
);

create table questions (
  id            uuid primary key default gen_random_uuid(),
  exercise_id   uuid not null references exercises(id) on delete cascade,
  kind          question_kind not null default 'open',
  statement     text not null,
  correct_value text,                               -- for numeric/short answers
  position      int  not null default 0
);

-- MCQ options
create table answer_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references questions(id) on delete cascade,
  label        text not null,
  is_correct   boolean not null default false,
  position     int not null default 0
);

-- HSGenius-authored corrections (proprietary). One per question (or exercise).
create table solutions (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid references questions(id)  on delete cascade,
  exercise_id  uuid references exercises(id)  on delete cascade,
  author       content_source not null default 'hsgenius',
  body         text not null,                      -- step-by-step correction (markdown)
  created_at   timestamptz not null default now(),
  check (question_id is not null or exercise_id is not null)
);

-- =====================================================================
--  4. USERS & STUDENTS   (profiles extend Supabase auth.users)
--  Minimal PII: no full birth date, just birth_year to derive minor status.
-- =====================================================================
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         app_role not null default 'student',
  display_name text,
  birth_year   int,                                -- minimal; derive is_minor in app
  locale       text default 'fr',
  created_at   timestamptz not null default now()
);

create table student_profiles (
  id           uuid primary key references profiles(id) on delete cascade,
  level_id     uuid references levels(id) on delete set null,
  track_id     uuid references tracks(id) on delete set null,
  school_name  text,
  city         text
);

-- Parent <-> student link (for parent dashboard + minor consent)
create table guardianships (
  id            uuid primary key default gen_random_uuid(),
  guardian_id   uuid not null references profiles(id) on delete cascade,
  student_id    uuid not null references profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (guardian_id, student_id)
);

-- Explicit consent records (child-safety / data protection first-class)
create table consents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  kind         text not null,                      -- 'data_processing', 'guardian_consent'
  granted      boolean not null default true,
  granted_at   timestamptz not null default now()
);

-- =====================================================================
--  5. LEARNING ACTIVITY & STUDENT INTELLIGENCE
-- =====================================================================
create table attempts (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references student_profiles(id) on delete cascade,
  question_id   uuid references questions(id)  on delete set null,
  exercise_id   uuid references exercises(id)  on delete set null,
  submitted     text,
  status        attempt_status not null,
  score         numeric(5,2),
  time_spent_s  int,
  created_at    timestamptz not null default now()
);

-- Rolling mastery per student per chapter — powers the personalization engine.
create table chapter_mastery (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references student_profiles(id) on delete cascade,
  chapter_id        uuid not null references chapters(id) on delete cascade,
  mastery_pct       numeric(5,2) not null default 0,   -- 0..100
  attempts_count    int not null default 0,
  correct_count     int not null default 0,
  last_practiced_at timestamptz,
  updated_at        timestamptz not null default now(),
  unique (student_id, chapter_id)
);

-- Recurring mistake patterns (for targeted tutoring)
create table mistakes (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references student_profiles(id) on delete cascade,
  question_id  uuid references questions(id) on delete set null,
  chapter_id   uuid references chapters(id)  on delete set null,
  mistake_tag  text,                               -- e.g. 'sign_error', 'formula_confusion'
  created_at   timestamptz not null default now()
);

-- "Practice probability today" — output of the recommendation engine.
create table recommendations (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references student_profiles(id) on delete cascade,
  chapter_id   uuid references chapters(id) on delete set null,
  subject_id   uuid references subjects(id) on delete set null,
  reason       text,
  priority     int not null default 0,
  status       reco_status not null default 'pending',
  created_at   timestamptz not null default now()
);

-- =====================================================================
--  6. AI TUTOR
-- =====================================================================
create table conversations (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references student_profiles(id) on delete cascade,
  subject_id   uuid references subjects(id) on delete set null,
  chapter_id   uuid references chapters(id) on delete set null,
  title        text,
  created_at   timestamptz not null default now()
);

create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role            msg_role not null,
  content         text not null,
  model           text,                            -- which model answered (cost routing)
  input_tokens    int,
  output_tokens   int,
  created_at      timestamptz not null default now()
);

-- =====================================================================
--  7. GAMIFICATION  (kept tasteful: XP events + streaks; ranking derived)
-- =====================================================================
create table xp_events (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references student_profiles(id) on delete cascade,
  kind         text not null,                      -- 'exercise', 'lesson', 'streak'
  amount       int  not null,
  created_at   timestamptz not null default now()
);

create table streaks (
  student_id     uuid primary key references student_profiles(id) on delete cascade,
  current_days   int not null default 0,
  longest_days   int not null default 0,
  last_active_on date
);

-- =====================================================================
--  8. MONETIZATION
-- =====================================================================
create table subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  status        sub_status not null default 'trialing',
  price_mad     numeric(8,2) not null default 220,
  trial_ends_at timestamptz,
  started_at    timestamptz,
  expires_at    timestamptz,                        -- annual model (no auto-recurring on CMI)
  created_at    timestamptz not null default now()
);

create table payments (
  id               uuid primary key default gen_random_uuid(),
  subscription_id  uuid references subscriptions(id) on delete set null,
  user_id          uuid not null references profiles(id) on delete cascade,
  amount_mad       numeric(8,2) not null,
  method           pay_method not null,
  status           pay_status not null default 'pending',
  provider_ref     text,
  created_at       timestamptz not null default now()
);

create table referrals (
  id                uuid primary key default gen_random_uuid(),
  referrer_id       uuid not null references profiles(id) on delete cascade,
  referred_id       uuid references profiles(id) on delete set null,
  code              text not null unique,
  status            referral_status not null default 'pending',
  reward_kind       text,                           -- 'free_month', 'xp'
  created_at        timestamptz not null default now()
);

-- =====================================================================
--  9. INDEXES  (hot query paths)
-- =====================================================================
create index idx_chapters_subject_level   on chapters(subject_id, level_id);
create index idx_exercises_chapter         on exercises(chapter_id);
create index idx_exercises_exam            on exercises(exam_id);
create index idx_questions_exercise        on questions(exercise_id);
create index idx_exams_lookup              on exams(level_id, track_id, subject_id, year);
create index idx_attempts_student_time     on attempts(student_id, created_at desc);
create index idx_mastery_student           on chapter_mastery(student_id);
create index idx_reco_student_status       on recommendations(student_id, status);
create index idx_messages_conversation     on messages(conversation_id, created_at);
create index idx_xp_student_time           on xp_events(student_id, created_at desc);
create index idx_payments_user             on payments(user_id, created_at desc);

-- =====================================================================
--  10. ROW LEVEL SECURITY  (students are minors — protect everything personal)
--  Pattern: curriculum/content = readable by any authenticated user;
--           per-student rows = visible only to that student (and app admins).
--  These are starter policies — extend for parents/teachers as needed.
-- =====================================================================
alter table attempts          enable row level security;
alter table chapter_mastery   enable row level security;
alter table mistakes          enable row level security;
alter table recommendations   enable row level security;
alter table conversations     enable row level security;
alter table messages          enable row level security;
alter table xp_events         enable row level security;
alter table streaks           enable row level security;
alter table subscriptions     enable row level security;
alter table payments          enable row level security;
alter table student_profiles  enable row level security;

-- A student can only touch their own rows. (student_profiles.id == auth.uid())
create policy own_attempts        on attempts        using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy own_mastery         on chapter_mastery using (student_id = auth.uid());
create policy own_mistakes        on mistakes        using (student_id = auth.uid());
create policy own_reco            on recommendations using (student_id = auth.uid());
create policy own_convos          on conversations   using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy own_messages        on messages        using (
  exists (select 1 from conversations c where c.id = messages.conversation_id and c.student_id = auth.uid())
);
create policy own_xp              on xp_events       using (student_id = auth.uid());
create policy own_streak          on streaks         using (student_id = auth.uid());
create policy own_student_profile on student_profiles using (id = auth.uid()) with check (id = auth.uid());
create policy own_subscription    on subscriptions   using (user_id = auth.uid());
create policy own_payments        on payments        using (user_id = auth.uid());

-- NOTE: curriculum tables (countries..solutions, exams) are intentionally left
-- WITHOUT RLS = readable content. Lock write access to service_role / admin only.

-- =====================================================================
--  11. SEED — Morocco / BAC  (concrete first instance)
-- =====================================================================
with c as (
  insert into countries (code, name) values ('MA','Maroc')
  returning id
), es as (
  insert into education_systems (country_id, code, name)
  select id, 'ma_secondaire_qualifiant', 'Maroc — Secondaire qualifiant' from c
  returning id
)
insert into levels (education_system_id, code, name, position)
select id, v.code, v.name, v.pos from es,
  (values ('1bac','1ère année Baccalauréat',1),
          ('2bac','2ème année Baccalauréat',2)) as v(code,name,pos);

-- Tracks (filières) + core subjects for the 2bac science beachhead.
insert into tracks (education_system_id, code, name)
select es.id, v.code, v.name
from education_systems es,
 (values ('sm_a','Sciences Mathématiques A'),
         ('sm_b','Sciences Mathématiques B'),
         ('pc','Sciences Physiques (PC)'),
         ('svt','Sciences de la Vie et de la Terre'),
         ('ste','Sciences et Technologies Électriques'),
         ('stm','Sciences et Technologies Mécaniques'),
         ('eco','Sciences Économiques'),
         ('sgc','Sciences de Gestion Comptable'),
         ('lettres','Lettres'),
         ('sh','Sciences Humaines')) as v(code,name)
where es.code='ma_secondaire_qualifiant';

insert into subjects (education_system_id, code, name)
select es.id, v.code, v.name
from education_systems es,
 (values ('maths','Mathématiques'),
         ('pc','Physique-Chimie'),
         ('svt','SVT'),
         ('philo','Philosophie'),
         ('anglais','Anglais'),
         ('francais','Français'),
         ('arabe','Langue Arabe'),
         ('histgeo','Histoire-Géographie'),
         ('islamique','Éducation Islamique'),
         ('si','Sciences de l''Ingénieur'),
         ('eco_gen','Économie Générale et Statistiques'),
         ('compta','Comptabilité et Math. Financières')) as v(code,name)
where es.code='ma_secondaire_qualifiant';

-- Done. Next: populate track_subjects (coefficients + exam_type per filière),
-- chapters per subject, then load exams from the collection catalog.
