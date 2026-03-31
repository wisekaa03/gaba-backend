import z from 'zod';

export const uuidSchema = z.uuid();

export const toNumberOrUndefined = (v: unknown) => {
  if (v === undefined || v === null) {
    return undefined;
  }
  if (typeof v === 'string') {
    const s = v.trim();
    if (s === '') {
      return undefined;
    }
    return Number(s);
  }
  return Number(v);
};
