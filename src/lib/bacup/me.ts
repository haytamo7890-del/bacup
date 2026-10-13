import type { SupabaseClient } from "@supabase/supabase-js";
import { streamForTrack } from "@/config/bacup";
import { FEATURES } from "@/config";

export type Me = {
  user: { id: string; email: string | null } | null;
  student: {
    pseudo: string | null;
    avatarKey: string | null;
    photoUrl: string | null;
    level: string | null;
    track: string | null;
    stream: string | null;
    status: string;
    founder: boolean;
    accessUntil: string | null;
    memberNumber: number | null;
    /** level + track known: the questions can be skipped */
    complete: boolean;
  } | null;
  ambassador: { status: string; code: string; pseudo: string } | null;
  /** feature switches the pages need (1bac open or locked) */
  flags: { level1bac: boolean };
};

type Rel = { code: string } | { code: string }[] | null;
const relCode = (r: Rel): string | null => (Array.isArray(r) ? r[0]?.code ?? null : r?.code ?? null);

type StudentRow = {
  status: string;
  levels: Rel;
  tracks: Rel;
  pseudo?: string | null;
  avatar_key?: string | null;
  photo_url?: string | null;
  founder?: boolean | null;
  access_until?: string | null;
  member_number?: number | null;
};

const FULL = "status, pseudo, avatar_key, photo_url, founder, access_until, member_number, levels(code), tracks(code)";
const BASIC = "status, levels(code), tracks(code)"; // before migration 0034

/** Who is signed in, as the static pages need it. Never throws. */
export async function loadMe(supabase: SupabaseClient): Promise<Me> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, student: null, ambassador: null, flags: { level1bac: FEATURES.level1bac } };

  let sp: StudentRow | null = null;
  const full = await supabase.from("student_profiles").select(FULL).eq("id", user.id).maybeSingle();
  if (!full.error) {
    sp = full.data as StudentRow | null;
  } else {
    const basic = await supabase.from("student_profiles").select(BASIC).eq("id", user.id).maybeSingle();
    sp = (basic.data as StudentRow | null) ?? null;
  }

  const amb = await supabase.from("ambassadors").select("status, code, pseudo").eq("user_id", user.id).maybeSingle();

  const level = sp ? relCode(sp.levels) : null;
  const track = sp ? relCode(sp.tracks) : null;

  return {
    user: { id: user.id, email: user.email ?? null },
    student: sp
      ? {
          pseudo: sp.pseudo ?? null,
          avatarKey: sp.avatar_key ?? null,
          photoUrl: sp.photo_url ?? null,
          level,
          track,
          stream: streamForTrack(level, track),
          status: sp.status,
          founder: sp.founder ?? false,
          accessUntil: sp.access_until ?? null,
          memberNumber: sp.member_number ?? null,
          complete: !!(level && track),
        }
      : null,
    ambassador: amb.error || !amb.data ? null : (amb.data as { status: string; code: string; pseudo: string }),
    flags: { level1bac: FEATURES.level1bac },
  };
}
