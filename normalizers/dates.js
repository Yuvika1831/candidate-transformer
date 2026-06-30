/**
 * Normalize dates into YYYY-MM-DD format.
 * Mirrors normalizers/dates.py
 */

const MONTHS_SHORT = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec"
];

const MONTHS_LONG = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

function tryParse(dateValue) {
  // %d-%m-%Y
  let m = dateValue.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return { fmt: "dmy", year: y, month: pad(mo), day: pad(d) };
  }

  // %d/%m/%Y
  m = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return { fmt: "dmy", year: y, month: pad(mo), day: pad(d) };
  }

  // %Y-%m-%d
  m = dateValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return { fmt: "dmy", year: y, month: pad(mo), day: pad(d) };
  }

  // %d %b %Y  or  %d %B %Y
  m = dateValue.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const [, d, monStr, y] = m;
    const monLower = monStr.toLowerCase();
    let idx = MONTHS_SHORT.indexOf(monLower);
    if (idx === -1) idx = MONTHS_LONG.indexOf(monLower);
    if (idx !== -1) {
      return { fmt: "dmy", year: y, month: pad(idx + 1), day: pad(d) };
    }
  }

  // %b %Y or %B %Y
  m = dateValue.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const [, monStr, y] = m;
    const monLower = monStr.toLowerCase();
    let idx = MONTHS_SHORT.indexOf(monLower);
    if (idx === -1) idx = MONTHS_LONG.indexOf(monLower);
    if (idx !== -1) {
      return { fmt: "my", year: y, month: pad(idx + 1) };
    }
  }

  // %Y
  m = dateValue.match(/^(\d{4})$/);
  if (m) {
    return { fmt: "y", year: m[1] };
  }

  return null;
}

class DateNormalizer {
  static normalize(dateValue) {
    if (dateValue === null || dateValue === undefined) {
      return null;
    }

    dateValue = String(dateValue).trim();

    const parsed = tryParse(dateValue);

    if (parsed) {
      if (parsed.fmt === "y") return parsed.year;
      if (parsed.fmt === "my") return `${parsed.year}-${parsed.month}`;
      return `${parsed.year}-${parsed.month}-${parsed.day}`;
    }

    return dateValue;
  }

  static normalizeList(dateList) {
    const result = [];

    for (const item of dateList) {
      const normalized = DateNormalizer.normalize(item);

      if (!result.includes(normalized)) {
        result.push(normalized);
      }
    }

    return result;
  }
}

module.exports = { DateNormalizer };
