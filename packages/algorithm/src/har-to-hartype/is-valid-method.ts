const validMethods: { [k: string]: boolean } = {
  CONNECT: true,
  DELETE: true,
  GET: true,
  HEAD: true,
  OPTIONS: true,
  PATCH: true,
  POST: true,
  PUT: true,
  TRACE: true,
} as const;

export const isValidMethod = (method: string): boolean => {
  return Boolean(validMethods[method.toUpperCase()]);
};
