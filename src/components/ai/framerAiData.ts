export interface InstitutionMatch {
  name: string;
  department: string;
  matchScore: number;
  expertise: string[];
  recommendedLab: string;
  leadFaculty: string;
  rationale: string;
}

export interface SolutionBlueprint {
  title: string;
  domain: string;
  subDomain: string;
  district: string;
  severityScore: number;
  impactReach: string;
  summary: string;
  rootCauses: string[];
  keyDeliverables: string[];
  techStack: string[];
  nepTrack: {
    studentRoles: string[];
    academicCredits: string;
    facultyMentorDepartment: string;
  };
  estimatedBudget: string;
  timelineMonths: number;
  matchedInstitutions: InstitutionMatch[];
  phases: {
    phase: string;
    duration: string;
    milestone: string;
  }[];
}

export const PRESET_PROMPTS = [
  {
    label: "💧 Fluoride Water Filtration",
    district: "Palamu & Garhwa",
    domain: "Water Resources",
    query: "High fluoride contamination in groundwater causing severe fluorosis in Daltonganj villages",
  },
  {
    label: "🌾 Solar Cold Storage for Tribal Farmers",
    district: "Khunti & Gumla",
    domain: "Agriculture",
    query: "Tribal farmers losing 40% of perishable tomato and lac produce due to lack of grid power and cold storage",
  },
  {
    label: "🗣️ Santhali NLP & Voice Assistant",
    district: "Dumka & Santhal Parganas",
    domain: "Education & Culture",
    query: "Digital exclusion of Santhali Ol Chiki script speakers in accessing government e-services and mobile learning",
  },
  {
    label: "🔥 AI Forest Fire Early Warning",
    district: "West Singhbhum (Saranda)",
    domain: "Environment & Forestry",
    query: "Frequent summer forest fires in Saranda destroying Sal forest biodiversity before ground forest rangers can respond",
  },
  {
    label: "🏥 Remote Telemedicine & Drone Drops",
    district: "Latehar & Simdega",
    domain: "Healthcare",
    query: "Tribal hamlets cut off during monsoon lacking emergency antivenom, maternal medicines, and specialist consultations",
  },
  {
    label: "⚡ Mine Overburden Eco-Bricks",
    district: "Dhanbad & Bokaro",
    domain: "Clean Energy & Mining",
    query: "Massive coal mine overburden slag creating dust pollution and requiring eco-friendly low-carbon construction reuse",
  },
];

