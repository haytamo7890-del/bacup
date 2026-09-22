-- =====================================================================
--  Exercise bank — batch 1 : +6 original "type-Bac" QCU per SM chapter,
--  appended to the existing per-chapter QCU exercise (positions 9–14),
--  then propagated to SM-B / PC / SVT (matched by exam title).
--  Original items (inspired by standard exercise types, none copied).
--  Run ONCE in Supabase → SQL Editor.
-- =====================================================================

do $bank$
declare v_q uuid;
  ex_suites uuid := 'a561ec8c-0e41-4c23-989c-b71a36b8a38d';
  ex_limites uuid := 'b1c3e6f3-9d6d-4cf2-9dfa-2c772fca5d58';
  ex_deriv uuid := '028c26e3-5c81-477a-911e-43fbdd8b2b2e';
  ex_integ uuid := '04bbe9a1-fe5f-4fd3-af56-912e6cdab9cf';
  ex_cplx uuid := '15b7e6f1-0a7f-4ea9-b1df-6f26e9dc7c9d';
  ex_struct uuid := '1beadd35-1919-44cf-8f06-e33705e41d30';
  ex_arith uuid := '1402c718-c7a1-4d91-97ce-0ef96c0b6d51';
  ex_proba uuid := 'cdfa9eed-022d-48b3-ae22-f5afb54b1891';
