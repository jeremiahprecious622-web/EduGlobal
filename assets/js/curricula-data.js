// ==========================================================
// EduGlobal - curricula-data.js
// The lists used by the registration form.
// To add a country, curriculum, level or subject, add a line here.
// (In Stage 7 the admin dashboard will manage these from the database.)
// ==========================================================

export const COUNTRIES = [
  "Nigeria", "Ghana", "United Kingdom", "United States",
  "Canada", "South Africa", "India", "Other"
];

export const CURRICULA = {
  nigerian: {
    name: "Nigerian curriculum",
    levels: [
      { id: "jss1", label: "JSS 1", group: "Junior Secondary" },
      { id: "jss2", label: "JSS 2", group: "Junior Secondary" },
      { id: "jss3", label: "JSS 3", group: "Junior Secondary" },
      { id: "ss1", label: "SS1", group: "Senior Secondary" },
      { id: "ss2", label: "SS2", group: "Senior Secondary" },
      { id: "ss3", label: "SS3", group: "Senior Secondary" },
      { id: "jamb", label: "JAMB", group: "Exam preparation" },
      { id: "waec", label: "WAEC", group: "Exam preparation" },
      { id: "neco", label: "NECO", group: "Exam preparation" },
      { id: "neco-gce", label: "NECO GCE", group: "Exam preparation" },
      { id: "waec-gce", label: "WAEC GCE", group: "Exam preparation" }
    ]
  },
  international: {
    name: "International / Other",
    levels: [
      { id: "lower-secondary", label: "Lower secondary", group: "Level" },
      { id: "upper-secondary", label: "Upper secondary", group: "Level" },
      { id: "general-revision", label: "General revision", group: "Level" }
    ]
  }
};

export const SUBJECTS = [
  "Mathematics", "English Language", "General Science", "Biology",
  "Chemistry", "Physics", "Computer Studies", "Economics",
  "Business Studies", "Geography", "History", "Other subjects"
];
      
