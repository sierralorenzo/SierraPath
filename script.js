// script.js
const landingSection = document.getElementById("landingSection");
const formSection = document.getElementById("formSection");
const loadingSection = document.getElementById("loadingSection");
const resultsSection = document.getElementById("resultsSection");

const startBtn = document.getElementById("startBtn");
const howItWorksBtn = document.getElementById("howItWorksBtn");
const howItWorksCard = document.getElementById("howItWorksCard");
const homeBtn = document.getElementById("homeBtn");

const steps = document.querySelectorAll(".form-step");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const generateBtn = document.getElementById("generateBtn");
const careerForm = document.getElementById("careerForm");

const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");
const progressFill = document.getElementById("progressFill");

let currentStep = 1;
const totalSteps = steps.length;

const stepTitles = {
  1: "Basic Info",
  2: "Interests",
  3: "Strengths & Growth",
  4: "Experience",
  5: "Goals",
  6: "A Few More Things"
};

startBtn.addEventListener("click", () => {
  showPage("form");
});

howItWorksBtn.addEventListener("click", () => {
  howItWorksCard.classList.toggle("hidden");
});

homeBtn.addEventListener("click", () => {
  showPage("landing");
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
});

nextBtn.addEventListener("click", () => {
  if (validateStep(currentStep)) {
    currentStep++;
    updateStep();
  }
});

careerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateStep(currentStep)) return;

  const profile = getProfileData();
  const report = generateCareerReport(profile);

  showPage("loading");

  setTimeout(() => {
    renderReport(report, profile);
    showPage("results");
  }, 1500);
});

function showPage(page) {
  [landingSection, formSection, loadingSection, resultsSection].forEach(section => {
    section.classList.add("hidden");
    section.classList.remove("active");
  });

  if (page === "landing") landingSection.classList.remove("hidden"), landingSection.classList.add("active");
  if (page === "form") formSection.classList.remove("hidden"), formSection.classList.add("active");
  if (page === "loading") loadingSection.classList.remove("hidden"), loadingSection.classList.add("active");
  if (page === "results") resultsSection.classList.remove("hidden"), resultsSection.classList.add("active");

  if (page === "landing") {
    homeBtn.classList.add("hidden");
  } else {
    homeBtn.classList.remove("hidden");
  }
}

function updateStep() {
  steps.forEach(step => step.classList.remove("active"));
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add("active");

  stepLabel.textContent = `Step ${currentStep} of ${totalSteps}`;
  stepTitle.textContent = stepTitles[currentStep];
  progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;

  prevBtn.classList.toggle("hidden", currentStep === 1);
  nextBtn.classList.toggle("hidden", currentStep === totalSteps);
  generateBtn.classList.toggle("hidden", currentStep !== totalSteps);
}

function validateStep(stepNumber) {
  const step = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  const requiredFields = step.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      alert("Please answer all required fields before continuing.");
      field.focus();
      return false;
    }
  }
  return true;
}

function getProfileData() {
  return {
    name: document.getElementById("name").value.trim(),
    course: document.getElementById("course").value.trim(),
    yearLevel: document.getElementById("yearLevel").value.trim(),
    location: document.getElementById("location").value.trim(),
    interests: document.getElementById("interests").value.trim(),
    industries: document.getElementById("industries").value.trim(),
    strengths: document.getElementById("strengths").value.trim(),
    skillsToImprove: document.getElementById("skillsToImprove").value.trim(),
    experience: document.getElementById("experience").value.trim(),
    experienceGaps: document.getElementById("experienceGaps").value.trim(),
    shortTermGoals: document.getElementById("shortTermGoals").value.trim(),
    longTermGoals: document.getElementById("longTermGoals").value.trim(),
    cvText: document.getElementById("cvText").value.trim(),
    extraInfo: document.getElementById("extraInfo").value.trim()
  };
}

