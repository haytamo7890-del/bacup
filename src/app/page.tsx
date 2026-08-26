import { createSupabaseClient } from "@/lib/supabase";

export default async function Home() {
  let tracks: { code: string; name: string }[] = [];
  let errorMsg: string | null = null;

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("tracks")
      .select("code, name")
      .order("name");
    if (error) errorMsg = error.message;
    else tracks = data ?? [];
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Erreur inconnue";
  }

  const connected = !errorMsg;

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        {/* logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white grid place-items-center font-extrabold">
            H
          </div>
          <span className="text-lg font-bold tracking-tight">HSGenius</span>
        </div>

        <span
          className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border ${
            connected
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : "text-red-700 bg-red-50 border-red-100"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {connected
            ? "Phase 1 — connecté à la base de données"
            : "Base de données non connectée"}
        </span>

        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Le coach IA du BAC marocain.
        </h1>

        {/* live data from the DB */}
        <div className="mt-8 rounded-2xl border border-neutral-200 p-5">
          <div className="text-sm font-semibold text-neutral-700 mb-3">
            Filières {connected && "(en direct depuis ta base de données)"}
          </div>

          {errorMsg ? (
            <p className="text-sm text-red-600">
              Erreur : {errorMsg}
              <br />
              <span className="text-neutral-500">
                Astuce : as-tu redémarré le serveur après avoir créé .env.local ?
              </span>
            </p>
          ) : tracks.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucune filière trouvée.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {tracks.map((t) => (
                <li
                  key={t.code}
                  className="flex items-center gap-2 text-sm text-neutral-800 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2"
                >
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {t.code}
                  </span>
                  <span className="font-medium">{t.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          {connected
            ? `${tracks.length} filières lues depuis Supabase. Le stack complet fonctionne. 🎉`
            : "On corrige la connexion, puis les filières s'afficheront ici."}
        </p>
      </div>
    </main>
  );
}
