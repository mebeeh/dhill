/* Dhill demo rule engine — shared by the page and the test script. Fictional demo, not for clinical use. */
(function (root) {
  const CLASSES = {
    loop: { risk: 'H', sick: true, en: 'Loop diuretic', ar: 'مدرّ عروي',
      whyEn: 'Raises fluid and salt loss, so dehydration and low blood pressure come faster on hot days.',
      whyAr: 'يزيد فقد السوائل والأملاح، فيأتي الجفاف وهبوط الضغط أسرع في الأيام الحارة.',
      revEn: 'Consider a temporary hold or lower dose (sick-day guidance).',
      revAr: 'النظر في إيقاف مؤقت أو خفض الجرعة (إرشادات أيام المرض).' },
    thiazide: { risk: 'H', sick: true, en: 'Thiazide diuretic', ar: 'مدرّ ثيازيدي',
      whyEn: 'Adds fluid loss and can lower blood sodium in the heat.',
      whyAr: 'يضيف إلى فقد السوائل وقد يخفض الصوديوم في الدم مع الحر.',
      revEn: 'Consider a temporary hold (sick-day guidance); check sodium if unwell.',
      revAr: 'النظر في إيقاف مؤقت (إرشادات أيام المرض)، وفحص الصوديوم عند التعب.' },
    mra: { risk: 'H', sick: true, en: 'Potassium-sparing diuretic', ar: 'مدرّ حافظ للبوتاسيوم',
      whyEn: 'With dehydration, potassium can rise and the kidneys can be injured.',
      whyAr: 'مع الجفاف قد يرتفع البوتاسيوم وتتأذى الكلى.',
      revEn: 'Consider a temporary hold (sick-day guidance); check potassium.',
      revAr: 'النظر في إيقاف مؤقت (إرشادات أيام المرض)، وفحص البوتاسيوم.' },
    acei: { risk: 'H', sick: true, en: 'ACE inhibitor', ar: 'مثبط الإنزيم المحوّل',
      whyEn: 'Limits how well the kidneys protect their filtration when fluids are low.',
      whyAr: 'يحدّ من قدرة الكلى على حماية الترشيح عند نقص السوائل.',
      revEn: 'Consider a temporary hold (sick-day guidance).',
      revAr: 'النظر في إيقاف مؤقت (إرشادات أيام المرض).' },
    arb: { risk: 'H', sick: true, en: 'Angiotensin receptor blocker', ar: 'حاصر مستقبلات الأنجيوتنسين',
      whyEn: 'Limits how well the kidneys protect their filtration when fluids are low.',
      whyAr: 'يحدّ من قدرة الكلى على حماية الترشيح عند نقص السوائل.',
      revEn: 'Consider a temporary hold (sick-day guidance).',
      revAr: 'النظر في إيقاف مؤقت (إرشادات أيام المرض).' },
    sglt2: { risk: 'H', sick: true, en: 'SGLT2 inhibitor', ar: 'مثبط SGLT2',
      whyEn: 'Removes sugar and water in urine; dehydration and ketoacidosis risk when unwell.',
      whyAr: 'يُخرج السكر والماء في البول، فيرفع خطر الجفاف والحماض الكيتوني عند التعب.',
      revEn: 'Consider a temporary hold (sick-day guidance).',
      revAr: 'النظر في إيقاف مؤقت (إرشادات أيام المرض).' },
    nsaid: { risk: 'H', sick: true, en: 'NSAID pain-killer', ar: 'مسكّن مضاد للالتهاب (NSAID)',
      whyEn: 'Reduces blood flow to the kidneys; risky when combined with dehydration.',
      whyAr: 'يقلل تدفق الدم إلى الكلى، وهو خطر مع الجفاف.',
      revEn: 'Advise holding; offer an alternative such as paracetamol if suitable.',
      revAr: 'النصح بإيقافه، واقتراح بديل مثل الباراسيتامول إن كان مناسبًا.' },
    lithium: { risk: 'H', sick: false, en: 'Lithium', ar: 'الليثيوم',
      whyEn: 'Dehydration can push lithium to toxic levels.',
      whyAr: 'الجفاف قد يرفع الليثيوم إلى مستوى سام.',
      revEn: 'Consider an urgent lithium level and prescriber review.',
      revAr: 'النظر في فحص عاجل لمستوى الليثيوم ومراجعة الطبيب الواصف.' },
    metformin: { risk: 'M', sick: true, en: 'Metformin', ar: 'ميتفورمين',
      whyEn: 'If the kidneys are stressed, the risk of lactic acidosis rises.',
      whyAr: 'إذا تأثرت الكلى يرتفع خطر الحماض اللبني.',
      revEn: 'Consider a temporary hold while unwell (sick-day guidance).',
      revAr: 'النظر في إيقاف مؤقت أثناء التعب (إرشادات أيام المرض).' },
    su: { risk: 'M', sick: false, en: 'Sulfonylurea', ar: 'سلفونيل يوريا',
      whyEn: 'Eating and drinking less on hot days can cause low blood sugar.',
      whyAr: 'قلة الأكل والشرب في الحر قد تسبب هبوط السكر.',
      revEn: 'Review the dose and advise glucose checks.',
      revAr: 'مراجعة الجرعة والنصح بقياس السكر.' },
    antipsych: { risk: 'M', sick: false, en: 'Antipsychotic', ar: 'مضاد ذهان',
      whyEn: 'Can impair the body’s temperature control.',
      whyAr: 'قد يضعف تنظيم الجسم لحرارته.',
      revEn: 'Reinforce cooling; prescriber review if symptomatic.',
      revAr: 'التأكيد على التبريد، ومراجعة الطبيب عند ظهور أعراض.' },
    anticholin: { risk: 'M', sick: false, en: 'Anticholinergic', ar: 'مضاد للكولين',
      whyEn: 'Reduces sweating, so the body cools less.',
      whyAr: 'يقلل التعرق، فيبرد الجسم أقل.',
      revEn: 'Reinforce cooling; consider whether it is still needed.',
      revAr: 'التأكيد على التبريد، والنظر في استمرار الحاجة إليه.' },
    bb: { risk: 'M', sick: false, en: 'Beta-blocker', ar: 'حاصر بيتا',
      whyEn: 'Limits the heart’s response to heat and can add to dizziness.',
      whyAr: 'يحدّ من استجابة القلب للحر وقد يزيد الدوخة.',
      revEn: 'Check blood pressure and pulse; usually continue.',
      revAr: 'فحص الضغط والنبض؛ يُستمر عليه عادةً.' },
    ccb: { risk: 'L', sick: false, en: 'Calcium-channel blocker', ar: 'حاصر قنوات الكالسيوم',
      whyEn: 'Minor concern; watch for dizziness.', whyAr: 'أثر محدود؛ راقب الدوخة.', revEn: '', revAr: '' },
    statin: { risk: 'L', sick: false, en: 'Statin', ar: 'ستاتين',
      whyEn: 'No specific heat concern at usual doses.', whyAr: 'لا قلق خاص مع الحر بالجرعات المعتادة.', revEn: '', revAr: '' },
    ppi: { risk: 'L', sick: false, en: 'Proton-pump inhibitor', ar: 'مثبط مضخة البروتون',
      whyEn: 'No specific heat concern at usual doses.', whyAr: 'لا قلق خاص مع الحر بالجرعات المعتادة.', revEn: '', revAr: '' },
    thyroid: { risk: 'L', sick: false, en: 'Thyroid hormone', ar: 'هرمون الغدة الدرقية',
      whyEn: 'No specific heat concern at usual doses.', whyAr: 'لا قلق خاص مع الحر بالجرعات المعتادة.', revEn: '', revAr: '' },
    aspirin: { risk: 'L', sick: false, en: 'Low-dose aspirin', ar: 'أسبرين بجرعة منخفضة',
      whyEn: 'No specific heat concern at low dose.', whyAr: 'لا قلق خاص مع الحر بالجرعة المنخفضة.', revEn: '', revAr: '' },
    arni: { risk: 'H', sick: true, en: 'ARNI (sacubitril/valsartan)', ar: 'مثبط مستقبلات الأنجيوتنسين والنيبريليسين',
      whyEn: 'Contains an ARB; same kidney and low-blood-pressure risk when fluids are low.', whyAr: 'يحتوي على حاصر ARB؛ نفس خطر الكلى وهبوط الضغط عند نقص السوائل.',
      revEn: 'Consider a temporary hold (sick-day guidance).', revAr: 'النظر في إيقاف مؤقت (إرشادات أيام المرض).' },
    nitrate: { risk: 'M', sick: false, en: 'Nitrate', ar: 'نترات',
      whyEn: 'Can worsen low blood pressure in the heat.', whyAr: 'قد تزيد هبوط الضغط في الحر.',
      revEn: 'Check blood pressure on standing; prescriber review if dizzy.', revAr: 'فحص الضغط عند الوقوف ومراجعة الطبيب عند الدوخة.' },
    ssri: { risk: 'M', sick: false, en: 'SSRI/SNRI antidepressant', ar: 'مضاد اكتئاب SSRI/SNRI',
      whyEn: 'Alters sweating and can lower blood sodium.', whyAr: 'يغيّر التعرق وقد يخفض الصوديوم.',
      revEn: 'Check sodium if unwell; usually continue.', revAr: 'فحص الصوديوم عند التعب؛ يُستمر عليه عادةً.' },
    tca: { risk: 'M', sick: false, en: 'Tricyclic antidepressant', ar: 'مضاد اكتئاب ثلاثي الحلقات',
      whyEn: 'Reduces sweating and can cause dizziness on standing.', whyAr: 'يقلل التعرق وقد يسبب دوخة عند الوقوف.',
      revEn: 'Reinforce cooling; prescriber review if symptomatic.', revAr: 'التأكيد على التبريد ومراجعة الطبيب عند الأعراض.' },
    antiseizure: { risk: 'M', sick: false, en: 'Antiseizure medicine', ar: 'مضاد صرع',
      whyEn: 'Some (topiramate) reduce sweating; others build up when dehydrated.', whyAr: 'بعضها يقلل التعرق، وبعضها يتراكم مع الجفاف.',
      revEn: 'Prescriber review if unwell.', revAr: 'مراجعة الطبيب عند التعب.' },
    sedantihist: { risk: 'M', sick: false, en: 'Sedating antihistamine', ar: 'مضاد هيستامين منوّم',
      whyEn: 'Anticholinergic: reduces sweating and awareness of heat.', whyAr: 'مضاد للكولين: يقلل التعرق والإحساس بالحر.',
      revEn: 'Consider avoiding on hot days.', revAr: 'النظر في تجنبه في الأيام الحارة.' },
    sulfa: { risk: 'M', sick: false, en: 'Sulfonamide antibiotic', ar: 'مضاد حيوي سلفوناميد',
      whyEn: 'Kidney injury and potassium rise are more likely when dehydrated.', whyAr: 'يزيد خطر أذى الكلى وارتفاع البوتاسيوم مع الجفاف.',
      revEn: 'Check fluids and kidney function if unwell.', revAr: 'متابعة السوائل ووظائف الكلى عند التعب.' },
    stimulant: { risk: 'M', sick: false, en: 'Stimulant', ar: 'منبّه',
      whyEn: 'Raises heat production and blunts heat warnings.', whyAr: 'يرفع إنتاج الحرارة ويخفي علامات الإجهاد الحراري.',
      revEn: 'Prescriber review on very hot days.', revAr: 'مراجعة الطبيب في الأيام شديدة الحرارة.' },
    antiplatelet: { risk: 'L', sick: false, en: 'Antiplatelet', ar: 'مضاد صفائح',
      whyEn: 'Minor concern; listed in CDC heat guidance.', whyAr: 'أثر محدود؛ مذكور في إرشادات CDC.', revEn: '', revAr: '' },
  };

  const MEDS = {
    furosemide: { en: 'Furosemide 40 mg', ar: 'فوروسيميد 40 ملغ', cls: 'loop' },
    hctz: { en: 'Hydrochlorothiazide 25 mg', ar: 'هيدروكلوروثيازيد 25 ملغ', cls: 'thiazide' },
    indapamide: { en: 'Indapamide 1.5 mg', ar: 'إنداباميد 1.5 ملغ', cls: 'thiazide' },
    spironolactone: { en: 'Spironolactone 25 mg', ar: 'سبيرونولاكتون 25 ملغ', cls: 'mra' },
    lisinopril: { en: 'Lisinopril 10 mg', ar: 'ليسينوبريل 10 ملغ', cls: 'acei' },
    perindopril: { en: 'Perindopril 5 mg', ar: 'بيريندوبريل 5 ملغ', cls: 'acei' },
    losartan: { en: 'Losartan 50 mg', ar: 'لوسارتان 50 ملغ', cls: 'arb' },
    valsartan: { en: 'Valsartan 80 mg', ar: 'فالسارتان 80 ملغ', cls: 'arb' },
    empagliflozin: { en: 'Empagliflozin 10 mg', ar: 'إمباغليفلوزين 10 ملغ', cls: 'sglt2' },
    dapagliflozin: { en: 'Dapagliflozin 10 mg', ar: 'داباغليفلوزين 10 ملغ', cls: 'sglt2' },
    ibuprofen: { en: 'Ibuprofen 400 mg', ar: 'إيبوبروفين 400 ملغ', cls: 'nsaid' },
    diclofenac: { en: 'Diclofenac 50 mg', ar: 'ديكلوفيناك 50 ملغ', cls: 'nsaid' },
    lithium: { en: 'Lithium carbonate 400 mg', ar: 'كربونات الليثيوم 400 ملغ', cls: 'lithium' },
    metformin: { en: 'Metformin 1 g', ar: 'ميتفورمين 1 غ', cls: 'metformin' },
    gliclazide: { en: 'Gliclazide MR 60 mg', ar: 'غليكلازيد 60 ملغ', cls: 'su' },
    quetiapine: { en: 'Quetiapine 50 mg', ar: 'كيتيابين 50 ملغ', cls: 'antipsych' },
    oxybutynin: { en: 'Oxybutynin 5 mg', ar: 'أوكسيبوتينين 5 ملغ', cls: 'anticholin' },
    bisoprolol: { en: 'Bisoprolol 5 mg', ar: 'بيسوبرولول 5 ملغ', cls: 'bb' },
    amlodipine: { en: 'Amlodipine 5 mg', ar: 'أملوديبين 5 ملغ', cls: 'ccb' },
    atorvastatin: { en: 'Atorvastatin 20 mg', ar: 'أتورفاستاتين 20 ملغ', cls: 'statin' },
    omeprazole: { en: 'Omeprazole 20 mg', ar: 'أوميبرازول 20 ملغ', cls: 'ppi' },
    levothyroxine: { en: 'Levothyroxine 50 mcg', ar: 'ليفوثيروكسين 50 مكغ', cls: 'thyroid' },
    aspirin81: { en: 'Aspirin 81 mg', ar: 'أسبرين 81 ملغ', cls: 'aspirin' },
    sacubitril: { en: 'Sacubitril/valsartan 49/51 mg', ar: 'ساكوبيتريل/فالسارتان', cls: 'arni' },
    isosorbide: { en: 'Isosorbide mononitrate 30 mg', ar: 'إيزوسوربيد', cls: 'nitrate' },
    sertraline: { en: 'Sertraline 50 mg', ar: 'سيرترالين', cls: 'ssri' },
    amitriptyline: { en: 'Amitriptyline 25 mg', ar: 'أميتريبتيلين', cls: 'tca' },
    topiramate: { en: 'Topiramate 50 mg', ar: 'توبيرامات', cls: 'antiseizure' },
    diphenhydramine: { en: 'Diphenhydramine 25 mg', ar: 'ديفينهيدرامين', cls: 'sedantihist' },
    cotrimoxazole: { en: 'Co-trimoxazole 960 mg', ar: 'كوتريموكسازول', cls: 'sulfa' },
    methylphenidate: { en: 'Methylphenidate 10 mg', ar: 'ميثيلفينيدات', cls: 'stimulant' },
    clopidogrel: { en: 'Clopidogrel 75 mg', ar: 'كلوبيدوقرل', cls: 'antiplatelet' },
  };

  // Illustrative thresholds for the demo; production would use city-specific percentiles.
  // v1.1: city-specific thresholds = local P90 / P95 / P97.5 of daily maximum temperature, 2021-2025 (Meteostat station data).
  const CITY_T = { makkah: [43.6, 44.2, 44.7], jeddah: [40.1, 41.2, 42.2], riyadh: [44.8, 45.5, 46.0], madinah: [45.0, 46.0, 46.6] };
  let CITY = 'makkah';
  function setCity(c) { CITY = c; }
  function heatLevel(t) {
    const th = CITY_T[CITY];
    if (t >= th[2]) return 3;
    if (t >= th[1]) return 2;
    if (t >= th[0]) return 1;
    return 0;
  }

  function medProfile(meds) {
    const classes = meds.map((m) => MEDS[m] && MEDS[m].cls).filter(Boolean);
    const has = (c) => classes.includes(c);
    const highs = classes.filter((c) => CLASSES[c].risk === 'H').length;
    const mods = classes.filter((c) => CLASSES[c].risk === 'M').length;
    const triple = (has('loop') || has('thiazide')) && (has('acei') || has('arb') || has('arni')) && has('nsaid');
    let level = 0;
    if (triple) level = 3;
    else if (highs >= 2 || has('lithium')) level = 2;
    else if (highs === 1 || mods >= 1) level = 1;
    return { level, highs, mods, triple, classes };
  }

  // check: { weight, dizzy, lowFluids, lessUrine, vomDia, fever, confusion, bpLyingSys, bpLyingDia, bpStandSys, bpStandDia }
  function assess(patient, tempToday) {
    const heat = heatLevel(tempToday);
    const mp = medProfile(patient.meds);
    const reasons = [];
    if (mp.triple) reasons.push({ k: 'triple' });
    else if (mp.level >= 2) reasons.push({ k: 'highMeds', n: mp.highs });
    else if (mp.level === 1) reasons.push({ k: 'someMeds' });
    if (heat >= 1) reasons.push({ k: 'heat', t: tempToday, lvl: heat });

    const c = patient.check;
    if (!c) {
      const highDay = mp.level >= 2 && heat >= 2;
      return { status: 'pending', heat, mp, signs: 0, total: mp.level + heat, reasons, highDay };
    }
    if (c.confusion) {
      reasons.unshift({ k: 'confusion' });
      return { status: 'emergency', heat, mp, signs: 99, total: 99, reasons, highDay: false };
    }
    let signs = 0;
    const delta = +(c.weight - patient.baseline).toFixed(1);
    const lossPct = patient.baseline ? ((patient.baseline - c.weight) / patient.baseline) * 100 : 0;
    if (lossPct >= 3) { signs += 3; reasons.push({ k: 'weight', d: delta, p: lossPct }); }
    else if (lossPct >= 1.5) { signs += 2; reasons.push({ k: 'weight', d: delta, p: lossPct }); }
    if (c.dizzy) { signs += 2; reasons.push({ k: 'dizzy' }); }
    const hasBP = [c.bpLyingSys, c.bpLyingDia, c.bpStandSys, c.bpStandDia].every((v) => typeof v === 'number' && v > 0);
    if (hasBP && (c.bpLyingSys - c.bpStandSys >= 20 || c.bpLyingDia - c.bpStandDia >= 10)) {
      signs += 2; reasons.push({ k: 'orthostatic', s: c.bpLyingSys - c.bpStandSys, d: c.bpLyingDia - c.bpStandDia });
    }
    if (typeof c.pulse === 'number' && c.pulse >= 100) { signs += 2; reasons.push({ k: 'tachy', v: c.pulse }); }
    if (c.vomDia) { signs += 3; reasons.push({ k: 'vomDia' }); }
    if (c.lowFluids) { signs += 1; reasons.push({ k: 'lowFluids' }); }
    if (c.lessUrine) { signs += 1; reasons.push({ k: 'lessUrine' }); }
    if (c.fever) { signs += 1; reasons.push({ k: 'fever' }); }

    const total = mp.level + heat + signs;
    let status = 'green';
    if ((signs >= 4 && mp.level >= 1) || (c.vomDia && mp.level >= 2) || total >= 9) status = 'red';
    else if (total >= 5 || signs >= 2) status = 'amber';
    return { status, heat, mp, signs, total, reasons, highDay: false };
  }

  root.DhillEngine = { CLASSES, MEDS, heatLevel, medProfile, assess, setCity, CITY_T };
})(typeof window !== 'undefined' ? window : globalThis);

module.exports = globalThis.DhillEngine;