function generateCareerReport(profile) {
  const combinedText = `
    ${profile.course} ${profile.interests} ${profile.industries}
    ${profile.strengths} ${profile.skillsToImprove}
    ${profile.experience} ${profile.experienceGaps}
    ${profile.shortTermGoals} ${profile.longTermGoals}
    ${profile.cvText} ${profile.extraInfo}
  `.toLowerCase();

  const domain = detectDomain(combinedText);
  const internships = getInternships(domain, profile.location);
  const organizations = getOrganizations(domain);
  const projects = getProjects(domain, profile.experienceGaps);
  const roadmap = getRoadmap(domain);
  const nextSteps = getNextSteps(domain);

  return {
    insightSummary: getInsightSummary(profile, domain),
    internships,
    organizations,
    projects,
    roadmap,
    nextSteps
  };
}

function detectDomain(text) {
  if (containsAny(text, ["marketing", "brand", "advertising", "sales", "fashion", "media", "creative", "entertainment"])) {
    return "marketing";
  }
  if (containsAny(text, ["finance", "accounting", "banking", "investment", "economics"])) {
    return "finance";
  }
  if (containsAny(text, ["tech", "coding", "software", "data", "programming", "it", "computer"])) {
    return "tech";
  }
  if (containsAny(text, ["law", "legal", "policy", "government", "public service", "politics"])) {
    return "law";
  }
  if (containsAny(text, ["health", "medicine", "psychology", "mental health", "hospital"])) {
    return "health";
  }
  return "general";
}

function containsAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function getInsightSummary(profile, domain) {
  const namePart = profile.name ? `${profile.name}, ` : "";
  const strengths = shorten(profile.strengths);
  const interests = shorten(profile.interests);
  const gap = shorten(profile.experienceGaps);

  const summaries = {
    marketing: `${namePart}you seem naturally drawn to creative, people-facing, and brand-oriented work, especially around ${interests}. One of your clearest advantages is your foundation in ${strengths}, which gives you the potential to contribute both strategically and creatively. Your biggest gap right now appears to be ${gap}, which matters because this is often what separates interest from actual industry readiness. The smartest next move is to build visible, real-world proof through internships, org work, and small practical projects.`,
    finance: `${namePart}your profile points toward a structured, analytical path, with strong potential in business and finance-related environments. Your advantage lies in ${strengths}, which can translate well into data-driven and decision-making roles. The biggest gap you need to address is ${gap}, especially if you want to move from classroom knowledge into more applied experience. Right now, the priority is to gain exposure to real financial or business settings and start building credibility early.`,
    tech: `${namePart}your profile suggests strong potential for problem-solving and systems-oriented work, especially in areas connected to ${interests}. Your edge comes from ${strengths}, which can become a real asset in tech or digital environments. The biggest gap right now is ${gap}, and filling that will matter if you want to stand out beyond interest alone. The next best step is to build practical output, whether through internships, projects, or portfolio-based work.`,
    law: `${namePart}your profile suggests a strong fit for structured, impact-oriented work that may involve policy, advocacy, or legal thinking. Your strengths in ${strengths} already point to potential in environments that value reasoning, communication, and responsibility. The biggest growth area is ${gap}, which is important because exposure often shapes clarity in this path. The best next move is to gain firsthand experience through internships, advocacy spaces, or research-driven involvement.`,
    health: `${namePart}your responses suggest a service-oriented and people-centered path, with real potential in health-related or support-driven environments. Your current strengths in ${strengths} give you a strong starting point, especially in roles that require empathy, discipline, and communication. Your biggest gap is ${gap}, and addressing that can help you move from general interest into practical direction. For now, the smartest step is to gain exposure through volunteer work, organizations, and hands-on learning opportunities.`,
    general: `${namePart}your profile shows a mix of curiosity, growth potential, and a desire to become more intentional about your direction. Your current strengths in ${strengths} already give you a useful foundation, while your interests in ${interests} suggest several promising paths to explore. The biggest gap right now is ${gap}, which is important because experience is usually what creates clarity. At this stage, your goal should be to test environments early and collect real signals about what fits you best.`
  };

  return summaries[domain];
}

