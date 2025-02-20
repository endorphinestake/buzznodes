export const formatShortText = (text: string) => {
  if (text.length <= 5) {
    return text;
  } else if (text.length > 5 && text.length <= 10) {
    return `${text.slice(0, 5)}...${text.slice(5)}`;
  } else {
    return `${text.slice(0, 5)}...${text.slice(-5)}`;
  }
};

export const trimFields = (obj: any) => {
  const result: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      result[key] = obj[key].trim();
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = trimFields(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};

export const isASCII = (str: string) => /^[\x00-\x7F]*$/.test(str);

export const isIPV4 = (str: string) =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    str
  );

export const getGSM7Length = (text: string): number => {
  let length = 0;
  const extendedGsm7 = new Set(["^", "{", "}", "\\", "[", "~", "]", "|", "€"]);

  for (const char of text) {
    if (extendedGsm7.has(char)) {
      length += 2;
    } else {
      length += 1;
    }
  }

  return length;
};

export const formatPingTime = (seconds: number): string => {
  if (seconds < 3) {
    return "Right now";
  }

  if (seconds < 60) {
    const thresholds: Array<[number, string]> = [
      [3, "3 Seconds ago"],
      [6, "6 Seconds ago"],
      [9, "9 Seconds ago"],
      [15, "15 Seconds ago"],
      [30, "30 Seconds ago"],
    ];
    for (const [limit, text] of thresholds) {
      if (seconds <= limit) {
        return text;
      }
    }
    return "30 Seconds ago";
  }

  if (seconds < 300) {
    return "more 1 minutes ago"; // [60, 300)
  }
  if (seconds < 600) {
    return "more 5 minutes ago"; // [300, 600)
  }
  if (seconds < 900) {
    return "more 10 minutes ago"; // [600, 900)
  }
  if (seconds < 1800) {
    return "more 15 minutes ago"; // [900, 1800)
  }
  if (seconds < 3600) {
    return "more 30 minutes ago"; // [1800, 3600)
  }
  if (seconds < 7200) {
    return "more 1 hour ago"; // [3600, 7200)
  }
  if (seconds < 10800) {
    return "more 2 hours ago"; // [7200, 10800)
  }
  if (seconds < 14400) {
    return "more 3 hours ago"; // [10800, 14400)
  }
  if (seconds < 18000) {
    return "more 4 hours ago"; // [14400, 18000)
  }
  if (seconds < 36000) {
    return "more 5 hours ago"; // [18000, 36000)
  }
  if (seconds < 54000) {
    return "more 10 hours ago"; // [36000, 54000)
  }
  if (seconds < 72000) {
    return "more 15 hours ago"; // [54000, 72000)
  }
  if (seconds < 86400) {
    return "more 20 hours ago"; // [72000, 86400)
  }

  if (seconds < 2 * 86400) {
    return "more 1 day ago";
  }

  // For days from 2 up to 100:
  for (let i = 2; i <= 100; i++) {
    if (seconds < (i + 1) * 86400) {
      return `more ${i} days ago`;
    }
  }

  return "more than 100 days ago";
};

export const getSyncStatus = (blocksBehind: number): string => {
  if (blocksBehind < 100) {
    return "Synced";
  } else if (blocksBehind < 500) {
    return "100 blocks behind";
  } else if (blocksBehind < 1000) {
    return "500 blocks behind";
  } else if (blocksBehind < 10000) {
    return "1000 blocks behind";
  } else {
    return "more than 10000 blocks behind";
  }
};
