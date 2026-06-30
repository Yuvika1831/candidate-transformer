const REQUIRED_FIELDS = [
  "candidate_id",
  "full_name",
  "emails",
  "phones",
  "headline",
  "years_experience",
  "skills",
  "confidence",
  "provenance"
];

class ProfileValidator {
  /**
   * Validates the final canonical candidate profile.
   */
  static validate(profile) {
    const errors = [];

    // Required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in profile)) {
        errors.push(`Missing field : ${field}`);
      }
    }

    // Name validation
    if (!profile.full_name) {
      errors.push("Candidate name is missing.");
    }

    // Email validation
    const emails = profile.emails ?? [];

    if (!Array.isArray(emails)) {
      errors.push("Emails should be a list.");
    }

    // Phone validation
    const phones = profile.phones ?? [];

    if (!Array.isArray(phones)) {
      errors.push("Phones should be a list.");
    }

    // Skills validation
    const skills = profile.skills ?? [];

    if (!Array.isArray(skills)) {
      errors.push("Skills should be a list.");
    }

    // Experience validation
    const exp = profile.years_experience;

    if (exp !== null && exp !== undefined) {
      const num = Number(exp);
      if (Number.isNaN(num) || !Number.isFinite(num)) {
        errors.push("Years of experience must be numeric.");
      }
    }

    return errors;
  }

  static isValid(profile) {
    return ProfileValidator.validate(profile).length === 0;
  }
}

module.exports = { ProfileValidator };