function getInternships(domain, location) {
  const loc = location || "the Philippines";

  const data = {
    marketing: [
      {
        title: "Marketing Intern",
        company: "Unilever Philippines",
        link: "https://careers.unilever.com/philippines",
        reason: `Strong starting point for branding, campaigns, and consumer marketing in ${loc}.`
      },
      {
        title: "Marketing Intern",
        company: "Shopee Philippines",
        link: "https://careers.shopee.ph/jobs",
        reason: "Good fit for fast-paced digital marketing and e-commerce exposure."
      },
      {
        title: "Brand / Marketing Intern",
        company: "L'Oréal",
        link: "https://careers.loreal.com/en_US/jobs",
        reason: "Relevant if you are interested in beauty, fashion, and brand work."
      },
      {
        title: "Media / Marketing Intern",
        company: "Summit Media",
        link: "https://www.summitmedia.com.ph/careers",
        reason: "Useful for content, media, publishing, and audience-facing work."
      },
      {
        title: "Internship Listings",
        company: "Kalibrr",
        link: "https://www.kalibrr.com/",
        reason: "Reliable platform to find local marketing and startup internships."
      }
    ],
    finance: [
      {
        title: "Internship Listings",
        company: "Kalibrr",
        link: "https://www.kalibrr.com/",
        reason: "Useful for business, finance, and analyst internships."
      },
      {
        title: "Internship Listings",
        company: "LinkedIn Jobs",
        link: "https://www.linkedin.com/jobs/",
        reason: "Good place to search for finance and banking internships."
      },
      {
        title: "Student Programs",
        company: "PwC Philippines",
        link: "https://www.pwc.com/ph/en/careers.html",
        reason: "Relevant for accounting, assurance, and consulting exposure."
      },
      {
        title: "Careers",
        company: "SGV & Co.",
        link: "https://www.sgv.ph/careers",
        reason: "Strong brand for students interested in accounting and advisory."
      },
      {
        title: "Internship Search",
        company: "JobStreet",
        link: "https://www.jobstreet.com.ph/",
        reason: "Useful fallback platform for finance-related openings."
      }
    ],
    tech: [
      {
        title: "Internship Listings",
        company: "LinkedIn Jobs",
        link: "https://www.linkedin.com/jobs/",
        reason: "Useful for tech, product, and startup roles."
      },
      {
        title: "Careers",
        company: "Accenture Philippines",
        link: "https://www.accenture.com/ph-en/careers",
        reason: "Good for tech, systems, and digital transformation exposure."
      },
      {
        title: "Internship Listings",
        company: "Kalibrr",
        link: "https://www.kalibrr.com/",
        reason: "Reliable local platform for junior tech roles."
      },
      {
        title: "Careers",
        company: "Globe",
        link: "https://careers.globe.com.ph/",
        reason: "Good entry point for digital, data, and tech-adjacent roles."
      },
      {
        title: "Internship Search",
        company: "JobStreet",
        link: "https://www.jobstreet.com.ph/",
        reason: "Useful fallback source for PH-based openings."
      }
    ],
    law: [
      {
        title: "Internship Search",
        company: "LinkedIn Jobs",
        link: "https://www.linkedin.com/jobs/",
        reason: "Useful for legal, policy, and government-adjacent internship searches."
      },
      {
        title: "Internship Search",
        company: "Kalibrr",
        link: "https://www.kalibrr.com/",
        reason: "Useful local platform for NGO, policy, and research roles."
      },
      {
        title: "Volunteer Opportunities",
        company: "Ateneo Human Rights Center",
        link: "https://ateneo.edu/aps/law/centers-institutes/ahrc",
        reason: "Relevant for legal aid, rights work, and policy exposure."
      },
      {
        title: "Careers",
        company: "Official Gazette / Government",
        link: "https://www.officialgazette.gov.ph/",
        reason: "Starting point for policy and public service awareness."
      },
      {
        title: "Internship Search",
        company: "JobStreet",
        link: "https://www.jobstreet.com.ph/",
        reason: "Useful fallback platform for legal support and admin roles."
      }
    ],
    health: [
      {
        title: "Volunteer Programs",
        company: "Philippine Red Cross",
        link: "https://redcross.org.ph/",
        reason: "Helpful for service-oriented and community health exposure."
      },
      {
        title: "Volunteer Opportunities",
        company: "Kythe Foundation",
        link: "https://kythe.org/",
        reason: "Relevant for people-centered and hospital-adjacent volunteer work."
      },
      {
        title: "Internship Search",
        company: "LinkedIn Jobs",
        link: "https://www.linkedin.com/jobs/",
        reason: "Useful for psychology, wellness, and health support roles."
      },
      {
        title: "Internship Search",
        company: "Kalibrr",
        link: "https://www.kalibrr.com/",
        reason: "Good local platform for junior health-related opportunities."
      },
      {
        title: "Internship Search",
        company: "JobStreet",
        link: "https://www.jobstreet.com.ph/",
        reason: "Useful fallback for support and admin roles in health organizations."
      }
    ],
    general: [
      {
        title: "Internship Listings",
        company: "LinkedIn Jobs",
        link: "https://www.linkedin.com/jobs/",
        reason: "Flexible source for many early-career opportunities."
      },
      {
        title: "Internship Listings",
        company: "Kalibrr",
        link: "https://www.kalibrr.com/",
        reason: "Good local source for student-friendly internships."
      },
      {
        title: "Internship Listings",
        company: "JobStreet",
        link: "https://www.jobstreet.com.ph/",
        reason: "Useful backup platform with broad coverage."
      },
      {
        title: "Careers",
        company: "Globe",
        link: "https://careers.globe.com.ph/",
        reason: "A good broad-based option for business, tech, and communications roles."
      },
      {
        title: "Careers",
        company: "Unilever Philippines",
        link: "https://careers.unilever.com/philippines",
        reason: "Strong brand for students exploring structured corporate paths."
      }
    ]
  };

  return data[domain];
}

