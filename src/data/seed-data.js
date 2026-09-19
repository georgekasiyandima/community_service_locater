/**
 * Field-test dataset: Mutasa Central — Bvumba Ward 14 and Sherukuru Ward 15.
 *
 * Names come from local knowledge. Statuses are starting demo values only
 * until a councillor, teacher, clinic clerk or parish rep confirms them.
 * Do not invent phone numbers for real places.
 */

const SEED_VERSION = 2;

const wards = [
  {
    id: "mutasa-ward-14",
    number: 14,
    name: "Ward 14 — Bvumba",
    shortName: "Bvumba",
    district: "Mutasa Central",
    region: "Manicaland",
    area: "Bvumba, Chikumbu, Mukoyi, Murowe and Zambe",
    country: "Zimbabwe"
  },
  {
    id: "mutasa-ward-15",
    number: 15,
    name: "Ward 15 — Sherukuru",
    shortName: "Sherukuru",
    district: "Mutasa Central",
    region: "Manicaland",
    area: "Sherukuru, Hakuziwi and Osborne Dam",
    country: "Zimbabwe"
  }
];

const admins = [
  {
    id: "admin-bvumba",
    phoneNumber: "+263771000001",
    name: "Ward 14 councillor (demo)",
    role: "Ward councillor",
    wardId: "mutasa-ward-14",
    active: true
  },
  {
    id: "admin-sherukuru",
    phoneNumber: "+263771000002",
    name: "Ward 15 parish rep (demo)",
    role: "Parish representative",
    wardId: "mutasa-ward-15",
    active: true
  }
];

const entries = [
  {
    id: "entry-school-murowe",
    code: "SCHOOL1",
    wardId: "mutasa-ward-14",
    type: "school",
    name: "Bvumba Murowe Primary",
    locationNote: "Murowe, Ward 14 Bvumba",
    contact: "",
    status: "open",
    extraInfo: "Term dates and hours to confirm on the first field visit."
  },
  {
    id: "entry-school-chikumbu",
    code: "SCHOOL2",
    wardId: "mutasa-ward-14",
    type: "school",
    name: "Chikumbu Primary",
    locationNote: "Chikumbu village, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Ask at the office for ECD and feeding times."
  },
  {
    id: "entry-school-bvumba-sec",
    code: "SCHOOL3",
    wardId: "mutasa-ward-14",
    type: "school",
    name: "Bvumba Secondary",
    locationNote: "Bvumba, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Day school. Parents' meeting dates to confirm."
  },
  {
    id: "entry-school-zambe-pri",
    code: "SCHOOL4",
    wardId: "mutasa-ward-14",
    type: "school",
    name: "Zambe Primary",
    locationNote: "Zambe, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Paired with Zambe Secondary on the same community site."
  },
  {
    id: "entry-school-zambe-sec",
    code: "SCHOOL5",
    wardId: "mutasa-ward-14",
    type: "school",
    name: "Zambe Secondary",
    locationNote: "Zambe, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Paired with Zambe Primary. Hours to confirm."
  },
  {
    id: "entry-borehole-chikumbu",
    code: "BOREHOLE1",
    wardId: "mutasa-ward-14",
    type: "borehole",
    name: "Chikumbu Village Borehole",
    locationNote: "Chikumbu village",
    contact: "Water point committee",
    status: "working",
    extraInfo: "Community borehole. Queue times to confirm."
  },
  {
    id: "entry-borehole-mukoyi",
    code: "BOREHOLE2",
    wardId: "mutasa-ward-14",
    type: "borehole",
    name: "Mukoyi Village Borehole",
    locationNote: "Mukoyi village",
    contact: "Water point committee",
    status: "broken",
    extraInfo: "Demo starting status: broken. Confirm on the ground, then UPDATE BOREHOLE2 WORKING."
  },
  {
    id: "entry-church-anglican",
    code: "CHURCH1",
    wardId: "mutasa-ward-14",
    type: "church",
    name: "Bvumba Anglican Church",
    locationNote: "Bvumba, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Service times to confirm with the parish."
  },
  {
    id: "entry-church-xavier",
    code: "CHURCH2",
    wardId: "mutasa-ward-14",
    type: "church",
    name: "St Xavier Chikumbu Catholic Church",
    locationNote: "Chikumbu, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Mass times to confirm with the outstation."
  },
  {
    id: "entry-church-kilian",
    code: "CHURCH3",
    wardId: "mutasa-ward-14",
    type: "church",
    name: "St Kilian's Mission",
    locationNote: "St Kilian's Mission, Mutasa Central",
    contact: "",
    status: "open",
    extraInfo: "Mission station. Confirm school, clinic and Mass hours locally."
  },
  {
    id: "entry-shop-chinhanhu",
    code: "SHOP1",
    wardId: "mutasa-ward-14",
    type: "shop",
    name: "Chinhanhu Grinding Mill",
    locationNote: "Chinhanhu, Ward 14",
    contact: "",
    status: "open",
    extraInfo: "Known locally as Chinhanhu Grinding Meal. Milling days to confirm."
  },
  {
    id: "entry-school-sherukuru-pri",
    code: "SCHOOL6",
    wardId: "mutasa-ward-15",
    type: "school",
    name: "Sherukuru Primary",
    locationNote: "Sherukuru, Ward 15",
    contact: "",
    status: "open",
    extraInfo: "Term dates and hours to confirm on the first field visit."
  },
  {
    id: "entry-school-sherukuru-sec",
    code: "SCHOOL7",
    wardId: "mutasa-ward-15",
    type: "school",
    name: "Sherukuru Secondary High School",
    locationNote: "Sherukuru, Ward 15",
    contact: "",
    status: "open",
    extraInfo: "Day school. Confirm boarding or sports days locally."
  },
  {
    id: "entry-clinic-sherukuru",
    code: "CLINIC1",
    wardId: "mutasa-ward-15",
    type: "clinic",
    name: "Sherukuru Clinic",
    locationNote: "Sherukuru growth point, Ward 15",
    contact: "",
    status: "open",
    extraInfo: "Nearest clinic named for this pilot. Hours and nurse-on-duty to confirm."
  },
  {
    id: "entry-police-sherukuru",
    code: "POLICE1",
    wardId: "mutasa-ward-15",
    type: "police",
    name: "Sherukuru Police Station",
    locationNote: "Sherukuru, Ward 15",
    contact: "",
    status: "open",
    extraInfo: "Report desk hours to confirm. For emergencies use the national numbers."
  },
  {
    id: "entry-borehole-hakuziwi",
    code: "BOREHOLE3",
    wardId: "mutasa-ward-15",
    type: "borehole",
    name: "Hakuziwi Village Borehole",
    locationNote: "Hakuziwi village, Ward 15",
    contact: "Water point committee",
    status: "working",
    extraInfo: "Community borehole. Confirm if the handle and apron are sound."
  },
  {
    id: "entry-water-osborne",
    code: "DAM1",
    wardId: "mutasa-ward-15",
    type: "water",
    name: "Osborne Dam",
    locationNote: "Osborne Dam, Mutasa",
    contact: "",
    status: "working",
    extraInfo: "Major dam — not a drinking borehole. Ask locally about safe collection points."
  },
  {
    id: "entry-shop-dziruni",
    code: "SHOP2",
    wardId: "mutasa-ward-15",
    type: "shop",
    name: "Dziruni Shops",
    locationNote: "Dziruni, Ward 15 area",
    contact: "",
    status: "open",
    extraInfo: "Trading times to confirm with the shopkeepers."
  }
];

module.exports = { SEED_VERSION, wards, admins, entries };