export const SAMPLE_BLUEPRINTS: Record<string, SolutionBlueprint> = {
  water: {
    title: "Solar-Assisted Nano-Filtration Fluoride Remediation Unit",
    domain: "Water Resources",
    subDomain: "Groundwater De-fluoridation & Sensor Monitoring",
    district: "Palamu & Garhwa",
    severityScore: 9.2,
    impactReach: "48,000+ villagers across 32 habitations",
    summary: "A decentralized, solar-powered nano-adsorbent filtration unit equipped with real-time IoT water quality telemetry to bring fluoride concentrations below WHO limits (<1.0 mg/L) without requiring continuous electrical grid power.",
    rootCauses: [
      "Deep granite aquifer geochemical leaching of natural fluorapatite",
      "Over-dependence on single deep borewells during dry summer months",
      "Lack of real-time community water testing kits in gram panchayats",
    ],
    keyDeliverables: [
      "Low-cost activated alumina / graphene oxide nano-filtration cartridge",
      "Solar DC pump with 5000L/day continuous purification yield",
      "GSM-enabled fluoride & TDS sensor dashboard for District Jal Nigam",
      "Village Jal Samiti maintenance & replacement protocol",
    ],
    techStack: ["IoT Water Flow Sensors", "Activated Nano-Alumina", "Solar PV 1.2kW", "ESP32 MCU", "Supabase GIS Dashboard"],
    nepTrack: {
      studentRoles: ["Water Chemistry Lab Analysts (B.Tech Chem)", "IoT Telemetry Firmware Developer (B.Tech ECE)", "Community Outreach Field Evaluator (MSW)"],
      academicCredits: "6 NEP-2020 Capstone R&D Credits",
      facultyMentorDepartment: "Dept of Chemical Engineering & Environmental Science",
    },
    estimatedBudget: "₹3.80 Lakhs (Prototype Pilot Unit)",
    timelineMonths: 4,
    matchedInstitutions: [
      {
        name: "Birla Institute of Technology (BIT) Mesra",
        department: "Department of Chemical Engineering",
        matchScore: 97,
        expertise: ["Nano-membrane filtration", "Adsorption kinetics", "Water potability testing"],
        recommendedLab: "Advanced Separation Technologies & Environmental Lab",
        leadFaculty: "Prof. R. Sengupta (Water Quality Lead)",
        rationale: "BIT Mesra holds 3 patented zeolite adsorption formulations specifically tested on Chota Nagpur plateau groundwaters.",
      },
      {
        name: "IIT (ISM) Dhanbad",
        department: "Department of Environmental Science & Engineering",
        matchScore: 94,
        expertise: ["Hydrogeology", "Heavy metal & anion remediation", "GIS water modeling"],
        recommendedLab: "Central Research Facility - Water Analysis Division",
        leadFaculty: "Dr. A. K. Mishra",
        rationale: "Extensive field data repository and active DST projects in Palamu water basin.",
      },
      {
        name: "National Institute of Technology (NIT) Jamshedpur",
        department: "Department of Civil Engineering",
        matchScore: 89,
        expertise: ["Rural water supply design", "Low-cost filtration", "Community infrastructure"],
        recommendedLab: "Environmental Engineering Lab",
        leadFaculty: "Dr. S. K. Sharma",
        rationale: "Demonstrated track record of deploying gravity-fed filtration systems in Kolhan division.",
      },
    ],
    phases: [
      { phase: "Phase 1: Lab Formulation & Media Sizing", duration: "Month 1", milestone: "Water sample bench tests & 99.2% fluoride capture rate verified" },
      { phase: "Phase 2: Hardware Prototype Assembly", duration: "Month 2", milestone: "Solar filtration unit fabrication with ESP32 GSM telemetry unit" },
      { phase: "Phase 3: Field Deployment in Daltonganj", duration: "Month 3-4", milestone: "Installation at model Gram Panchayat, Jal Samiti training, live portal data feed" },
    ],
  },
  agriculture: {
    title: "Micro-Peltier Off-Grid Cold Storage for Forest Produce & Vegetables",
    domain: "Agriculture & Rural Livelihoods",
    subDomain: "Post-Harvest Solar Cold Chain",
    district: "Khunti & Gumla",
    severityScore: 8.7,
    impactReach: "1,200+ tribal farmer families across 14 SHGs",
    summary: "Modular, community-scale 500kg thermal energy storage cooler utilizing phase change materials (PCM) and hybrid rooftop solar to extend shelf life of Mahua flowers, tomatoes, and forest mushrooms from 3 days to 28 days.",
    rootCauses: [
      "Distress selling at weekly Haat due to 0-48hr shelf life in summer",
      "High cost of commercial compressor cold storage and lack of 3-phase grid power",
      "Lack of decentralized pre-cooling infrastructure at Gram Sabha level",
    ],
    keyDeliverables: [
      "Thermal Phase Change Material (PCM) cold buffer room (4°C - 10°C)",
      "BLDC Solar-direct refrigeration loop with 0 battery dependency",
      "Smart weighing & SHG inventory tracking mobile app (Hindi/Ho/Mundari)",
    ],
    techStack: ["PCM Bio-Gels", "BLDC Solar Chiller", "LoRa Temperature Loggers", "React Native SHG App"],
    nepTrack: {
      studentRoles: ["Thermal Dynamics Modeler (B.Tech Mechanical)", "Agri-Supply Chain Logistics Coordinator (MBA Rural Mgmt)", "Embedded Sensor Developer"],
      academicCredits: "8 NEP-2020 Multi-Disciplinary Credits",
      facultyMentorDepartment: "Dept of Agricultural Engineering & Mechanical Eng",
    },
    estimatedBudget: "₹4.50 Lakhs (500kg Modular Pilot)",
    timelineMonths: 5,
    matchedInstitutions: [
      {
        name: "Birsa Agricultural University (BAU), Ranchi",
        department: "College of Agricultural Engineering",
        matchScore: 98,
        expertise: ["Post-harvest technology", "Tribal agro-economy", "Horticulture preservation"],
        recommendedLab: "Post Harvest Process Engineering & Solar Lab",
        leadFaculty: "Dr. P. K. Jha",
        rationale: "BAU has pre-existing Krishi Vigyan Kendra (KVK) centers in Khunti for immediate field pilot integration.",
      },
      {
        name: "BIT Mesra",
        department: "Department of Mechanical Engineering",
        matchScore: 92,
        expertise: ["Thermodynamics & Heat Transfer", "Phase change materials", "Solar thermal design"],
        recommendedLab: "Refrigeration & Solar Energy Laboratory",
        leadFaculty: "Prof. S. Mukherjee",
        rationale: "Specialized thermodynamic simulation rigs and computational fluid dynamics expertise.",
      },
    ],
    phases: [
      { phase: "Phase 1: Thermal PCM Optimization", duration: "Month 1-2", milestone: "PCM salt hydrate formulation maintaining 6°C for 36 hours off-sun" },
      { phase: "Phase 2: Prototype Fabrication", duration: "Month 3-4", milestone: "Fabrication of 500kg insulated polyurethane chamber with solar panel mounts" },
      { phase: "Phase 3: SHG Handover in Torpa, Khunti", duration: "Month 5", milestone: "Field deployment with Mahila Kisan Samiti, tracking 35% income uplift" },
    ],
  },
  general: {
    title: "AI-Driven Societal Innovation & Rapid Prototype Architecture",
    domain: "Multi-Disciplinary Innovation",
    subDomain: "Jharkhand State Problem Resolution Matrix",
    district: "Ranchi & Statewide",
    severityScore: 8.5,
    impactReach: "10,000+ local citizens across affected clusters",
    summary: "End-to-end academic R&D deployment plan connecting local ground challenges directly to university laboratory infrastructure, supported by NEP-2020 student credit integration and state innovation funding.",
    rootCauses: [
      "Fragmented communication between village panchayats and higher education labs",
      "Lack of tailored technological interventions suited to local topography",
      "Unstructured project lifecycles without auditable milestone accountability",
    ],
    keyDeliverables: [
      "Hardware/Software prototype tailored for local deployment",
      "University research report & open-source blueprint",
      "Field pilot deployment and citizen validation metrics",
    ],
    techStack: ["IoT / Edge Computing", "Cloud Telemetry", "Open Hardware", "Mobile App"],
    nepTrack: {
      studentRoles: ["Student Lead Researcher", "System Architect", "Field Deployment Coordinator"],
      academicCredits: "6 NEP-2020 Capstone R&D Credits",
      facultyMentorDepartment: "Department of Engineering & Applied Sciences",
    },
    estimatedBudget: "₹3.20 Lakhs",
    timelineMonths: 3,
    matchedInstitutions: [
      {
        name: "BIT Mesra",
        department: "Center for Innovation & Incubation",
        matchScore: 95,
        expertise: ["Rapid Prototyping", "Interdisciplinary Systems", "Field Testing"],
        recommendedLab: "Central Innovation & Fabrication Hub",
        leadFaculty: "Prof. In-Charge (Innovation Hub)",
        rationale: "Comprehensive multidisciplinary research teams and state-of-the-art rapid prototyping labs.",
      },
      {
        name: "IIT (ISM) Dhanbad",
        department: "Center of Excellence for Technology Transfer",
        matchScore: 93,
        expertise: ["Applied Engineering", "Earth & Energy Systems", "Geospatial Modeling"],
        recommendedLab: "Technology Innovation in Exploration & Mining Foundation",
        leadFaculty: "Dr. Research Director",
        rationale: "Tier-1 national institute capabilities with active state innovation partnerships.",
      },
    ],
    phases: [
      { phase: "Phase 1: Problem Deep-Dive & Lab Simulation", duration: "Month 1", milestone: "Technical blueprint validated against local constraints" },
      { phase: "Phase 2: Prototype Build & Bench Validation", duration: "Month 2", milestone: "Functional MVP created and bench tested" },
      { phase: "Phase 3: Pilot Deployment & Citizen Handover", duration: "Month 3", milestone: "Live on-ground trial with feedback collection" },
    ],
  },
};