function getOrganizations(domain) {
  const data = {
    marketing: [
      { name: "Ateneo Junior Marketing Association", reason: "Direct fit for marketing, brand work, and case competition exposure." },
      { name: "Ateneo Management Association", reason: "Broad business exposure, leadership, and project opportunities." },
      { name: "The GUIDON", reason: "Strong for communications, audience insight, and content-related experience." },
      { name: "Ateneo CODE", reason: "Useful if you want strategy and problem-solving exposure." },
      { name: "Junior Marketing Association of the Philippines", reason: "Good external network for marketing students." }
    ],
    finance: [
      { name: "Ateneo Management Association", reason: "Helpful for business leadership and strategic exposure." },
      { name: "Ateneo Economics Association", reason: "Good for students interested in analysis and economic issues." },
      { name: "Ateneo CODE", reason: "Useful for consulting-style thinking and client exposure." },
      { name: "JPIA", reason: "Relevant for accounting and finance-oriented development." },
      { name: "CFA Society Philippines resources", reason: "Good external ecosystem for finance learners." }
    ],
    tech: [
      { name: "Ateneo Computer Society", reason: "Strong for tech community, events, and peer learning." },
      { name: "Ateneo CODE", reason: "Useful for consulting, systems thinking, and problem-solving." },
      { name: "Google Developer Student Clubs", reason: "Good for skill-building and project exposure." },
      { name: "DEVCON", reason: "Good external tech community in the Philippines." },
      { name: "Startup PH communities", reason: "Useful if you want exposure to product and startup environments." }
    ],
    law: [
      { name: "Ateneo Lex", reason: "Useful for pre-law and legally inclined students." },
      { name: "Ateneo Debate Society", reason: "Helpful for argumentation, analysis, and public speaking." },
      { name: "Ateneo CODE", reason: "Useful if you are interested in public problem-solving and systems work." },
      { name: "Student government / advocacy groups", reason: "Good for governance, policy, and representation exposure." },
      { name: "Human rights or policy organizations", reason: "Relevant for impact-oriented and civic work." }
    ],
    health: [
      { name: "Kythe Foundation", reason: "Strong for hospital-adjacent and service-oriented volunteer work." },
      { name: "Philippine Red Cross Youth", reason: "Useful for community health and service exposure." },
      { name: "Mental health advocacy organizations", reason: "Relevant for psychology and people-centered work." },
      { name: "Campus health-related orgs", reason: "Good for peer involvement and service." },
      { name: "Community volunteer groups", reason: "Helpful for direct, practical exposure." }
    ],
    general: [
      { name: "Ateneo Management Association", reason: "A good broad starting point for growth and leadership." },
      { name: "Ateneo CODE", reason: "Useful for structured problem-solving and project work." },
      { name: "Student publications or media orgs", reason: "Helpful for communication, initiative, and consistency." },
      { name: "Volunteer-focused organizations", reason: "Strong for building experience and impact." },
      { name: "Professional student communities", reason: "Good for direction, networking, and exploration." }
    ]
  };

  return data[domain];
}