begin
  -- guard: skip if batch already applied (position 9 present on limites)
  if exists (select 1 from questions where exercise_id = ex_limites and position = 9) then
    raise notice 'batch already applied'; return;
  end if;

  -- ============ LIMITES ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_limites,'mcq',$SS$Calculer $\lim_{x \to +\infty}\left(\sqrt{x^{2}+3x}-x\right)$.$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{3}{2}$$OO$,true,1),(v_q,$OO$$3$$OO$,false,2),(v_q,$OO$$0$$OO$,false,3),(v_q,$OO$$+\infty$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Conjuguée : $\frac{3x}{\sqrt{x^{2}+3x}+x} \to \frac{3}{2}$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_limites,'mcq',$SS$Calculer $\lim_{x \to 0}\frac{\sqrt{1+x}-1}{x}$.$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{1}{2}$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$0$$OO$,false,3),(v_q,$OO$$2$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Conjuguée : $\frac{1}{\sqrt{1+x}+1} \to \frac{1}{2}$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_limites,'mcq',$SS$Calculer $\lim_{x \to +\infty}\frac{x-\sin x}{x+\sin x}$.$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$1$$OO$,true,1),(v_q,$OO$$0$$OO$,false,2),(v_q,$OO$$-1$$OO$,false,3),(v_q,$OO$$+\infty$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$On divise par $x$ : $\frac{1-\frac{\sin x}{x}}{1+\frac{\sin x}{x}} \to 1$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_limites,'mcq',$SS$$f$ continue sur $[0, 2]$, $f(0)=1$, $f(2)=5$. La valeur $3$ est-elle atteinte ?$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$Oui, d'après le TVI$OO$,true,1),(v_q,$OO$Non$OO$,false,2),(v_q,$OO$Seulement si $f$ monotone$OO$,false,3),(v_q,$OO$On ne peut pas savoir$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$3$ est entre $1$ et $5$ : par le TVI, $\exists c,\ f(c)=3$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_limites,'mcq',$SS$Calculer $\lim_{x \to 1}\frac{x^{3}-1}{x-1}$.$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$3$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$0$$OO$,false,3),(v_q,$OO$$+\infty$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$x^{3}-1=(x-1)(x^{2}+x+1) \to 3$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_limites,'mcq',$SS$$x \mapsto \frac{\sin x}{x}$ prolongeable par continuité en $0$ ; quelle valeur ?$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$1$$OO$,true,1),(v_q,$OO$$0$$OO$,false,2),(v_q,$OO$$+\infty$$OO$,false,3),(v_q,$OO$non prolongeable$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\lim_{x\to0}\frac{\sin x}{x}=1$, donc $f(0)=1$.$LL$);

  -- ============ SUITES ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_suites,'mcq',$SS$$u_{n+1}=3u_n-4$ converge vers $\ell$. Point fixe ?$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2$$OO$,true,1),(v_q,$OO$$4$$OO$,false,2),(v_q,$OO$$-2$$OO$,false,3),(v_q,$OO$$-4$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\ell=3\ell-4 \Rightarrow \ell=2$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_suites,'mcq',$SS$Calculer $\lim_{n \to +\infty}\frac{2^{n}}{n^{2}}$.$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$+\infty$$OO$,true,1),(v_q,$OO$$0$$OO$,false,2),(v_q,$OO$$2$$OO$,false,3),(v_q,$OO$$1$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$L'exponentielle l'emporte : $\to +\infty$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_suites,'mcq',$SS$Calculer $\lim_{n \to +\infty}\frac{n^{2}+1}{2n^{2}-n}$.$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{1}{2}$$OO$,true,1),(v_q,$OO$$0$$OO$,false,2),(v_q,$OO$$2$$OO$,false,3),(v_q,$OO$$+\infty$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Terme dominant : $\frac{1}{2}$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_suites,'mcq',$SS$$(u_n)$ géométrique, $u_0=5$, $q=\frac{1}{2}$. Limite ?$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0$$OO$,true,1),(v_q,$OO$$5$$OO$,false,2),(v_q,$OO$$+\infty$$OO$,false,3),(v_q,$OO$$\frac{1}{2}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$u_n=5\left(\frac12\right)^{n}\to 0$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_suites,'mcq',$SS$Calculer $\lim_{n \to +\infty}\sum_{k=0}^{n}\left(\frac{1}{2}\right)^{k}$.$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$\frac{1}{2}$$OO$,false,3),(v_q,$OO$$+\infty$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Série géométrique : $\frac{1}{1-\frac12}=2$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_suites,'mcq',$SS$$u_0=3$, $u_{n+1}=\sqrt{u_n}$ converge vers $\ell$. $\ell = ?$$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$1$$OO$,true,1),(v_q,$OO$$0$$OO$,false,2),(v_q,$OO$$3$$OO$,false,3),(v_q,$OO$$\sqrt{3}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\ell=\sqrt{\ell}\Rightarrow \ell=1$.$LL$);

  -- ============ DERIVATION ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_deriv,'mcq',$SS$Dériver $f(x)=x\ln x$.$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\ln x + 1$$OO$,true,1),(v_q,$OO$$\frac{1}{x}$$OO$,false,2),(v_q,$OO$$\ln x$$OO$,false,3),(v_q,$OO$$1$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$(x\ln x)' = \ln x + x\cdot\frac1x = \ln x + 1$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_deriv,'mcq',$SS$Dériver $f(x)=x e^{x}$.$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$(1+x)e^{x}$$OO$,true,1),(v_q,$OO$$e^{x}$$OO$,false,2),(v_q,$OO$$x e^{x}$$OO$,false,3),(v_q,$OO$$(x-1)e^{x}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$(xe^x)' = e^x + xe^x = (1+x)e^x$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_deriv,'mcq',$SS$Tangente à $f(x)=e^{x}$ au point d'abscisse $0$ :$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$y=x+1$$OO$,true,1),(v_q,$OO$$y=x$$OO$,false,2),(v_q,$OO$$y=ex$$OO$,false,3),(v_q,$OO$$y=1$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$f'(0)=1$, $f(0)=1$ : $y=x+1$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_deriv,'mcq',$SS$Calculer $\lim_{x \to +\infty} x e^{-x}$.$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0$$OO$,true,1),(v_q,$OO$$+\infty$$OO$,false,2),(v_q,$OO$$1$$OO$,false,3),(v_q,$OO$$-\infty$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$xe^{-x}=\frac{x}{e^{x}}\to 0$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_deriv,'mcq',$SS$Une primitive de $\frac{2x}{x^{2}+1}$ :$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\ln(x^{2}+1)$$OO$,true,1),(v_q,$OO$$\frac{1}{x^{2}+1}$$OO$,false,2),(v_q,$OO$$2\ln x$$OO$,false,3),(v_q,$OO$$(x^{2}+1)^{2}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Forme $\frac{u'}{u}$ : primitive $\ln(x^{2}+1)$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_deriv,'mcq',$SS$Solution générale de $y'' - y = 0$ :$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$A e^{x} + B e^{-x}$$OO$,true,1),(v_q,$OO$$A e^{x}$$OO$,false,2),(v_q,$OO$$A\cos x + B\sin x$$OO$,false,3),(v_q,$OO$$(A+Bx)e^{x}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Équation caractéristique $r^{2}-1=0$, $r=\pm1$ : $A e^{x}+B e^{-x}$.$LL$);

  -- ============ INTEGRALE ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_integ,'mcq',$SS$Calculer $\int_{0}^{\pi}\sin x\,dx$.$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2$$OO$,true,1),(v_q,$OO$$0$$OO$,false,2),(v_q,$OO$$1$$OO$,false,3),(v_q,$OO$$\pi$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$[-\cos x]_0^{\pi} = 1+1 = 2$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_integ,'mcq',$SS$Calculer $\int_{1}^{2}\frac{1}{x}\,dx$.$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\ln 2$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$\frac{1}{2}$$OO$,false,3),(v_q,$OO$$\ln\frac{1}{2}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$[\ln x]_1^2 = \ln 2$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_integ,'mcq',$SS$Calculer $\int_{0}^{1}e^{2x}\,dx$.$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{e^{2}-1}{2}$$OO$,true,1),(v_q,$OO$$e^{2}-1$$OO$,false,2),(v_q,$OO$$\frac{e^{2}}{2}$$OO$,false,3),(v_q,$OO$$2(e^{2}-1)$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\left[\frac{e^{2x}}{2}\right]_0^1 = \frac{e^{2}-1}{2}$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_integ,'mcq',$SS$Valeur moyenne de $f(x)=x^{2}$ sur $[0,3]$ :$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$3$$OO$,true,1),(v_q,$OO$$9$$OO$,false,2),(v_q,$OO$$\frac{1}{3}$$OO$,false,3),(v_q,$OO$$27$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\frac{1}{3}\int_0^3 x^2 = \frac{1}{3}\cdot 9 = 3$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_integ,'mcq',$SS$Calculer $\int_{-2}^{2}x^{3}\,dx$.$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0$$OO$,true,1),(v_q,$OO$$8$$OO$,false,2),(v_q,$OO$$16$$OO$,false,3),(v_q,$OO$$4$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$x^{3}$ est impaire : $\int_{-2}^{2}=0$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_integ,'mcq',$SS$Aire sous $f(x)=2x$ sur $[0,3]$ :$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$9$$OO$,true,1),(v_q,$OO$$6$$OO$,false,2),(v_q,$OO$$3$$OO$,false,3),(v_q,$OO$$18$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\int_0^3 2x = [x^{2}]_0^3 = 9$.$LL$);

  -- ============ COMPLEXES ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_cplx,'mcq',$SS$Que vaut $|(1+i)^{4}|$ ?$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$4$$OO$,true,1),(v_q,$OO$$2$$OO$,false,2),(v_q,$OO$$\sqrt{2}$$OO$,false,3),(v_q,$OO$$16$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$|1+i|=\sqrt2$, donc $|(1+i)^4|=(\sqrt2)^4=4$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_cplx,'mcq',$SS$Calculer $(1+i)^{2}$.$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2i$$OO$,true,1),(v_q,$OO$$2$$OO$,false,2),(v_q,$OO$$1+2i$$OO$,false,3),(v_q,$OO$$-2i$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$(1+i)^2 = 1+2i-1 = 2i$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_cplx,'mcq',$SS$Forme exponentielle de $-1$ :$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$e^{i\pi}$$OO$,true,1),(v_q,$OO$$e^{i\pi/2}$$OO$,false,2),(v_q,$OO$$1$$OO$,false,3),(v_q,$OO$$e^{-i\pi/2}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$-1 = \cos\pi + i\sin\pi = e^{i\pi}$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_cplx,'mcq',$SS$Les solutions de $z^{2}=-1$ sont :$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\pm i$$OO$,true,1),(v_q,$OO$$\pm 1$$OO$,false,2),(v_q,$OO$$i$$OO$,false,3),(v_q,$OO$$1 \pm i$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$z^{2}=-1 \Rightarrow z = i$ ou $z=-i$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_cplx,'mcq',$SS$$A$ et $B$ ont pour affixes $1$ et $i$. La distance $AB$ vaut :$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\sqrt{2}$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$2$$OO$,false,3),(v_q,$OO$$0$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$AB = |i-1| = \sqrt{2}$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_cplx,'mcq',$SS$Le conjugué de $e^{i\theta}$ est :$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$e^{-i\theta}$$OO$,true,1),(v_q,$OO$$-e^{i\theta}$$OO$,false,2),(v_q,$OO$$e^{i\theta}$$OO$,false,3),(v_q,$OO$$i e^{i\theta}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\overline{e^{i\theta}} = \cos\theta - i\sin\theta = e^{-i\theta}$.$LL$);

  -- ============ STRUCTURES ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_struct,'mcq',$SS$Élément neutre de $(\mathbb{Z}, +)$ :$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$-1$$OO$,false,3),(v_q,$OO$il n'y en a pas$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$n+0=n$ : le neutre de $+$ est $0$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_struct,'mcq',$SS$$(\mathbb{R}^{*}, \times)$ est-il un groupe ?$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$Oui (abélien)$OO$,true,1),(v_q,$OO$Non, pas de neutre$OO$,false,2),(v_q,$OO$Non, pas associatif$OO$,false,3),(v_q,$OO$Non$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\times$ associative, neutre $1$, tout $x\neq0$ a un inverse $\frac1x$ : groupe abélien.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_struct,'mcq',$SS$Symétrique de $3$ dans $(\mathbb{R}^{*}, \times)$ :$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{1}{3}$$OO$,true,1),(v_q,$OO$$-3$$OO$,false,2),(v_q,$OO$$3$$OO$,false,3),(v_q,$OO$$1$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$3 \times \frac13 = 1$ : symétrique $\frac13$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_struct,'mcq',$SS$Combien d'éléments possède $\mathbb{Z}/2\mathbb{Z}$ ?$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$3$$OO$,false,3),(v_q,$OO$une infinité$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Les classes $\bar 0$ et $\bar 1$ : $2$ éléments.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_struct,'mcq',$SS$Dans un espace vectoriel, $0 \cdot u$ vaut :$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0_E$$OO$,true,1),(v_q,$OO$$u$$OO$,false,2),(v_q,$OO$$-u$$OO$,false,3),(v_q,$OO$$1$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$0 \cdot u = 0_E$ (le vecteur nul).$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_struct,'mcq',$SS$La famille $\{(1,0),(0,1),(1,1)\}$ de $\mathbb{R}^{2}$ est :$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$liée$OO$,true,1),(v_q,$OO$libre$OO$,false,2),(v_q,$OO$une base$OO$,false,3),(v_q,$OO$libre et génératrice$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$3$ vecteurs dans un espace de dimension $2$ : la famille est liée ($(1,1)=(1,0)+(0,1)$).$LL$);

  -- ============ ARITHMETIQUE ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_arith,'mcq',$SS$Que vaut $\gcd(15, 25)$ ?$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$5$$OO$,true,1),(v_q,$OO$$1$$OO$,false,2),(v_q,$OO$$3$$OO$,false,3),(v_q,$OO$$75$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$15=3\times5$, $25=5^{2}$ : $\gcd=5$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_arith,'mcq',$SS$Que vaut $17 \bmod 5$ ?$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2$$OO$,true,1),(v_q,$OO$$3$$OO$,false,2),(v_q,$OO$$1$$OO$,false,3),(v_q,$OO$$4$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$17=5\times3+2$ : reste $2$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_arith,'mcq',$SS$Que vaut $2^{100} \bmod 3$ ?$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$1$$OO$,true,1),(v_q,$OO$$2$$OO$,false,2),(v_q,$OO$$0$$OO$,false,3),(v_q,$OO$$4$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$2\equiv-1\pmod3$, donc $2^{100}\equiv 1$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_arith,'mcq',$SS$Combien y a-t-il de nombres premiers strictement inférieurs à $10$ ?$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$4$$OO$,true,1),(v_q,$OO$$3$$OO$,false,2),(v_q,$OO$$5$$OO$,false,3),(v_q,$OO$$2$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$2, 3, 5, 7$ : quatre nombres premiers.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_arith,'mcq',$SS$Que vaut $\operatorname{ppcm}(4, 6)$ ?$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$12$$OO$,true,1),(v_q,$OO$$24$$OO$,false,2),(v_q,$OO$$2$$OO$,false,3),(v_q,$OO$$6$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\gcd(4,6)=2$, donc $\operatorname{ppcm}=\frac{4\times6}{2}=12$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_arith,'mcq',$SS$Résoudre $5x \equiv 1 \pmod 3$.$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$x \equiv 2 \pmod 3$$OO$,true,1),(v_q,$OO$$x \equiv 1 \pmod 3$$OO$,false,2),(v_q,$OO$$x \equiv 0 \pmod 3$$OO$,false,3),(v_q,$OO$pas de solution$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$5\equiv2$, donc $2x\equiv1\pmod3$ ; $2\times2=4\equiv1$ : $x\equiv2$.$LL$);

  -- ============ PROBA ============
  insert into questions (exercise_id,kind,statement,points,position) values (ex_proba,'mcq',$SS$Que vaut $\binom{6}{2}$ ?$SS$,2.5,9) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$15$$OO$,true,1),(v_q,$OO$$30$$OO$,false,2),(v_q,$OO$$12$$OO$,false,3),(v_q,$OO$$36$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\binom{6}{2}=\frac{6\times5}{2}=15$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_proba,'mcq',$SS$On lance un dé équilibré. $P(\text{résultat pair})$ vaut :$SS$,2.5,10) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{1}{2}$$OO$,true,1),(v_q,$OO$$\frac{1}{3}$$OO$,false,2),(v_q,$OO$$\frac{2}{3}$$OO$,false,3),(v_q,$OO$$\frac{1}{6}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\{2,4,6\}$ sur $6$ : $\frac{3}{6}=\frac12$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_proba,'mcq',$SS$On lance deux pièces équilibrées. $P(\text{deux piles})$ vaut :$SS$,2.5,11) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{1}{4}$$OO$,true,1),(v_q,$OO$$\frac{1}{2}$$OO$,false,2),(v_q,$OO$$\frac{1}{3}$$OO$,false,3),(v_q,$OO$$\frac{3}{4}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\frac12\times\frac12=\frac14$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_proba,'mcq',$SS$$X \sim \mathcal{B}(10, 0{,}5)$. $E(X)$ vaut :$SS$,2.5,12) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$5$$OO$,true,1),(v_q,$OO$$10$$OO$,false,2),(v_q,$OO$$2{,}5$$OO$,false,3),(v_q,$OO$$0{,}5$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$E(X)=np=10\times0{,}5=5$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_proba,'mcq',$SS$$A, B$ indépendants, $P(A)=0{,}3$, $P(B)=0{,}5$. $P(A\cap B)$ vaut :$SS$,2.5,13) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0{,}15$$OO$,true,1),(v_q,$OO$$0{,}8$$OO$,false,2),(v_q,$OO$$0{,}5$$OO$,false,3),(v_q,$OO$$0{,}3$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Indépendance : $P(A\cap B)=P(A)P(B)=0{,}3\times0{,}5=0{,}15$.$LL$);
  insert into questions (exercise_id,kind,statement,points,position) values (ex_proba,'mcq',$SS$Une urne a $5$ boules dont $3$ rouges. On en tire $2$ (sans remise). $P(\text{2 rouges})$ vaut :$SS$,2.5,14) returning id into v_q;
  insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\frac{3}{10}$$OO$,true,1),(v_q,$OO$$\frac{1}{10}$$OO$,false,2),(v_q,$OO$$\frac{2}{5}$$OO$,false,3),(v_q,$OO$$\frac{9}{25}$$OO$,false,4);
  insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\frac{\binom{3}{2}}{\binom{5}{2}}=\frac{3}{10}$.$LL$);
