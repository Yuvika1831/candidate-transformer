const { PhoneNormalizer } = require("./normalizers/phone");
const { SkillNormalizer } = require("./normalizers/skills");

const META_FIELDS = [
  "candidate_id",
  "full_name",
  "emails",
  "phones",
  "headline",
  "years_experience",
  "skills",
  "education",
  "work_experience",
  "location",
  "linkedin",
  "github"
];

// Mirrors Python's "value not in [None, "", []]" check used by pick_field
function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

// Mirrors Python's plain truthiness check ("if value:") used by
// generate_confidence / generate_provenance, where 0 and false are falsy too
function isPythonTruthy(value) {
  if (value === null || value === undefined) return false;
  if (value === "" || value === 0 || value === false) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

class ProfileMerger {
  constructor(atsProfile, resumeProfile) {
    this.ats = atsProfile;
    this.resume = resumeProfile;
  }

  merge() {
    const profile = {};

    // -----------------------------
    // Basic Fields
    // -----------------------------

    profile.candidate_id =
      this.ats.candidate_id ?? this.resume.candidate_id ?? null;

    profile.full_name = this.pickField("full_name");
    profile.headline = this.pickField("headline");
    profile.years_experience = this.pickField("years_experience");
    profile.location = this.pickField("location");
    profile.linkedin = this.pickField("linkedin");
    profile.github = this.pickField("github");

    // -----------------------------
    // Emails
    // -----------------------------

    let emails = this.mergeLists(
      this.ats.emails || [],
      this.resume.emails || []
    );

    emails = emails
      .filter((email) => email)
      .map((email) => email.trim().toLowerCase());

    profile.emails = [...new Set(emails)].sort();

    // -----------------------------
    // Phones
    // -----------------------------

    const phones = this.mergeLists(
      this.ats.phones || [],
      this.resume.phones || []
    );

    profile.phones = PhoneNormalizer.normalizeList(phones);

    // -----------------------------
    // Skills
    // -----------------------------

    const skills = this.mergeLists(
      this.ats.skills || [],
      this.resume.skills || []
    );

    profile.skills = SkillNormalizer.normalizeList(skills);

    // -----------------------------
    // Education
    // -----------------------------

    profile.education = this.mergeLists(
      this.ats.education || [],
      this.resume.education || []
    );

    // -----------------------------
    // Work Experience
    // -----------------------------

    profile.work_experience = this.mergeLists(
      this.ats.work_experience || [],
      this.resume.work_experience || []
    );

    // -----------------------------
    // Metadata
    // -----------------------------

    profile.confidence = this.generateConfidence(profile);
    profile.provenance = this.generateProvenance();

    return profile;
  }

  // ===================================================

  pickField(field) {
    /**
     * Conflict Resolution
     *
     * ATS has higher priority.
     *
     * If ATS doesn't have the field,
     * Resume value is used.
     */
    const ats = this.ats[field];

    if (!isEmpty(ats)) {
      return ats;
    }

    return this.resume[field] ?? null;
  }

  // ===================================================

  mergeLists(list1, list2) {
    const merged = [];
    const combined = [...list1, ...list2];

    for (const item of combined) {
      const exists = merged.some(
        (existing) => JSON.stringify(existing) === JSON.stringify(item)
      );

      if (!exists) {
        merged.push(item);
      }
    }

    return merged;
  }

  // ===================================================

  generateConfidence(profile) {
    const confidence = {};

    for (const field of META_FIELDS) {
      const ats = this.ats[field];
      const resume = this.resume[field];

      const atsTruthy = isPythonTruthy(ats);
      const resumeTruthy = isPythonTruthy(resume);

      if (atsTruthy && resumeTruthy) {
        confidence[field] = 1.0;
      } else if (atsTruthy) {
        confidence[field] = 0.95;
      } else if (resumeTruthy) {
        confidence[field] = 0.8;
      } else {
        confidence[field] = 0.0;
      }
    }

    return confidence;
  }

  // ===================================================

  generateProvenance() {
    const provenance = {};

    for (const field of META_FIELDS) {
      const sources = [];

      const ats = this.ats[field];
      const resume = this.resume[field];

      if (!isEmpty(ats)) {
        sources.push("ATS");
      }

      if (!isEmpty(resume)) {
        sources.push("Resume");
      }

      provenance[field] = sources;
    }

    return provenance;
  }
}

module.exports = { ProfileMerger };