function getProjects(domain, gapText) {
  const gap = gapText.toLowerCase();

  const common = [
    { title: "Build a simple portfolio page", reason: "Helps make your work visible even if your experience is still developing." },
    { title: "Take on one real client or community project", reason: "Real-world feedback builds credibility faster than theory alone." },
    { title: "Document your growth publicly", reason: "Posting your learnings or outputs can sharpen clarity and attract opportunities." }
  ];

  if (domain === "marketing") {
    return [
      { title: "Run a small campaign for a local business", reason: "Good for testing content, promotion, and audience response." },
      { title: "Create a student trends content page", reason: "Shows insight into audiences, branding, and consistency." },
      { title: "Help organize promotions for an event", reason: "Useful if your gap includes execution or event exposure." },
      ...common.slice(0, 2)
    ];
  }

  if (domain === "finance") {
    return [
      { title: "Build a beginner finance case portfolio", reason: "Shows initiative and helps translate theory into practical thinking." },
      { title: "Track a company or sector weekly", reason: "Builds business judgment and analytical consistency." },
      { title: "Join a case competition or business challenge", reason: "Useful for decision-making under pressure." },
      ...common.slice(0, 2)
    ];
  }

  if (domain === "tech") {
    return [
      { title: "Build one small but complete project", reason: "A finished output matters more than many unfinished ideas." },
      { title: "Contribute to a student or org tech need", reason: "Useful for practical problem-solving and collaboration." },
      { title: "Start a mini portfolio of builds", reason: "Makes your skill growth easier to show." },
      ...common.slice(0, 2)
    ];
  }

  if (domain === "law") {
    return [
      { title: "Join research, advocacy, or policy writing work", reason: "Builds real exposure to structured issue analysis." },
      { title: "Volunteer in a civic or rights-based initiative", reason: "Useful for understanding how institutions affect people." },
      { title: "Practice argumentation through debates or issue briefs", reason: "Good for sharpening reasoning and communication." },
      ...common.slice(0, 2)
    ];
  }

  if (domain === "health") {
    return [
      { title: "Volunteer in a service-oriented setting", reason: "Useful for testing your fit in people-centered work." },
      { title: "Join a health advocacy or awareness initiative", reason: "Builds communication and mission-driven experience." },
      { title: "Shadow or interview practitioners if possible", reason: "Even indirect exposure can clarify long-term direction." },
      ...common.slice(0, 2)
    ];
  }

  return [
    { title: "Take on one project outside your comfort zone", reason: "Experience often creates clarity faster than overthinking." },
    { title: "Start a simple portfolio or proof-of-work folder", reason: "This makes your growth easier to show to others." },
    { title: "Join one org with high execution demands", reason: "Good for building momentum and practical skill." },
    ...common.slice(0, 2)
  ];
}

