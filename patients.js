(function (root) {
  root.DhillPatients = [
    { id: 'Y', nameAr: 'يوسف', nameEn: 'Yusuf', age: 76, baseline: 77.0, meds: ['furosemide', 'valsartan', 'amlodipine'],
      check: { weight: 77.0, dizzy: false, lowFluids: false, lessUrine: false, vomDia: false, fever: false, confusion: false } },
    { id: 'A', nameAr: 'سالم', nameEn: 'Salem', age: 74, baseline: 73.6, meds: ['furosemide', 'lisinopril', 'metformin', 'atorvastatin'],
      check: { weight: 71.8, dizzy: true, lowFluids: true, lessUrine: false, vomDia: false, fever: false, confusion: false } },
    { id: 'B', nameAr: 'فاطمة', nameEn: 'Fatimah', age: 81, baseline: 62.0, meds: ['empagliflozin', 'perindopril', 'ibuprofen', 'omeprazole'],
      check: { weight: 61.4, dizzy: false, lowFluids: false, lessUrine: false, vomDia: true, fever: false, confusion: false } },
    { id: 'C', nameAr: 'حسن', nameEn: 'Hassan', age: 69, baseline: 81.0, meds: ['metformin', 'gliclazide', 'amlodipine'],
      check: { weight: 80.8, dizzy: false, lowFluids: true, lessUrine: false, vomDia: false, fever: false, confusion: false } },
    { id: 'D', nameAr: 'نورة', nameEn: 'Noura', age: 77, baseline: 68.5, meds: ['hctz', 'losartan', 'diclofenac', 'levothyroxine'],
      check: { weight: 68.4, dizzy: false, lowFluids: false, lessUrine: false, vomDia: false, fever: false, confusion: false } },
    { id: 'E', nameAr: 'عبدالله', nameEn: 'Abdullah', age: 70, baseline: 85.2, meds: ['atorvastatin', 'omeprazole', 'aspirin81'],
      check: { weight: 85.0, dizzy: false, lowFluids: false, lessUrine: false, vomDia: false, fever: false, confusion: false } },
    { id: 'F', nameAr: 'مريم', nameEn: 'Maryam', age: 83, baseline: 58.0, meds: ['furosemide', 'spironolactone', 'bisoprolol'],
      check: { weight: 57.6, dizzy: false, lowFluids: true, lessUrine: true, vomDia: false, fever: false, confusion: false } },
    { id: 'G', nameAr: 'إبراهيم', nameEn: 'Ibrahim', age: 79, baseline: 70.0, meds: ['lithium', 'quetiapine', 'oxybutynin'],
      check: { weight: 68.9, dizzy: false, lowFluids: true, lessUrine: false, vomDia: false, fever: false, confusion: true } },
    { id: 'H', nameAr: 'خديجة', nameEn: 'Khadija', age: 72, baseline: 66.0, meds: ['lisinopril', 'dapagliflozin', 'metformin'], check: null },
  ];
})(typeof window !== 'undefined' ? window : globalThis);

module.exports = globalThis.DhillPatients;
