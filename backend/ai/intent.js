/**
 * AU Help AI - Intent Detection
 *
 * This module identifies what the user is asking about.
 *
 * It does NOT fetch university data.
 * It only analyzes the user's message and returns
 * a structured intent object.
 */


/**
 * Normalize user input.
 *
 * @param {string} message
 * @returns {string}
 */
function normalizeText(message) {
  return String(message || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/**
 * Keyword groups used for intent detection.
 */
const INTENT_KEYWORDS = {
  results: [
    "result",
    "results",
    "mark",
    "marks",
    "grade",
    "grades",
    "semester result",
    "exam result",
    "score",
    "scores",
    "pass",
    "fail"
  ],

  fees: [
    "fee",
    "fees",
    "tuition",
    "payment",
    "payments",
    "course fee",
    "college fee",
    "semester fee",
    "fee structure"
  ],

  departments: [
    "department",
    "departments",
    "faculty",
    "faculties",
    "hod",
    "head of department",
    "branch",
    "branches"
  ],

  staff: [
    "staff",
    "teacher",
    "teachers",
    "professor",
    "professors",
    "faculty member",
    "faculty members",
    "lecturer",
    "lecturers"
  ],

  programmes: [
    "programme",
    "programmes",
    "program",
    "programs",
    "course",
    "courses",
    "degree",
    "degrees",
    "b.e",
    "be course",
    "b.tech",
    "btech",
    "m.e",
    "me course",
    "m.tech",
    "mtech",
    "phd",
    "ph.d"
  ],

  admissions: [
    "admission",
    "admissions",
    "apply",
    "application",
    "applications",
    "eligibility",
    "eligible",
    "admission date",
    "application date",
    "application form",
    "how to apply"
  ],

  exams: [
    "exam",
    "exams",
    "examination",
    "examinations",
    "timetable",
    "time table",
    "exam date",
    "exam dates",
    "hall ticket",
    "hall tickets",
    "internal exam",
    "semester exam"
  ],

  notices: [
    "notice",
    "notices",
    "notification",
    "notifications",
    "announcement",
    "announcements",
    "circular",
    "circulars",
    "official notice"
  ],

  placements: [
    "placement",
    "placements",
    "placed",
    "company",
    "companies",
    "recruitment",
    "campus placement",
    "campus placements",
    "job",
    "jobs",
    "career",
    "careers"
  ],

  general: [
    "hello",
    "hi",
    "hey",
    "help",
    "who are you",
    "what can you do"
  ]
};


/**
 * Detect an intent from the user's message.
 *
 * @param {string} message
 * @returns {string}
 */
function detectIntent(message) {
  const text = normalizeText(message);

  if (!text) {
    return "unknown";
  }

  const scores = {};

  /*
   * Give each intent a score based on matching keywords.
   */
  for (const [intent, keywords] of Object.entries(
    INTENT_KEYWORDS
  )) {
    scores[intent] = 0;

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        /*
         * Longer phrases are more specific,
         * so they receive a slightly higher score.
         */
        scores[intent] += keyword.length > 8 ? 2 : 1;
      }
    }
  }

  /*
   * Find the intent with the highest score.
   */
  let bestIntent = "unknown";
  let highestScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestIntent = intent;
    }
  }

  /*
   * If nothing matched, treat it as a general question.
   */
  if (highestScore === 0) {
    return "general";
  }

  return bestIntent;
}


/**
 * Detect intent and return additional information.
 *
 * @param {string} message
 * @returns {Object}
 */
function analyzeIntent(message) {
  const normalized = normalizeText(message);
  const intent = detectIntent(normalized);

  return {
    intent,
    message: normalized,
    confidence: calculateConfidence(normalized, intent),
    keywords: getMatchedKeywords(normalized, intent)
  };
}


/**
 * Calculate a simple confidence value.
 *
 * This is NOT an AI probability.
 * It is only a local keyword-matching score.
 *
 * @param {string} message
 * @param {string} intent
 * @returns {number}
 */
function calculateConfidence(message, intent) {
  if (!message || !intent) {
    return 0;
  }

  if (!INTENT_KEYWORDS[intent]) {
    return 0;
  }

  const matchedKeywords = getMatchedKeywords(
    message,
    intent
  );

  if (matchedKeywords.length === 0) {
    return 0;
  }

  /*
   * Keep confidence between 0 and 1.
   *
   * This value represents keyword-match strength,
   * not real-world model confidence.
   */
  const score =
    matchedKeywords.reduce(
      (total, keyword) => total + keyword.length,
      0
    ) /
    INTENT_KEYWORDS[intent].reduce(
      (total, keyword) => total + keyword.length,
      0
    );

  return Math.min(
    Number(score.toFixed(2)),
    1
  );
}


/**
 * Return the keywords that matched the user's message.
 *
 * @param {string} message
 * @param {string} intent
 * @returns {Array<string>}
 */
function getMatchedKeywords(message, intent) {
  const text = normalizeText(message);

  if (!text || !INTENT_KEYWORDS[intent]) {
    return [];
  }

  return INTENT_KEYWORDS[intent].filter(
    (keyword) => text.includes(keyword)
  );
}


/**
 * Check whether the message is asking about
 * student-specific information.
 *
 * @param {string} message
 * @returns {boolean}
 */
function isStudentQuery(message) {
  const text = normalizeText(message);

  const studentKeywords = [
    "my result",
    "my results",
    "my marks",
    "my grade",
    "my fees",
    "my fee",
    "my application",
    "my admission",
    "my hall ticket",
    "my student details",
    "register number",
    "register no",
    "roll number",
    "roll no"
  ];

  return studentKeywords.some(
    (keyword) => text.includes(keyword)
  );
}


/**
 * Check whether the message contains a possible
 * register / roll number.
 *
 * @param {string} message
 * @returns {string|null}
 */
function extractRegisterNumber(message) {
  const text = String(message || "");

  const patterns = [
    /register\s*(?:number|no|num|id)?\s*[:#-]?\s*([A-Za-z0-9/_-]{3,30})/i,
    /reg\s*(?:number|no|num|id)?\s*[:#-]?\s*([A-Za-z0-9/_-]{3,30})/i,
    /roll\s*(?:number|no|num|id)?\s*[:#-]?\s*([A-Za-z0-9/_-]{3,30})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}


/**
 * Determine whether a message is a greeting.
 *
 * @param {string} message
 * @returns {boolean}
 */
function isGreeting(message) {
  const text = normalizeText(message);

  const greetings = [
    "hi",
    "hello",
    "hey",
    "hi au",
    "hello au",
    "hey au",
    "good morning",
    "good afternoon",
    "good evening"
  ];

  return greetings.includes(text);
}


/**
 * Get all supported intents.
 *
 * @returns {Array<string>}
 */
function getSupportedIntents() {
  return [
    "results",
    "fees",
    "departments",
    "staff",
    "programmes",
    "admissions",
    "exams",
    "notices",
    "placements",
    "general",
    "unknown"
  ];
}


module.exports = {
  normalizeText,
  detectIntent,
  analyzeIntent,
  calculateConfidence,
  getMatchedKeywords,
  isStudentQuery,
  extractRegisterNumber,
  isGreeting,
  getSupportedIntents
};