function getRoadmap(domain) {
  const data = {
    marketing: {
      short: [
        "Apply to 3 to 5 internships focused on marketing, media, or events.",
        "Join or take a more active role in a marketing- or communications-heavy organization.",
        "Build a small portfolio with campaigns, content, or event work."
      ],
      medium: [
        "Specialize based on real exposure: brand, advertising, media, or digital marketing.",
        "Take on leadership or execution-heavy roles in organizations or internships.",
        "Develop a stronger body of proof through client work, campaigns, or measurable outputs."
      ],
      long: [
        "Position yourself for brand strategy, marketing management, or creative leadership paths.",
        "Build a reputation for both storytelling and business value."
      ]
    },
    finance: {
      short: [
        "Gain your first finance- or business-related internship or competition experience.",
        "Strengthen your analytical and spreadsheet comfort through practical work.",
        "Build a track record of consistent business or market analysis."
      ],
      medium: [
        "Deepen exposure in a more specific lane such as banking, corporate finance, or advisory.",
        "Take on higher-responsibility opportunities that sharpen judgment and rigor.",
        "Build relationships with mentors or peers in the field."
      ],
      long: [
        "Move toward a credible finance, consulting, or strategy-oriented professional path.",
        "Be known for reliability, clarity, and sound decision-making."
      ]
    },
    tech: {
      short: [
        "Finish small practical outputs instead of only learning passively.",
        "Start building a simple portfolio of projects.",
        "Seek beginner-friendly internships, org tech work, or freelance tasks."
      ],
      medium: [
        "Strengthen one concrete lane such as software, data, product, or digital operations.",
        "Take on projects that require teamwork and real problem-solving.",
        "Build stronger technical proof through consistent outputs."
      ],
      long: [
        "Position yourself for a sustainable role in tech, product, or systems-driven work.",
        "Build a reputation for execution and solution quality."
      ]
    },
    law: {
      short: [
        "Gain exposure through advocacy, policy-related, or research-oriented involvement.",
        "Strengthen writing, analysis, and public reasoning.",
        "Explore settings that reveal whether structured institutional work fits you."
      ],
      medium: [
        "Take on more serious leadership, advocacy, or research responsibilities.",
        "Clarify whether you are more drawn to law, policy, governance, or civic strategy.",
        "Build a stronger track record of issue-based work."
      ],
      long: [
        "Move toward legal, policy, or governance-related impact work with stronger confidence.",
        "Be known for principled thinking and clear communication."
      ]
    },
    health: {
      short: [
        "Gain direct or near-direct exposure to service-oriented environments.",
        "Join volunteer or advocacy work that tests your fit in people-centered roles.",
        "Strengthen communication, consistency, and empathy in practical settings."
      ],
      medium: [
        "Clarify which area of health or support work fits your strengths best.",
        "Take on deeper volunteer or internship responsibilities.",
        "Build a stronger understanding of real needs on the ground."
      ],
      long: [
        "Move toward a meaningful health-related or support-driven path with clearer direction.",
        "Be known for both care and competence."
      ]
    },
    general: {
      short: [
        "Explore 2 to 3 different environments early instead of waiting for certainty.",
        "Join one organization and one practical project that stretch your skills.",
        "Start documenting your outputs and lessons."
      ],
      medium: [
        "Notice which experiences energize you and where you perform well.",
        "Choose a clearer lane based on evidence, not guesswork.",
        "Build proof through internships, projects, and stronger roles."
      ],
      long: [
        "Move toward a career path shaped by both interest and tested capability.",
        "Be known for initiative, adaptability, and follow-through."
      ]
    }
  };

  return data[domain];
}

function getNextSteps(domain) {
  const data = {
    marketing: [
      "Apply to at least 3 internships this week using Kalibrr, LinkedIn, or company sites.",
      "Start one visible project such as a mini campaign, portfolio, or content page.",
      "Reach out to one org or local business where you can practice real execution."
    ],
    finance: [
      "Apply to at least 3 business or finance-related openings this week.",
      "Start tracking one company, industry, or market trend consistently.",
      "Build one proof-of-work file that shows your thinking clearly."
    ],
    tech: [
      "Complete one small but working project within the next 7 days.",
      "Apply to a few entry-level or internship roles that match your current level.",
      "Start organizing your outputs into a clean portfolio."
    ],
    law: [
      "Join one advocacy, governance, or issue-based space this month.",
      "Write one short issue brief or reflection to sharpen your reasoning.",
      "Seek one exposure opportunity related to policy, research, or legal work."
    ],
    health: [
      "Look for one volunteer or service opportunity you can join soon.",
      "Talk to at least one person already in the field to clarify realities.",
      "Start building a record of service-oriented involvement."
    ],
    general: [
      "Choose one internship platform above and apply to at least 3 relevant roles this week.",
      "Join one org or project that gives you real responsibility.",
      "Start a simple folder or page where you document your outputs and growth."
    ]
  };

  return data[domain];
}

