const scrapeDoubleQuote = /['"]+/g;
const scrapeColon = /:$/;

export function scrapeObjectProperty(obj: any): string[] | undefined {
  const result = JSON.stringify(obj)
    .match(/("?)(\b\w+\b)\1:/gm)
    ?.map((data: string) =>
      data.replace(scrapeDoubleQuote, "").replace(scrapeColon, "")
    );

  return result;
}
