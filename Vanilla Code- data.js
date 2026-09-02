

window.DB = {
  /* ---- Clinic nurses / providers ---- */
  nurses: [
    { name: "Sr Mary Noglai",     role: "School Nurse" },
    { name: "Mr Israel Tsibilian", role: "School Nurse" },
    { name: "Visiting Nurse",      role: "Visiting Nurse" },
  ],

  /* ---- Login credentials (demo only) ---- */
  users: [
    {
      id: "P-2041",
      role: "patient",
      email: "patient@wpu.ac.pg",
      password: "patient123",
      name: "Grace Waim",
      studentId: "WPU-00231",
      program: "BSc Computer Science",
    },
    {
      id: "N-018",
      role: "nurse",
      email: "nurse@wpu.ac.pg",
      password: "nurse123",
      name: "Sr Mary Noglai",   // default; nurse picks their identity at login
      staffId: "WPU-CLN-018",
      title: "School Nurse",
    },
  ],

  /* ---- Patient roster (nurse view) ---- */
  patients: [
    { id: "WPU-00231", name: "Grace Waim",   age: 20, sex: "F", program: "BSc Computer Science", status: "Active",     blood: "O+" },
    { id: "WPU-00187", name: "Peter Kaupa",  age: 22, sex: "M", program: "BSc Accounting",        status: "Active",     blood: "A+" },
    { id: "WPU-00305", name: "Mary Sasa",    age: 19, sex: "F", program: "Dip. Nursing",          status: "Review",     blood: "B+" },
    { id: "WPU-00142", name: "John Namaliu", age: 24, sex: "M", program: "BSc Mathematics",       status: "Active",     blood: "O-" },
    { id: "WPU-00298", name: "Ruth Aila",    age: 21, sex: "F", program: "BA Education",          status: "Discharged", blood: "AB+" },
  ],

  /* ---- Appointments (shared) ---- */
  appointments: [
    { id: "A-501", patientId: "WPU-00231", patient: "Grace Waim",  date: "2026-08-05", time: "09:30", reason: "General check-up",    nurse: "Sr Mary Noglai",      status: "Confirmed" },
    { id: "A-502", patientId: "WPU-00187", patient: "Peter Kaupa", date: "2026-08-05", time: "10:15", reason: "Malaria follow-up",    nurse: "Mr Israel Tsibilian", status: "Confirmed" },
    { id: "A-503", patientId: "WPU-00305", patient: "Mary Sasa",   date: "2026-08-06", time: "11:00", reason: "Vaccination",          nurse: "Visiting Nurse",      status: "Pending" },
    { id: "A-504", patientId: "WPU-00231", patient: "Grace Waim",  date: "2026-08-12", time: "14:00", reason: "Blood pressure review", nurse: "Sr Mary Noglai",     status: "Confirmed" },
  ],

  /* ---- Options used in the "book appointment" form (error prevention) ---- */
  reasons: ["General check-up", "Malaria test", "Vaccination", "Blood pressure review", "Injury / first aid", "Follow-up visit"],
  timeslots: ["08:30", "09:00", "09:30", "10:15", "11:00", "13:30", "14:00", "15:00"],

  /* ---- Current diagnosis (patient view) ---- */
  diagnosis: {
    "WPU-00231": {
      condition: "Mild hypertension",
      date: "2026-07-28",
      nurse: "Sr Mary Noglai",
      notes: "Blood pressure slightly elevated (138/88). Advised reduced salt intake, regular light exercise and a follow-up in two weeks.",
      prescriptions: [
        { drug: "Amlodipine 5mg", dose: "1 tablet once daily", days: "14 days" },
        { drug: "Paracetamol 500mg", dose: "As needed for headache", days: "PRN" },
      ],
      vitals: { bp: "138/88 mmHg", temp: "36.7 °C", pulse: "78 bpm", weight: "61 kg" },
    },
  },

  /* ---- Medical history (per patient) ---- */
  history: {
    "WPU-00231": [
      { date: "2026-07-28", title: "Mild hypertension", by: "Sr Mary Noglai",      detail: "BP 138/88. Prescribed Amlodipine. Follow-up in 2 weeks." },
      { date: "2026-05-14", title: "Malaria (P. vivax)", by: "Mr Israel Tsibilian", detail: "Positive RDT. Completed full artemether-lumefantrine course. Recovered." },
      { date: "2026-02-02", title: "Routine check-up",   by: "Visiting Nurse",      detail: "All vitals normal. Cleared for semester sports." },
      { date: "2025-11-20", title: "Sprained ankle",     by: "Sr Mary Noglai",      detail: "Right ankle, grade I. RICE protocol, bandaged. Healed." },
    ],
    "WPU-00187": [
      { date: "2026-07-30", title: "Malaria follow-up",      by: "Mr Israel Tsibilian", detail: "Symptoms resolved. Advised to complete rest." },
      { date: "2026-07-22", title: "Malaria (P. falciparum)", by: "Mr Israel Tsibilian", detail: "Positive RDT, fever 39.1°C. Treatment started." },
    ],
    "WPU-00305": [
      { date: "2026-08-01", title: "Pre-vaccination screening", by: "Visiting Nurse", detail: "Fit for Hepatitis B vaccination. Scheduled." },
    ],
  },

  /* ---- Nurse system-workflow steps ---- */
  workflow: [
    { title: "Patient checks in",       desc: "Student taps in at the clinic or books via the app.", state: "done" },
    { title: "Nurse verifies record",   desc: "Nurse opens the digital clinic book and confirms identity.", state: "done" },
    { title: "Consultation & vitals",   desc: "Vitals recorded, symptoms assessed, diagnosis entered.", state: "active" },
    { title: "Prescription / referral", desc: "Medication dispensed or referral to Ialibu hospital raised.", state: "todo" },
    { title: "Record synced",           desc: "Visit saved to the patient's medical history.", state: "todo" },
  ],

  workflowMetrics: { waiting: 3, inProgress: 1, completedToday: 12 },
};
