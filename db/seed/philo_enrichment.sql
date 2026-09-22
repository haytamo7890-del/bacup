-- =====================================================================
--  Philosophie — enrichissement : 2ᵉ leçon "تعميق" par notion (12) +
--  banques QCU en arabe (5 par notion). Idempotent (gardes not exists).
--  À exécuter UNE FOIS dans Supabase → SQL Editor.
--  (Le chapitre "منهجية الكتابة الفلسفية" et les 1ʳᵉˢ leçons sont déjà en base.)
-- =====================================================================

-- ---------- Partie A : leçons d'approfondissement (position 2) ----------
do $seed$
declare ch uuid; ph uuid := '1b4da9fa-f783-41ef-9a02-5406ce17aa2c';
  procedure_add text;
begin
  -- الشخص
  select id into ch from chapters where subject_id=ph and code='philo-personne';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: بين الحرية والضرورة والقيمة',$BODY$## الشخص بين الحرية والضرورة
:::mawqif فرويد
تتحدد الذات بضغط **اللاوعي**؛ فالأنا ليست سيدة في بيتها، مما يقيّد وهم الحرية المطلقة.
:::
:::mawqif مونيي (الشخصانية)
الشخص كائن **متعالٍ** قادر على تجاوز شروطه المادية عبر الالتزام والإبداع والانفتاح على الغير.
:::
## الشخص بوصفه قيمة (تعميق)
:::mawqif غوسدورف
قيمة الشخص في **بعده الأخلاقي والاجتماعي** وانفتاحه على الآخرين، لا في ذاته المنعزلة.
:::
:::khoulasa تركيب
الشخص توتر دائم بين ما يحدده (اللاوعي، المجتمع) وما يطمح إليه من حرية وكرامة؛ فهو مشروع لا معطى جاهز.
:::$BODY$,'cours',2);
  end if;

  -- الغير
  select id into ch from chapters where subject_id=ph and code='philo-autrui';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: معرفة الغير والبعد الأخلاقي',$BODY$## معرفة الغير (تعميق)
:::mawqif هوسرل
أدرك الغير بوصفه **أنا آخر** عبر التقمص انطلاقا من تشابهه معي في السلوك والتعبير.
:::
## البعد الأخلاقي للعلاقة
:::mawqif ليفيناس
العلاقة بالغير **أخلاقية** بالأساس؛ فوجه الغير يفرض مسؤولية لا متناهية تجاهه.
:::
:::mawqif كانط
ينبغي معاملة الغير دائما بوصفه **غاية** لا مجرد وسيلة.
:::
:::khoulasa تركيب
الغير ليس جحيما فحسب، بل شرط لوعيي وموضوع لمسؤولية أخلاقية؛ فالعلاقة به تتجاوز الصراع نحو الاعتراف.
:::$BODY$,'cours',2);
  end if;

  -- التاريخ
  select id into ch from chapters where subject_id=ph and code='philo-histoire';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: دور الإنسان وغائية التاريخ',$BODY$## دور الفرد والجماعات في التاريخ
:::mawqif كارلايل
يمثل **العظماء** (الأبطال) القوة المحركة للتاريخ ومصدر تحولاته الكبرى.
:::
:::mawqif ماركس
ليس الأفراد العظماء بل **الجماهير** وعلاقات الإنتاج من يصنع التاريخ الحقيقي.
:::
## نقد الوعي التاريخي
:::mawqif نيتشه
يحذّر نيتشه من الإفراط في المعرفة التاريخية؛ فالتاريخ ينبغي أن يخدم **الحياة**.
:::
:::khoulasa تركيب
يتجاذب صناعةَ التاريخ الفردُ والبنى الجماعية، وتبقى غائيته -تقدما أو صراعا- موضوع تأويل مفتوح.
:::$BODY$,'cours',2);
  end if;

  -- النظرية والتجربة
  select id into ch from chapters where subject_id=ph and code='philo-theorie';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: عوائق المعرفة ونسقية النظرية',$BODY$## العوائق الإبستمولوجية
:::mawqif غاستون باشلار
تبنى المعرفة العلمية **ضد** المعطى الحسي عبر تجاوز العوائق الإبستمولوجية؛ فالعلم يصحح أخطاءه باستمرار.
:::
## شمولية الاختبار
:::mawqif بيير دوهيم
لا تختبر الفرضية معزولة، بل ضمن **نسق نظري** كامل؛ فالتجربة تحاكم النظرية في مجموعها.
:::
:::khoulasa تركيب
المعرفة العلمية بناء عقلي تجريبي متجدد، لا يقين مطلق بل تقدم عبر التصحيح والمراجعة.
:::$BODY$,'cours',2);
  end if;

  -- العلوم الإنسانية
  select id into ch from chapters where subject_id=ph and code='philo-sh';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: توسيع مجال العلمية',$BODY$## توسيع موضوع الدراسة
