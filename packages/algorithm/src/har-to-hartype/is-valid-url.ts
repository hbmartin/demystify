/**
 * Some patterns in urls indicate that we ought ignore the request
 * E.g. GET requests to /something.json targets a static file, and returns JSON
 * But this is indistinguishable from an underlying function, so best ignore such files explicitly
 */
export const isValidUrl = (url: string): boolean => {
  const doesNotEndInJson = !url.toLowerCase().endsWith(".json");
  return doesNotEndInJson;
};
