const SKILL_MAP = {
  py: "Python",
  python: "Python",

  sql: "SQL",
  mysql: "SQL",

  js: "JavaScript",
  javascript: "JavaScript",

  node: "NodeJS",
  nodejs: "NodeJS",

  docker: "Docker",

  flask: "Flask",

  django: "Django",

  git: "Git",

  aws: "AWS",

  azure: "Azure",

  html: "HTML",

  css: "CSS",

  react: "React",

  mongodb: "MongoDB",

  pandas: "Pandas",

  numpy: "NumPy"
};

function toTitleCase(str) {
  return str
    .split(" ")
    .map((word) =>
      word.length === 0
        ? word
        : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

class SkillNormalizer {
  /**
   * Normalize skills into canonical names.
   */
  static normalize(skill) {
    if (skill === null || skill === undefined) {
      return null;
    }

    const key = skill.trim().toLowerCase();

    if (Object.prototype.hasOwnProperty.call(SKILL_MAP, key)) {
      return SKILL_MAP[key];
    }

    return toTitleCase(skill.trim());
  }

  static normalizeList(skillList) {
    const result = [];

    for (const skill of skillList) {
      const normalized = SkillNormalizer.normalize(skill);

      if (!result.includes(normalized)) {
        result.push(normalized);
      }
    }

    result.sort();

    return result;
  }
}

module.exports = { SkillNormalizer };
