import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { scrapeObjectProperty } from "./scrape.js";
import { z } from "zod";
import fs from "fs";

interface HttpOptions extends AxiosRequestConfig {
  baseUrl: string;
}

const zResObjRecord = z.record(z.string(), z.unknown());
type ZResRecord = z.infer<typeof zResObjRecord>;

function generateInterface(obj: any, interfaceName: string): string {
  let result = `export interface ${interfaceName} {\n`;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += `    ${key}: ${obj[key]};\n`;
    }
  }

  result += `}\n`;

  fs.writeFile("generated/interface.ts", result, function (err: any) {
    if (err) {
      return console.log(err);
    }
  });

  return result;
}

export default class Nomad {
  private resRecord: ZResRecord = {};

  constructor(private options: HttpOptions) {}

  getBaseUrl(): string | undefined {
    return this.options.baseUrl;
  }

  private instance(): AxiosInstance {
    return axios.create({
      baseURL: this.options.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(path?: string): Promise<T> {
    const { data } = await this.instance().get(path ?? "");
    const scraped = this.getScrapedData(data);

    if (scraped && data.length === 0) {
      scraped.forEach((name: any) => {
        this.resRecord[name] = typeof data[name];
      });
    } else if (scraped && data.length !== 0) {
      scraped.forEach((name: any) => {
        this.resRecord[name] = typeof data[0][name];
      });
    }

    const parsedSchema = await zResObjRecord.parseAsync(this.resRecord);

    generateInterface(parsedSchema, `IGetResponse`);

    return data as T;
  }

  getScrapedData(data: any) {
    return JSON.stringify(data).length !== 0
      ? scrapeObjectProperty(data[0])
      : scrapeObjectProperty(data);
  }
}