:::mawqif فرويد
بجعله **اللاوعي** موضوعا للدراسة، وسّع فرويد مجال المعرفة العلمية بالإنسان.
:::
## الفهم والحياد
:::mawqif ماكس فيبر
يقوم منهج العلوم الإنسانية على **الفهم التأويلي** للفعل الاجتماعي مع السعي إلى الحياد القيمي.
:::
:::khoulasa تركيب
تنشد العلوم الإنسانية الموضوعية عبر مناهج متنوعة (فهم، بنية، تحليل) رغم خصوصية موضوعها الإنساني.
:::$BODY$,'cours',2);
  end if;

  -- الحقيقة
  select id into ch from chapters where subject_id=ph and code='philo-verite';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: نسبية الحقيقة وقيمتها',$BODY$## نقد الحقيقة المطلقة
:::mawqif نيتشه
ينتقد نيتشه فكرة الحقيقة المطلقة؛ فالحقائق في نظره **استعارات** وأوهام نافعة للحياة.
:::
## تاريخانية الحقيقة العلمية
:::mawqif باشلار
الحقيقة العلمية **نسبية** وقابلة للمراجعة؛ فما يعد صحيحا اليوم قد يصحح غدا.
:::
:::khoulasa تركيب
الحقيقة قيمة معرفية وأخلاقية ينشدها الإنسان، لكنها نسبية ومتطورة لا نهائية مطلقة.
:::$BODY$,'cours',2);
  end if;

  -- الدولة
  select id into ch from chapters where subject_id=ph and code='philo-etat';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: الدولة بين الحق والهيمنة',$BODY$## الدولة الحامية للحقوق
:::mawqif جون لوك
تقوم الدولة لحماية **الحقوق الطبيعية** (الحياة، الحرية، الملكية)؛ وسلطتها مقيدة ومشروطة برضى المحكومين.
:::
## الهيمنة الإيديولوجية
:::mawqif غرامشي
تمارس الدولة **الهيمنة** لا بالإكراه فقط، بل بالإقناع الإيديولوجي وصناعة القبول.
:::
:::khoulasa تركيب
تتأرجح الدولة بين خدمة الحق العام وممارسة السلطة؛ ومشروعيتها رهينة بغاياتها في تحقيق الأمن والحرية والعدالة.
:::$BODY$,'cours',2);
  end if;

  -- العنف
  select id into ch from chapters where subject_id=ph and code='philo-violence';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: من العنف إلى الحق',$BODY$## العنف والسلطة
:::mawqif حنة أرندت
تميز أرندت بين **العنف** و**السلطة**؛ فالعنف أداتي ويظهر غالبا حين تنهار السلطة الشرعية لا حين تقوى.
:::
## تجاوز العنف
:::mawqif إريك فايل
الغاية هي تجاوز العنف نحو **الحوار والعقلانية**؛ فالفلسفة رهان على اللاعنف.
:::
:::khoulasa تركيب
العنف ظاهرة إنسانية وتاريخية، لكن تجاوزه نحو الحق والحوار يظل أفقا أخلاقيا وسياسيا.
:::$BODY$,'cours',2);
  end if;

  -- الحق والعدالة
  select id into ch from chapters where subject_id=ph and code='philo-justice';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: المساواة والإنصاف',$BODY$## أشكال المساواة
:::mawqif أرسطو
يميز أرسطو بين **المساواة الحسابية** (التساوي المطلق) و**المساواة الهندسية** (بحسب الاستحقاق).
:::
## نقد العدالة الشكلية
:::mawqif ماركس
ينتقد ماركس العدالة **الشكلية** التي تعلن المساواة في القانون بينما تبقى اللامساواة قائمة في الواقع الاقتصادي.
:::
:::mawqif جون راولز
مبدأ الفرق: لا تبرَّر اللامساواة إلا إذا خدمت وضع الفئات **الأقل حظا**.
:::
:::khoulasa تركيب
العدالة توازن دقيق بين المساواة والإنصاف والحرية بما يضمن العيش المشترك العادل.
:::$BODY$,'cours',2);
  end if;

  -- الواجب
  select id into ch from chapters where subject_id=ph and code='philo-devoir';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: الواجب بين الإلزام والتجاوز',$BODY$## الأخلاق المفتوحة
