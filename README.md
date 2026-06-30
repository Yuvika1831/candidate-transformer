# Candidate Profile Merger (Node.js / Express)

This is a 1:1 conversion of the original Python project to Node.js + Express.
All parsing, normalization, merging and validation logic, inputs, and outputs
are kept identical to the Python version.

## Structure

```
.
├── config.json              # same field projection config
├── input/
│   ├── ats.json
│   └── resume.txt
├── output/
│   └── result.json          # generated output
├── parsers/
│   ├── atsParser.js         # port of parsers/ats_parser.py
│   └── resumeParser.js      # port of parsers/resume_parser.py
├── normalizers/
│   ├── phone.js              # port of normalizers/phone.py
│   ├── skills.js              # port of normalizers/skills.py
│   └── dates.js               # port of normalizers/dates.py
├── merger.js                 # port of merger.py
├── validator.js               # port of validator.py
├── main.js                    # port of main.py (CLI entry point)
├── server.js                  # new Express server wrapping the same logic
└── package.json
```

## Run as CLI (same behavior as `python main.py`)

```bash
npm install
npm run cli
```

This reads `input/ats.json` and `input/resume.txt`, merges/validates them,
and writes `output/result.json` — exactly like the Python script.

## Run as an Express API

```bash
npm install
npm start
```

Server starts on `http://localhost:3000` (override with `PORT` env var).

### Endpoints

- `GET /api/profile` — runs the full pipeline (read → merge → project →
  validate) and returns the merged profile as JSON. Returns HTTP 422 with
  validation errors if validation fails.
- `POST /api/profile/save` — same as above, but also writes
  `output/result.json` to disk (equivalent to running the CLI).
- `GET /health` — simple health check.

## Notes

- All logic — field merging priority (ATS > Resume), email/phone/skill
  normalization, confidence scoring, provenance tracking, and validation
  rules — is preserved exactly from the Python implementation.
- Output for the bundled sample input (`input/ats.json` + `input/resume.txt`)
  is byte-for-byte equivalent (modulo `1` vs `1.0`, which are the same JSON
  number) to the original Python output in `output/result.json`.
