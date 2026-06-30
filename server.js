const express = require("express");
const path = require("path");
const { buildProfile, saveOutput } = require("./main");

const app = express();
app.use(express.json());

/**
 * GET /api/profile
 * Runs the exact same pipeline as the Python CLI (main.py):
 * read ATS + resume input files -> merge -> project config fields -> validate.
 * Returns the merged profile, or validation errors with HTTP 422.
 */
app.get("/api/profile", (req, res) => {
  try {
    const { merged, errors } = buildProfile();

    if (errors.length > 0) {
      return res.status(422).json({
        status: "Validation Failed",
        errors
      });
    }

    return res.status(200).json(merged);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profile/save
 * Same as GET /api/profile, but also writes output/result.json,
 * mirroring main.py's save_output() + final console output.
 */
app.post("/api/profile/save", (req, res) => {
  try {
    const { merged, errors } = buildProfile();

    if (errors.length > 0) {
      return res.status(422).json({
        status: "Validation Failed",
        errors
      });
    }

    saveOutput(merged);

    return res.status(200).json({
      status: "Assignment Completed Successfully.",
      output_file: "output/result.json",
      profile: merged
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
