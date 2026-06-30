const fs = require("fs");

class ATSParser {
  /**
   * Reads structured ATS JSON data
   * and converts it into a common format.
   */
  constructor(filePath) {
    this.filePath = filePath;
  }

  parse() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`ATS file not found : ${this.filePath}`);
    }

    const raw = fs.readFileSync(this.filePath, "utf-8");
    const data = JSON.parse(raw);

    const profile = {
      candidate_id: data.candidate_id ?? null,

      full_name: data.name ?? null,

      emails: data.email ? [data.email] : [],

      phones: data.phone ? [data.phone] : [],

      headline: data.title ?? null,

      years_experience: data.experience ?? null,

      skills: data.skills ?? [],

      education: data.education ?? [],

      work_experience: data.work_experience ?? [],

      location: data.location ?? null,

      linkedin: data.linkedin ?? null,

      github: data.github ?? null,

      source: "ATS"
    };

    return profile;
  }
}

module.exports = { ATSParser };
