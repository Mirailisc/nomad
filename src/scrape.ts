export function scrapeObjectProperty(obj: any): any {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    return obj;
  }
  return undefined;
}