:::mawqif برغسون
تتجاوز **الأخلاق المفتوحة** إلزام المجتمع نحو نداء إنساني كوني مصدره الحب والإبداع الأخلاقي.
:::
## نقد الأخلاق التقليدية
:::mawqif نيتشه
ينتقد نيتشه أخلاق الواجب التقليدية (أخلاق القطيع) ويدعو إلى **تجاوز القيم** وخلق قيم جديدة.
:::
:::khoulasa تركيب
يتوزع مصدر الواجب بين إلزام العقل (كانط)، وضغط المجتمع (دوركايم)، وأفق التجاوز (برغسون/نيتشه).
:::$BODY$,'cours',2);
  end if;

  -- السعادة
  select id into ch from chapters where subject_id=ph and code='philo-bonheur';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: التباس السعادة',$BODY$## السعادة مثل أعلى
:::mawqif كانط
السعادة **مثل أعلى للخيال** لا يمكن تحديده بدقة؛ لذا لا تصلح أساسا ثابتا للأخلاق، بل يستحقها الإنسان بالفضيلة.
:::
## نظرة تشاؤمية
:::mawqif شوبنهاور
تتأرجح الحياة بين الألم والملل؛ فالسعادة في نظره **سلبية**، أي مجرد غياب مؤقت للألم.
:::
:::khoulasa تركيب
السعادة مطلب ملتبس يتقاطع فيه اللذة والفضيلة والواجب، ويظل نسبيا بحسب تصور كل إنسان للحياة.
:::$BODY$,'cours',2);
  end if;

  -- الحرية
  select id into ch from chapters where subject_id=ph and code='philo-liberte';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=2) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'تعميق: الحرية والمسؤولية',$BODY$## الحرية شرط الأخلاق
:::mawqif كانط
الحرية **شرط** الأخلاق؛ فلا واجب دون حرية، ومبدؤه: أنت تستطيع لأنك يجب أن تفعل.
:::
## الحرية التزام
:::mawqif مونيي
الحرية **التزام ومسؤولية** تجاه الغير والعالم، لا مجرد تحرر من كل قيد.
:::
:::khoulasa تركيب
الحرية ليست غياب كل ضرورة، بل وعي بها وتحمل للمسؤولية ضمن قانون عادل نشرعه لأنفسنا.
:::$BODY$,'cours',2);
  end if;
end $seed$;

-- ---------- Partie B : banques QCU (arabe, 5 par notion) ----------
create or replace function ph_qadd(p_ex uuid, p_pos int, p_stmt text, p_ok text, p_w1 text, p_w2 text, p_w3 text, p_sol text) returns void as $f$
declare v uuid;
begin
  if p_ex is null then return; end if;
  insert into questions(exercise_id,kind,statement,points,position) values(p_ex,'mcq',p_stmt,1,p_pos) returning id into v;
  insert into answer_options(question_id,label,is_correct,position) values (v,p_ok,true,1),(v,p_w1,false,2),(v,p_w2,false,3),(v,p_w3,false,4);
  insert into solutions(question_id,author,body) values(v,'hsgenius',p_sol);
end;$f$ language plpgsql;

create or replace function ph_bank(p_code text, p_title text) returns uuid as $f$
declare v_ch uuid; v_exam uuid; v_ex uuid; ph uuid := '1b4da9fa-f783-41ef-9a02-5406ce17aa2c';
begin
  select id into v_ch from chapters where subject_id=ph and code=p_code limit 1;
  if v_ch is null then return null; end if;
  select e.id into v_ex from exercises e join exams x on x.id=e.exam_id where e.chapter_id=v_ch and x.exam_type='blanc' limit 1;
  if v_ex is not null then return v_ex; end if;
  insert into exams(education_system_id,level_id,subject_id,exam_type,year,title)
    values('0d526d50-8f93-4e38-8e3f-16f87b7f765d','6d6bf268-12f2-454f-a8ab-aa7d395d067b',ph,'blanc',2026,p_title) returning id into v_exam;
  insert into exercises(subject_id,chapter_id,exam_id,source,position,title)
    values(ph,v_ch,v_exam,'hsgenius',1,'QCU') returning id into v_ex;
  return v_ex;
end;$f$ language plpgsql;

