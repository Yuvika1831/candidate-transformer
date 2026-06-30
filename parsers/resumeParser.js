const fs = require("fs");

const SKILL_DATABASE = [
  "Python",
  "Java",
  "C++",
  "C#",
  "JavaScript",
  "SQL",
  "MySQL",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "Flask",
  "Django",
  "React",
  "NodeJS",
  "Git",
  "AWS",
  "Azure",
  "HTML",
  "CSS",
  "Pandas",
  "NumPy"
];

const CITIES = [
  "Delhi",
  "Mumbai",
  "Pune",
  "Noida",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata"
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

class ResumeParser {
  constructor(filePath) {
    this.filePath = filePath;
  }

  parse() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`Resume file not found: ${this.filePath}`);
    }

    const text = fs.readFileSync(this.filePath, "utf-8");

    const profile = {
      candidate_id: null,
      full_name: this.extractName(text),
      emails: this.extractEmails(text),
      phones: this.extractPhones(text),
      headline: this.extractHeadline(text),
      years_experience: this.extractExperience(text),
      skills: this.extractSkills(text),
      education: [],
      work_experience: [],
      location: this.extractLocation(text),
      linkedin: this.extractLinkedin(text),
      github: this.extractGithub(text),
      source: "Resume"
    };

    return profile;
  }

  extractName(text) {
    const lines = text.split("\n");

    for (let line of lines) {
      line = line.trim();

      if (line.length === 0) continue;
      if (line.includes("@")) continue;
      if (line.toLowerCase().includes("phone")) continue;
      if (line.toLowerCase().includes("email")) continue;

      if (line.split(/\s+/).filter(Boolean).length <= 4) {
        return line;
      }
    }

    return null;
  }

  extractHeadline(text) {
    const lines = text.split("\n");

    for (let line of lines) {
      line = line.trim();

      if (line.toLowerCase().includes("engineer")) return line;
      if (line.toLowerCase().includes("developer")) return line;
      if (line.toLowerCase().includes("analyst")) return line;
    }

    return null;
  }

  extractEmails(text) {
    const pattern = /[\w.-]+@[\w.-]+\.\w+/g;
    const matches = text.match(pattern) || [];
    return [...new Set(matches)];
  }

  extractPhones(text) {
    const pattern = /\+?\d[\d\s-]{8,}\d/g;
    const matches = text.match(pattern) || [];
    return [...new Set(matches)];
  }

  extractLinkedin(text) {
    const pattern = /https?:\/\/(?:www\.)?linkedin\.com\/\S+/;
    const match = text.match(pattern);
    return match ? match[0] : null;
  }

  extractGithub(text) {
    const pattern = /https?:\/\/(?:www\.)?github\.com\/\S+/;
    const match = text.match(pattern);
    return match ? match[0] : null;
  }

  extractLocation(text) {
    const lower = text.toLowerCase();

    for (const city of CITIES) {
      if (lower.includes(city.toLowerCase())) {
        return city;
      }
    }

    return null;
  }

  extractExperience(text) {
    const pattern = /(\d+)\s*\+?\s*(?:years|year)/i;
    const match = text.match(pattern);

    if (match) {
      return parseInt(match[1], 10);
    }

    return null;
  }

  extractSkills(text) {
    const found = [];
    const lowerText = text.toLowerCase();

    for (const skill of SKILL_DATABASE) {
      const pattern = new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`);

      if (pattern.test(lowerText)) {
        found.push(skill);
      }
    }

    return [...new Set(found)].sort();
  }
}

module.exports = { ResumeParser };
