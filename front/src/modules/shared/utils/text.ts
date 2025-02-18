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
  if (seconds < 3) return "Right now";

  const thresholds = [
    { limit: 3, text: "3 Seconds ago" },
    { limit: 6, text: "6 Seconds ago" },
    { limit: 9, text: "9 Seconds ago" },
    { limit: 15, text: "15 Seconds ago" },
    { limit: 30, text: "30 Seconds ago" },
    { limit: 60, text: "more 1 minutes ago" },
    { limit: 300, text: "more 5 minutes ago" },
    { limit: 600, text: "more 10 minutes ago" },
    { limit: 900, text: "more 15 minutes ago" },
    { limit: 1800, text: "more 30 minutes ago" },
    { limit: 3600, text: "more 1 hour ago" },
    { limit: 7200, text: "more 2 hours ago" },
    { limit: 10800, text: "more 3 hours ago" },
    { limit: 14400, text: "more 4 hours ago" },
    { limit: 18000, text: "more 5 hours ago" },
    { limit: 36000, text: "more 10 hours ago" },
    { limit: 54000, text: "more 15 hours ago" },
    { limit: 72000, text: "more 20 hours ago" },
    { limit: 86400, text: "more 1 day ago" },
  ];

  for (let i = 2; i <= 100; i++) {
    thresholds.push({ limit: i * 86400, text: `more ${i} days ago` });
  }

  for (const t of thresholds) {
    if (seconds <= t.limit) return t.text;
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