do $qcu$
declare ex uuid;
begin
  ex := ph_bank('philo-personne','الشخص — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من قال: أنا أفكر إذن أنا موجود؟$QQ$,$QQ$ديكارت$QQ$,$QQ$كانط$QQ$,$QQ$سارتر$QQ$,$QQ$فرويد$QQ$,$QQ$الوعي أساس الهوية عند ديكارت.$QQ$);
    perform ph_qadd(ex,2,$QQ$من اعتبر الشخص غاية في ذاته لا مجرد وسيلة؟$QQ$,$QQ$كانط$QQ$,$QQ$هيوم$QQ$,$QQ$ماركس$QQ$,$QQ$نيتشه$QQ$,$QQ$كرامة الشخص عند كانط.$QQ$);
    perform ph_qadd(ex,3,$QQ$من ربط هوية الشخص بالذاكرة واستمرار الوعي؟$QQ$,$QQ$جون لوك$QQ$,$QQ$ديكارت$QQ$,$QQ$سبينوزا$QQ$,$QQ$أرسطو$QQ$,$QQ$الذاكرة أساس الهوية عند لوك.$QQ$);
    perform ph_qadd(ex,4,$QQ$من أبرز دور اللاوعي في تحديد الذات؟$QQ$,$QQ$فرويد$QQ$,$QQ$كانط$QQ$,$QQ$ديكارت$QQ$,$QQ$لوك$QQ$,$QQ$اللاوعي يقيد وهم الحرية المطلقة.$QQ$);
    perform ph_qadd(ex,5,$QQ$الشخص بوصفه قيمة يعني أن له:$QQ$,$QQ$كرامة لا تقدر بثمن$QQ$,$QQ$ثمنا ماديا$QQ$,$QQ$وظيفة نفعية فقط$QQ$,$QQ$قيمة متغيرة$QQ$,$QQ$الكرامة مقابل الثمن (كانط).$QQ$);
  end if;

  ex := ph_bank('philo-autrui','الغير — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من قال: الجحيم هو الآخرون؟$QQ$,$QQ$سارتر$QQ$,$QQ$هيجل$QQ$,$QQ$كانط$QQ$,$QQ$ليفيناس$QQ$,$QQ$نظرة الغير تحولني إلى موضوع.$QQ$);
    perform ph_qadd(ex,2,$QQ$من ربط وعي الذات بالاعتراف المتبادل؟$QQ$,$QQ$هيجل$QQ$,$QQ$ديكارت$QQ$,$QQ$هيوم$QQ$,$QQ$إبيقور$QQ$,$QQ$جدل السيد والعبد.$QQ$);
    perform ph_qadd(ex,3,$QQ$من جعل العلاقة بالغير علاقة أخلاقية ومسؤولية؟$QQ$,$QQ$ليفيناس$QQ$,$QQ$سارتر$QQ$,$QQ$ماركس$QQ$,$QQ$نيتشه$QQ$,$QQ$وجه الغير يفرض المسؤولية.$QQ$);
    perform ph_qadd(ex,4,$QQ$معرفة الغير عبر التقمص (المماثلة) مرتبطة بـ:$QQ$,$QQ$هوسرل$QQ$,$QQ$هوبز$QQ$,$QQ$أرسطو$QQ$,$QQ$دوركايم$QQ$,$QQ$الغير أنا آخر (هوسرل).$QQ$);
    perform ph_qadd(ex,5,$QQ$وجود الغير بالنسبة للذات:$QQ$,$QQ$شرط لوعيها بذاتها$QQ$,$QQ$لا أهمية له$QQ$,$QQ$يلغي الذات$QQ$,$QQ$مجرد شيء$QQ$,$QQ$الغير وسيط ضروري.$QQ$);
  end if;

  ex := ph_bank('philo-histoire','التاريخ — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من أسس علم العمران البشري؟$QQ$,$QQ$ابن خلدون$QQ$,$QQ$هيجل$QQ$,$QQ$ماركس$QQ$,$QQ$ريكور$QQ$,$QQ$قوانين تطور المجتمعات.$QQ$);
    perform ph_qadd(ex,2,$QQ$من اعتبر الصراع الطبقي محرك التاريخ؟$QQ$,$QQ$ماركس$QQ$,$QQ$هيجل$QQ$,$QQ$كانط$QQ$,$QQ$ابن خلدون$QQ$,$QQ$المادية التاريخية.$QQ$);
    perform ph_qadd(ex,3,$QQ$من رأى أن التاريخ سيرورة نحو تحقق الحرية؟$QQ$,$QQ$هيجل$QQ$,$QQ$ماركس$QQ$,$QQ$نيتشه$QQ$,$QQ$دوركايم$QQ$,$QQ$الروح يعي ذاته عبر التاريخ.$QQ$);
    perform ph_qadd(ex,4,$QQ$المعرفة التاريخية حسب ريكور هي:$QQ$,$QQ$إعادة بناء وتأويل$QQ$,$QQ$نقل حرفي للوقائع$QQ$,$QQ$خيال محض$QQ$,$QQ$تنبؤ بالمستقبل$QQ$,$QQ$بناء انطلاقا من الآثار.$QQ$);
    perform ph_qadd(ex,5,$QQ$من حذّر من الإفراط في المعرفة التاريخية؟$QQ$,$QQ$نيتشه$QQ$,$QQ$هيجل$QQ$,$QQ$ابن خلدون$QQ$,$QQ$ماركس$QQ$,$QQ$التاريخ في خدمة الحياة.$QQ$);
  end if;

  ex := ph_bank('philo-theorie','النظرية والتجربة — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$معيار علمية النظرية عند كارل بوبر هو:$QQ$,$QQ$القابلية للتكذيب$QQ$,$QQ$التحقق المطلق$QQ$,$QQ$الإجماع$QQ$,$QQ$المنفعة$QQ$,$QQ$قابلية الاختبار والدحض.$QQ$);
    perform ph_qadd(ex,2,$QQ$من وضع خطوات المنهج التجريبي (ملاحظة، فرضية، تجريب)؟$QQ$,$QQ$كلود برنار$QQ$,$QQ$ديكارت$QQ$,$QQ$نيتشه$QQ$,$QQ$دلتاي$QQ$,$QQ$تكامل العقل والتجربة.$QQ$);
    perform ph_qadd(ex,3,$QQ$من أكد أن المعرفة تبنى ضد العوائق الإبستمولوجية؟$QQ$,$QQ$باشلار$QQ$,$QQ$بوبر$QQ$,$QQ$أرسطو$QQ$,$QQ$هيوم$QQ$,$QQ$تجاوز المعطى الحسي.$QQ$);
    perform ph_qadd(ex,4,$QQ$الفرق بين التجربة والتجريب:$QQ$,$QQ$التجريب استدلال منظم مضبوط$QQ$,$QQ$هما الشيء نفسه$QQ$,$QQ$التجربة أدق$QQ$,$QQ$لا فرق$QQ$,$QQ$التجريب يخضع الظاهرة لشروط.$QQ$);
    perform ph_qadd(ex,5,$QQ$دور العقل في بناء النظرية العلمية:$QQ$,$QQ$فعال ومبدع$QQ$,$QQ$منعدم$QQ$,$QQ$سلبي فقط$QQ$,$QQ$يقيني مطلق$QQ$,$QQ$الفرضيات إبداع عقلي.$QQ$);
  end if;

  ex := ph_bank('philo-sh','العلوم الإنسانية — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من ميّز بين التفسير في علوم الطبيعة والفهم في العلوم الإنسانية؟$QQ$,$QQ$دلتاي$QQ$,$QQ$بوبر$QQ$,$QQ$ديكارت$QQ$,$QQ$أرسطو$QQ$,$QQ$الفهم مقابل التفسير.$QQ$);
    perform ph_qadd(ex,2,$QQ$العائق الأساس في موضعة الظواهر الإنسانية:$QQ$,$QQ$تداخل الذات مع الموضوع$QQ$,$QQ$غياب الظواهر$QQ$,$QQ$بساطتها$QQ$,$QQ$ثباتها$QQ$,$QQ$الإنسان يدرس الإنسان.$QQ$);
    perform ph_qadd(ex,3,$QQ$من دعا إلى المناهج البنيوية في العلوم الإنسانية؟$QQ$,$QQ$ليفي شتراوس$QQ$,$QQ$كانط$QQ$,$QQ$إبيقور$QQ$,$QQ$هوبز$QQ$,$QQ$كشف البنيات الثابتة.$QQ$);
    perform ph_qadd(ex,4,$QQ$من جعل اللاوعي موضوعا لدراسة الإنسان؟$QQ$,$QQ$فرويد$QQ$,$QQ$دوركايم$QQ$,$QQ$أرسطو$QQ$,$QQ$سبينوزا$QQ$,$QQ$توسيع مجال العلمية.$QQ$);
    perform ph_qadd(ex,5,$QQ$منهج ماكس فيبر في دراسة الفعل الاجتماعي:$QQ$,$QQ$الفهم التأويلي مع الحياد$QQ$,$QQ$التفسير الآلي فقط$QQ$,$QQ$رفض الموضوعية$QQ$,$QQ$الحدس المحض$QQ$,$QQ$فهم مع حياد قيمي.$QQ$);
  end if;

  ex := ph_bank('philo-verite','الحقيقة — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$معيار الحقيقة عند ديكارت هو:$QQ$,$QQ$البداهة والوضوح$QQ$,$QQ$المنفعة$QQ$,$QQ$الإجماع$QQ$,$QQ$التجربة وحدها$QQ$,$QQ$الوضوح والتمييز.$QQ$);
    perform ph_qadd(ex,2,$QQ$الحقيقة عند البراغماتية (وليام جيمس) هي:$QQ$,$QQ$ما ينجح ويثمر نتائج نافعة$QQ$,$QQ$البداهة$QQ$,$QQ$التماسك المنطقي فقط$QQ$,$QQ$المطابقة المطلقة$QQ$,$QQ$معيار النفع.$QQ$);
    perform ph_qadd(ex,3,$QQ$من قال إن الفكرة الصحيحة معيار ذاتها؟$QQ$,$QQ$سبينوزا$QQ$,$QQ$نيتشه$QQ$,$QQ$جيمس$QQ$,$QQ$أرسطو$QQ$,$QQ$الحقيقة معيار ذاتها ومعيار الخطأ.$QQ$);
    perform ph_qadd(ex,4,$QQ$من اعتبر الحقائق استعارات وأوهاما نافعة؟$QQ$,$QQ$نيتشه$QQ$,$QQ$ديكارت$QQ$,$QQ$سبينوزا$QQ$,$QQ$كانط$QQ$,$QQ$نقد الحقيقة المطلقة.$QQ$);
    perform ph_qadd(ex,5,$QQ$الفرق بين الرأي والحقيقة:$QQ$,$QQ$الرأي ظني والحقيقة مبررة$QQ$,$QQ$هما سواء$QQ$,$QQ$الرأي أدق$QQ$,$QQ$لا فرق منهجي$QQ$,$QQ$الحقيقة معرفة مبررة.$QQ$);
  end if;

  ex := ph_bank('philo-etat','الدولة — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من أسس مشروعية الدولة على العقد الاجتماعي والخروج من حالة الحرب؟$QQ$,$QQ$هوبز$QQ$,$QQ$ماركس$QQ$,$QQ$نيتشه$QQ$,$QQ$أرسطو$QQ$,$QQ$التنازل عن القوة للدولة.$QQ$);
    perform ph_qadd(ex,2,$QQ$من عرّف الدولة باحتكار العنف المشروع؟$QQ$,$QQ$ماكس فيبر$QQ$,$QQ$سبينوزا$QQ$,$QQ$لوك$QQ$,$QQ$غرامشي$QQ$,$QQ$احتكار العنف الشرعي.$QQ$);
    perform ph_qadd(ex,3,$QQ$من اعتبر الدولة أداة في يد الطبقة المسيطرة؟$QQ$,$QQ$ماركس$QQ$,$QQ$هوبز$QQ$,$QQ$كانط$QQ$,$QQ$لوك$QQ$,$QQ$الدولة تخدم مصالح طبقية.$QQ$);
    perform ph_qadd(ex,4,$QQ$من رأى أن غاية الدولة هي الحرية؟$QQ$,$QQ$سبينوزا$QQ$,$QQ$هوبز$QQ$,$QQ$ماركس$QQ$,$QQ$غرامشي$QQ$,$QQ$الدولة تحرر لا تستعبد.$QQ$);
    perform ph_qadd(ex,5,$QQ$مفهوم الهيمنة (الإقناع الإيديولوجي) مرتبط بـ:$QQ$,$QQ$غرامشي$QQ$,$QQ$لوك$QQ$,$QQ$أرسطو$QQ$,$QQ$ديكارت$QQ$,$QQ$الهيمنة لا بالإكراه فقط.$QQ$);
  end if;

  ex := ph_bank('philo-violence','العنف — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من ميّز بوضوح بين العنف والسلطة؟$QQ$,$QQ$حنة أرندت$QQ$,$QQ$هوبز$QQ$,$QQ$ماركس$QQ$,$QQ$ديكارت$QQ$,$QQ$العنف أداتي يظهر بانهيار السلطة.$QQ$);
    perform ph_qadd(ex,2,$QQ$العنف الرمزي مفهوم يرتبط بـ:$QQ$,$QQ$بورديو$QQ$,$QQ$كانط$QQ$,$QQ$أرسطو$QQ$,$QQ$إبيقور$QQ$,$QQ$إكراه غير مادي.$QQ$);
    perform ph_qadd(ex,3,$QQ$من رأى للعنف دورا في تغيير البنى الاجتماعية؟$QQ$,$QQ$ماركس وإنجلز$QQ$,$QQ$أرسطو$QQ$,$QQ$ديكارت$QQ$,$QQ$لوك$QQ$,$QQ$العنف قابلة التاريخ.$QQ$);
    perform ph_qadd(ex,4,$QQ$من أرجع العنف إلى نزوع عدواني تكبحه الحضارة؟$QQ$,$QQ$فرويد$QQ$,$QQ$هيجل$QQ$,$QQ$سبينوزا$QQ$,$QQ$راولز$QQ$,$QQ$الغريزة العدوانية.$QQ$);
    perform ph_qadd(ex,5,$QQ$أفق تجاوز العنف حسب إريك فايل هو:$QQ$,$QQ$الحوار والعقلانية$QQ$,$QQ$القوة$QQ$,$QQ$الصمت$QQ$,$QQ$العزلة$QQ$,$QQ$الفلسفة رهان اللاعنف.$QQ$);
  end if;

  ex := ph_bank('philo-justice','الحق والعدالة — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من عرّف العدالة بوصفها إنصافا (مبدأ الفرق)؟$QQ$,$QQ$جون راولز$QQ$,$QQ$هوبز$QQ$,$QQ$نيتشه$QQ$,$QQ$ديكارت$QQ$,$QQ$اللامساواة تخدم الأقل حظا.$QQ$);
    perform ph_qadd(ex,2,$QQ$من ميّز بين العدالة التوزيعية والتصحيحية؟$QQ$,$QQ$أرسطو$QQ$,$QQ$راولز$QQ$,$QQ$ماركس$QQ$,$QQ$سبينوزا$QQ$,$QQ$توزيع بالاستحقاق ورد الحقوق.$QQ$);
    perform ph_qadd(ex,3,$QQ$الحق الطبيعي عند هوبز في حالة الطبيعة هو:$QQ$,$QQ$حق القوة$QQ$,$QQ$حق العقل$QQ$,$QQ$حق وضعي$QQ$,$QQ$حق إلهي$QQ$,$QQ$ثم يتحول بالعقد إلى حق وضعي.$QQ$);
    perform ph_qadd(ex,4,$QQ$من انتقد العدالة الشكلية في ظل اللامساواة الاقتصادية؟$QQ$,$QQ$ماركس$QQ$,$QQ$أرسطو$QQ$,$QQ$راولز$QQ$,$QQ$لوك$QQ$,$QQ$نقد المساواة القانونية الصورية.$QQ$);
    perform ph_qadd(ex,5,$QQ$الحق الوضعي هو:$QQ$,$QQ$ما يقرره القانون$QQ$,$QQ$ما تفرضه الطبيعة$QQ$,$QQ$حق القوة$QQ$,$QQ$حق فطري$QQ$,$QQ$مقابل الحق الطبيعي.$QQ$);
  end if;

  ex := ph_bank('philo-devoir','الواجب — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من أسس الواجب على الأمر الأخلاقي المطلق (الأمر القطعي)؟$QQ$,$QQ$كانط$QQ$,$QQ$دوركايم$QQ$,$QQ$نيتشه$QQ$,$QQ$أرسطو$QQ$,$QQ$الواجب احتراما للقانون الأخلاقي.$QQ$);
    perform ph_qadd(ex,2,$QQ$من أرجع مصدر الواجب إلى المجتمع؟$QQ$,$QQ$دوركايم$QQ$,$QQ$كانط$QQ$,$QQ$برغسون$QQ$,$QQ$سبينوزا$QQ$,$QQ$القواعد الأخلاقية اجتماعية.$QQ$);
    perform ph_qadd(ex,3,$QQ$من ميّز بين الأخلاق المغلقة والأخلاق المفتوحة؟$QQ$,$QQ$برغسون$QQ$,$QQ$كانط$QQ$,$QQ$دوركايم$QQ$,$QQ$هوبز$QQ$,$QQ$ضغط اجتماعي مقابل نداء المحبة.$QQ$);
    perform ph_qadd(ex,4,$QQ$الفرق بين الواجب والإكراه:$QQ$,$QQ$الواجب إلزام داخلي والإكراه خارجي$QQ$,$QQ$هما سواء$QQ$,$QQ$الإكراه أخلاقي$QQ$,$QQ$لا فرق$QQ$,$QQ$داخلي مقابل خارجي بالقوة.$QQ$);
    perform ph_qadd(ex,5,$QQ$من دعا إلى تجاوز أخلاق الواجب التقليدية؟$QQ$,$QQ$نيتشه$QQ$,$QQ$كانط$QQ$,$QQ$دوركايم$QQ$,$QQ$أرسطو$QQ$,$QQ$خلق قيم جديدة.$QQ$);
  end if;

  ex := ph_bank('philo-bonheur','السعادة — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من اعتبر السعادة الخير الأقصى تتحقق بالفضيلة؟$QQ$,$QQ$أرسطو$QQ$,$QQ$إبيقور$QQ$,$QQ$شوبنهاور$QQ$,$QQ$كانط$QQ$,$QQ$الحياة الفاضلة العاقلة.$QQ$);
    perform ph_qadd(ex,2,$QQ$من ربط السعادة باللذة المقاسة وطمأنينة النفس؟$QQ$,$QQ$إبيقور$QQ$,$QQ$أرسطو$QQ$,$QQ$كانط$QQ$,$QQ$ماركس$QQ$,$QQ$لذة تقوم على غياب الألم.$QQ$);
    perform ph_qadd(ex,3,$QQ$حسب كانط، أساس الأخلاق هو:$QQ$,$QQ$الواجب لا السعادة$QQ$,$QQ$اللذة$QQ$,$QQ$المنفعة$QQ$,$QQ$الرغبة$QQ$,$QQ$نستحق السعادة بالفضيلة.$QQ$);
    perform ph_qadd(ex,4,$QQ$من رأى أن السعادة سلبية (غياب الألم) والحياة تأرجح بين الألم والملل؟$QQ$,$QQ$شوبنهاور$QQ$,$QQ$أرسطو$QQ$,$QQ$إبيقور$QQ$,$QQ$سبينوزا$QQ$,$QQ$نظرة تشاؤمية.$QQ$);
    perform ph_qadd(ex,5,$QQ$السعادة عند كانط:$QQ$,$QQ$مثل أعلى للخيال يصعب تحديده$QQ$,$QQ$لذة حسية$QQ$,$QQ$غاية الأخلاق$QQ$,$QQ$واجب$QQ$,$QQ$لا تصلح أساسا ثابتا للأخلاق.$QQ$);
  end if;

  ex := ph_bank('philo-liberte','الحرية — QCU');
  if ex is not null and not exists (select 1 from questions where exercise_id=ex) then
    perform ph_qadd(ex,1,$QQ$من قال إن الإنسان يظن نفسه حرا لأنه يجهل الأسباب التي تحدده؟$QQ$,$QQ$سبينوزا$QQ$,$QQ$سارتر$QQ$,$QQ$كانط$QQ$,$QQ$ديكارت$QQ$,$QQ$الحرية معرفة الضرورة.$QQ$);
    perform ph_qadd(ex,2,$QQ$من قال إن الإنسان محكوم عليه بأن يكون حرا؟$QQ$,$QQ$سارتر$QQ$,$QQ$سبينوزا$QQ$,$QQ$دوركايم$QQ$,$QQ$هيوم$QQ$,$QQ$الوجود سابق على الماهية.$QQ$);
    perform ph_qadd(ex,3,$QQ$حسب كانط، علاقة الحرية بالأخلاق:$QQ$,$QQ$الحرية شرط الأخلاق$QQ$,$QQ$لا علاقة بينهما$QQ$,$QQ$الأخلاق تلغي الحرية$QQ$,$QQ$الحرية وهم$QQ$,$QQ$لا واجب دون حرية.$QQ$);
    perform ph_qadd(ex,4,$QQ$الحرية الحقة في علاقتها بالقانون:$QQ$,$QQ$الخضوع لقانون نشرعه لأنفسنا$QQ$,$QQ$غياب كل قانون$QQ$,$QQ$الفوضى$QQ$,$QQ$طاعة عمياء$QQ$,$QQ$لا تعارض بين الحرية والقانون العادل.$QQ$);
    perform ph_qadd(ex,5,$QQ$الحتمية تعني:$QQ$,$QQ$خضوع الظواهر لأسباب ضرورية$QQ$,$QQ$الصدفة المطلقة$QQ$,$QQ$الحرية المطلقة$QQ$,$QQ$انعدام السببية$QQ$,$QQ$مقابل حرية الإرادة.$QQ$);
  end if;
end $qcu$;

drop function if exists ph_qadd(uuid,int,text,text,text,text,text,text);
drop function if exists ph_bank(text,text);
