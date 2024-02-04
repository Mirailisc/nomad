import { scrapeObjectProperty } from "./scrape.js";
import { z } from "zod";

interface HttpOptions {
  baseUrl: string;
}

const zResponse = z.object({
  type: z.union([z.string(), z.number(), z.undefined()]),
});

const zResObjRecord = z.record(zResponse, z.string());
type ZResRecord = z.infer<typeof zResObjRecord>;

export default class Nomad {
  private resRecord: ZResRecord = {};

  constructor(private options: HttpOptions) {}

  getBaseUrl(): string | undefined {
    return this.options.baseUrl;
  }

  async get() {
    const response = await fetch(this.options.baseUrl);
    const data = await response.json();

    const scraped = this.getScrapedData(data);

    if (scraped && data.length === 0) {
      scraped.forEach((name: any) => {
        this.resRecord[name] = {
          type: typeof data[name],
        };
      });
    } else if (scraped && data.length !== 0) {
      scraped.forEach((name: any) => {
        this.resRecord[name] = {
          type: typeof data[0][name],
        };
      });
    }

    return this.resRecord;
  }

  getScrapedData(data: any) {
    return JSON.stringify(data).length !== 0
      ? scrapeObjectProperty(data[0])
      : scrapeObjectProperty(data);
  }
}
