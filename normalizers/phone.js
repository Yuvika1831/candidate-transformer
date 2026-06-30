class PhoneNormalizer {
  /**
   * Normalize phone numbers into E.164 format.
   * Example:
   * 9876543210
   * +91 98765-43210
   * 91-9876543210
   *
   * =>
   * +919876543210
   */
  static normalize(phone) {
    if (phone === null || phone === undefined) {
      return null;
    }

    phone = String(phone);
    phone = phone.replace(/\D/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    if (phone.length === 12 && phone.startsWith("91")) {
      return "+" + phone;
    }

    return null;
  }

  static normalizeList(phoneList) {
    const result = [];

    for (const phone of phoneList) {
      const normalized = PhoneNormalizer.normalize(phone);

      if (normalized && !result.includes(normalized)) {
        result.push(normalized);
      }
    }

    return result;
  }
}

module.exports = { PhoneNormalizer };
