const fs = require("fs");
const path = require("path");

const { ATSParser } = require("./parsers/atsParser");
const { ResumeParser } = require("./parsers/resumeParser");
const { ProfileMerger } = require("./merger");
const { ProfileValidator } = require("./validator");

function loadConfig() {
  const raw = fs.readFileSync(path.join(__dirname, "config.json"), "utf-8");
  return JSON.parse(raw);
}

function projectFields(profile, config) {
  const result = {};

  for (const field of config.fields) {
    if (field in profile) {
      result[field] = profile[field];
    }
  }

  return result;
}

function saveOutput(profile) {
  fs.writeFileSync(
    path.join(__dirname, "output", "result.json"),
    JSON.stringify(profile, null, 4),
    "utf-8"
  );
}

function buildProfile() {
  console.log("Reading ATS...");
  const ats = new ATSParser(path.join(__dirname, "input", "ats.json")).parse();

  console.log("Reading Resume...");
  const resume = new ResumeParser(
    path.join(__dirname, "input", "resume.txt")
  ).parse();

  console.log("Merging Profiles...");
  let merged = new ProfileMerger(ats, resume).merge();

  console.log("Loading Config...");
  const config = loadConfig();

  merged = projectFields(merged, config);

  console.log("Validating...");
  const errors = ProfileValidator.validate(merged);

  return { merged, errors };
}

function main() {
  const { merged, errors } = buildProfile();

  if (errors.length > 0) {
    console.log("\nValidation Failed\n");
    for (const error of errors) {
      console.log(error);
    }
    return;
  }

  console.log("Saving Output...");
  saveOutput(merged);

  console.log("\nAssignment Completed Successfully.");
  console.log("Output File : output/result.json");
}

if (require.main === module) {
  main();
}

module.exports = { buildProfile, loadConfig, projectFields, saveOutput };
