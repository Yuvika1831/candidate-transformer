# candidate-transformer

A Node.js + Express service that merges candidate data from two different sources — an ATS (Applicant Tracking System) record and a parsed resume — into a single, clean, validated candidate profile.

Overview

Recruiting pipelines often have candidate data scattered across multiple systems (an ATS entry and a raw resume, for example), and the same fields can conflict, be missing, or be formatted differently. This project:


Parses structured ATS data and unstructured resume text into a common format
Merges both sources into one canonical profile, resolving conflicts with a clear priority rule
Normalizes messy fields like phone numbers and skill names into consistent formats
Attaches confidence scores and data provenance (which source each field came from) to every field
Validates the final profile before it's considered "ready"
Exposes everything through both a CLI and a REST API


Features


Dual-source parsing — separate parsers for ATS JSON and free-text resumes
Conflict resolution — ATS data takes priority; resume data fills in the gaps
Data normalization — phone numbers converted to E.164 format, skills mapped to canonical names (e.g. py → Python, js → JavaScript)
Confidence scoring — each field gets a 0–1 confidence score based on how many sources agree
Provenance tracking — every field records which source(s) it came from
Validation layer — required fields, type checks, and numeric checks before output is accepted
Configurable output shape — config.json controls which fields are projected into the final profile
REST API — Express endpoints to run the full pipeline on demand
CLI mode — run the same pipeline from the command line, writing results to disk


Project Structure

.
├── config.json              # Controls which fields appear in the final output
├── input/
│   ├── ats.json             # Sample ATS data
│   └── resume.txt           # Sample resume text
├── output/
│   └── result.json          # Generated merged profile
├── parsers/
│   ├── atsParser.js         # Converts raw ATS JSON into a common profile shape
│   └── resumeParser.js      # Extracts name, contact info, skills, etc. from resume text
├── normalizers/
│   ├── phone.js             # Normalizes phone numbers to E.164 format
│   ├── skills.js             # Maps skill aliases to canonical names
│   └── dates.js              # Normalizes date strings into a consistent format
├── merger.js                 # Merges ATS + resume profiles, resolves conflicts, scores confidence
├── validator.js               # Validates the final merged profile
├── main.js                    # CLI entry point — runs the full pipeline end-to-end
├── server.js                  # Express server exposing the pipeline as a REST API
└── package.json

Getting Started

Prerequisites


Node.js (v16 or higher recommended)
npm


Installation

bashnpm install

Run as a CLI

bashnpm run cli

Reads input/ats.json and input/resume.txt, merges and validates them, and writes the result to output/result.json.

Run as an API server

bashnpm start

Server starts on http://localhost:3000 (override with the PORT environment variable).

API Endpoints

MethodEndpointDescriptionGET/api/profileRuns the full pipeline and returns the merged profile as JSON. Returns 422 with validation errors if the profile fails validation.POST/api/profile/saveSame as above, but also writes the result to output/result.json.GET/healthSimple health check endpoint.

Example

bashcurl http://localhost:3000/api/profile

json{
  "candidate_id": "C001",
  "full_name": "Rahul Sharma",
  "emails": ["rahul@gmail.com"],
  "phones": ["+919876543210"],
  "headline": "Software Engineer",
  "years_experience": 4,
  "skills": ["Docker", "Flask", "Git", "Python", "SQL"],
  "confidence": { "full_name": 1, "emails": 1 },
  "provenance": { "full_name": ["ATS", "Resume"] }
}

How Merging Works


Field-level conflicts (name, headline, location, etc.) are resolved with ATS data taking priority over resume data.
List fields (emails, phones, skills, education, work experience) are combined and de-duplicated across both sources.
Phones and skills are passed through dedicated normalizers to produce consistent, canonical values.
Confidence scores reflect how many sources contributed to a field — fields confirmed by both ATS and resume score highest.
Provenance records exactly which source(s) supplied each field, useful for auditing and debugging.


Tech Stack

Node.js
Express.js