end $bank$;

-- ================= PROPAGATE new questions to SM-B / PC / SVT =================
do $prop$
declare r_q record; r_ex record; v_q uuid;
  subj uuid := '7d10f167-723e-4764-8df2-ea6371d05b3c';
  sma uuid := 'dfad244d-1da5-4b16-91d1-f085cd0f1bbf';
begin
  for r_q in
    select q.id, q.kind, q.statement, q.points, q.position, x.title as exam_title
    from questions q join exercises e on e.id=q.exercise_id join exams x on x.id=e.exam_id
    where x.subject_id=subj and x.track_id=sma and x.exam_type='blanc' and q.position >= 9
  loop
    for r_ex in
      select e2.id from exercises e2 join exams x2 on x2.id=e2.exam_id
      where x2.subject_id=subj and x2.exam_type='blanc' and x2.title=r_q.exam_title
        and x2.track_id in ('7434574e-e9b5-4850-96e6-da033d4f7813','e7e1bebf-e67a-4813-bcd7-5c7de27f6bad','36b37422-2f6b-40e3-bd70-6410c2966135')
    loop
      if not exists (select 1 from questions q2 where q2.exercise_id=r_ex.id and q2.statement=r_q.statement) then
        insert into questions (exercise_id,kind,statement,points,position) values (r_ex.id,r_q.kind,r_q.statement,r_q.points,r_q.position) returning id into v_q;
        insert into answer_options (question_id,label,is_correct,position) select v_q,label,is_correct,position from answer_options where question_id=r_q.id;
        insert into solutions (question_id,author,body) select v_q,author,body from solutions where question_id=r_q.id;
      end if;
    end loop;
  end loop;
