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
    if (typeof obj[key] === 'string') {
      result[key] = obj[key].trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = trimFields(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};

export const isASCII = (str: string) => /^[\x00-\x7F]*$/.test(str);

export const isIPV4 = (str: string) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str);

export const getGSM7Length = (text: string): number => {
  let length = 0;
  const extendedGsm7 = new Set(['^', '{', '}', '\\', '[', '~', ']', '|', '€']);

  for (const char of text) {
    if (extendedGsm7.has(char)) {
      length += 2;
    } else {
      length += 1;
    }
  }

  return length;
};