export function generateFramerAiBlueprint(inputQuery: string): SolutionBlueprint {
  const lower = inputQuery.toLowerCase();
  
  let baseKey = "general";
  if (lower.includes("water") || lower.includes("fluoride") || lower.includes("filter") || lower.includes("handpump") || lower.includes("well") || lower.includes("arsenic")) {
    baseKey = "water";
  } else if (lower.includes("cold") || lower.includes("farm") || lower.includes("crop") || lower.includes("agri") || lower.includes("tomato") || lower.includes("fruit") || lower.includes("forest")) {
    baseKey = "agriculture";
  }

  const base = SAMPLE_BLUEPRINTS[baseKey] || SAMPLE_BLUEPRINTS.general;

  const detectedDistrict = lower.includes("palamu") ? "Palamu" :
    lower.includes("garhwa") ? "Garhwa" :
    lower.includes("khunti") ? "Khunti" :
    lower.includes("gumla") ? "Gumla" :
    lower.includes("dhanbad") ? "Dhanbad" :
    lower.includes("dumka") ? "Dumka" :
    lower.includes("ranchi") ? "Ranchi" :
    lower.includes("bokaro") ? "Bokaro" :
    lower.includes("latehar") ? "Latehar" : base.district;

  return {
    ...base,
    district: detectedDistrict,
    title: inputQuery.length > 15 ? `AI R&D Blueprint: ${inputQuery.slice(0, 50)}...` : base.title,
    summary: `Tailored R&D solution for: "${inputQuery}". Categorized and routed automatically via Jharkhand AI Innovation Grid to matched university labs. ${base.summary}`,
  };
}