end $prop$;

-- ============ GÉOMÉTRIE DANS L'ESPACE (Sc-Exp only: PC + SVT) ============
-- This chapter has no SM-A counterpart, so it is seeded directly for both tracks.
do $geo$
declare v_q uuid; ex uuid;
  targets uuid[] := array['bba58616-1d97-491b-822a-95b1c86fd299','fbc3c31d-6990-4bb6-b997-7f809ebde0bf'];
begin
  foreach ex in array targets loop
    if exists (select 1 from questions where exercise_id = ex and position = 9) then continue; end if;

    insert into questions (exercise_id,kind,statement,points,position) values (ex,'mcq',$SS$$\vec{u}(1,2,-1)$ et $\vec{v}(3,-1,1)$. Le produit scalaire $\vec{u}\cdot\vec{v}$ vaut :$SS$,2.5,9) returning id into v_q;
    insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$0$$OO$,true,1),(v_q,$OO$$2$$OO$,false,2),(v_q,$OO$$-4$$OO$,false,3),(v_q,$OO$$6$$OO$,false,4);
    insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$1\times3+2\times(-1)+(-1)\times1=3-2-1=0$ : vecteurs orthogonaux.$LL$);

    insert into questions (exercise_id,kind,statement,points,position) values (ex,'mcq',$SS$La norme du vecteur $\vec{u}(2,-1,2)$ vaut :$SS$,2.5,10) returning id into v_q;
    insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$3$$OO$,true,1),(v_q,$OO$$\sqrt{5}$$OO$,false,2),(v_q,$OO$$9$$OO$,false,3),(v_q,$OO$$5$$OO$,false,4);
    insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\|\vec{u}\|=\sqrt{4+1+4}=\sqrt{9}=3$.$LL$);

    insert into questions (exercise_id,kind,statement,points,position) values (ex,'mcq',$SS$Un vecteur normal au plan $2x-y+3z-5=0$ est :$SS$,2.5,11) returning id into v_q;
    insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$(2,-1,3)$$OO$,true,1),(v_q,$OO$$(2,1,3)$$OO$,false,2),(v_q,$OO$$(-5,0,0)$$OO$,false,3),(v_q,$OO$$(1,1,1)$$OO$,false,4);
    insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Les coefficients de $x,y,z$ donnent le vecteur normal $(2,-1,3)$.$LL$);

    insert into questions (exercise_id,kind,statement,points,position) values (ex,'mcq',$SS$Distance du point $O(0,0,0)$ au plan $x+2y+2z-6=0$ :$SS$,2.5,12) returning id into v_q;
    insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$2$$OO$,true,1),(v_q,$OO$$6$$OO$,false,2),(v_q,$OO$$3$$OO$,false,3),(v_q,$OO$$\frac{6}{5}$$OO$,false,4);
    insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$d=\frac{|{-6}|}{\sqrt{1+4+4}}=\frac{6}{3}=2$.$LL$);

    insert into questions (exercise_id,kind,statement,points,position) values (ex,'mcq',$SS$Le produit vectoriel $\vec{i}\wedge\vec{j}$ vaut :$SS$,2.5,13) returning id into v_q;
    insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$\vec{k}$$OO$,true,1),(v_q,$OO$$-\vec{k}$$OO$,false,2),(v_q,$OO$$\vec{0}$$OO$,false,3),(v_q,$OO$$\vec{i}$$OO$,false,4);
    insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$Repère orthonormé direct : $\vec{i}\wedge\vec{j}=\vec{k}$.$LL$);

    insert into questions (exercise_id,kind,statement,points,position) values (ex,'mcq',$SS$$\vec{u}$ et $\vec{v}$ tels que $\|\vec{u}\|=2$, $\|\vec{v}\|=3$, angle $\frac{\pi}{3}$. Alors $\vec{u}\cdot\vec{v}=$ :$SS$,2.5,14) returning id into v_q;
    insert into answer_options (question_id,label,is_correct,position) values (v_q,$OO$$3$$OO$,true,1),(v_q,$OO$$6$$OO$,false,2),(v_q,$OO$$\frac{3\sqrt{3}}{2}$$OO$,false,3),(v_q,$OO$$0$$OO$,false,4);
    insert into solutions (question_id,author,body) values (v_q,'hsgenius',$LL$$\vec{u}\cdot\vec{v}=\|\vec{u}\|\|\vec{v}\|\cos\frac{\pi}{3}=2\times3\times\frac12=3$.$LL$);
  end loop;
end $geo$;