function renderReport(report, profile) {
  document.getElementById("reportName").textContent = profile.name
    ? `${profile.name}'s Career Direction Report`
    : "Your Career Direction Report";

  document.getElementById("insightSummary").textContent = report.insightSummary;
  document.getElementById("internshipIntro").textContent = "These are realistic entry points based on your profile, goals, and likely growth path.";
  document.getElementById("orgIntro").textContent = "These organizations can help you build stronger experience, community, and direction.";
  document.getElementById("projectIntro").textContent = "These ideas are meant to close your current gaps and turn interest into visible proof.";

  renderCards("internshipList", report.internships, internshipTemplate);
  renderCards("orgList", report.organizations, orgTemplate);
  renderCards("projectList", report.projects, projectTemplate);

  renderBullets("shortRoadmap", report.roadmap.short);
  renderBullets("mediumRoadmap", report.roadmap.medium);
  renderBullets("longRoadmap", report.roadmap.long);
  renderBullets("nextSteps", report.nextSteps);
}

function renderCards(containerId, items, templateFn) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(templateFn).join("");
}

function renderBullets(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function internshipTemplate(item) {
  return `
    <div class="result-item">
      <h4>${escapeHtml(item.title)} — ${escapeHtml(item.company)}</h4>
      <p>${escapeHtml(item.reason)}</p>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.link}</a>
    </div>
  `;
}

function orgTemplate(item) {
  return `
    <div class="result-item">
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.reason)}</p>
    </div>
  `;
}

function projectTemplate(item) {
  return `
    <div class="result-item">
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.reason)}</p>
    </div>
  `;
}

function shorten(text) {
  if (!text) return "your current profile";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 80 ? cleaned.slice(0, 77) + "..." : cleaned;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.getElementById("copyBtn").addEventListener("click", async () => {
  const reportText = buildPlainTextReport();
  try {
    await navigator.clipboard.writeText(reportText);
    alert("Results copied.");
  } catch {
    alert("Copy failed. Try again.");
  }
});

function buildPlainTextReport() {
  const reportName = document.getElementById("reportName").innerText;
  const summary = document.getElementById("insightSummary").innerText;

  const internships = [...document.querySelectorAll("#internshipList .result-item")].map(item => item.innerText).join("\n\n");
  const orgs = [...document.querySelectorAll("#orgList .result-item")].map(item => item.innerText).join("\n\n");
  const projects = [...document.querySelectorAll("#projectList .result-item")].map(item => item.innerText).join("\n\n");
  const short = [...document.querySelectorAll("#shortRoadmap li")].map(li => `• ${li.innerText}`).join("\n");
  const medium = [...document.querySelectorAll("#mediumRoadmap li")].map(li => `• ${li.innerText}`).join("\n");
  const long = [...document.querySelectorAll("#longRoadmap li")].map(li => `• ${li.innerText}`).join("\n");
  const next = [...document.querySelectorAll("#nextSteps li")].map(li => `• ${li.innerText}`).join("\n");

  return `${reportName}

PERSONALIZED INSIGHT SUMMARY
${summary}

INTERNSHIP OPPORTUNITIES (WHERE TO START)
${internships}

ORGANIZATIONS TO BUILD YOUR EDGE
${orgs}

PROJECTS THAT BUILD REAL EXPERIENCE
${projects}

PERSONALIZED ROADMAP

SHORT TERM (0–2 YEARS)
${short}

MEDIUM TERM (3–5 YEARS)
${medium}

LONG TERM DIRECTION
${long}

NEXT STEP (DO THIS NOW)
${next}`;
}

updateStep();
showPage("landing");