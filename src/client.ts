import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { scrapeObjectProperty } from "./scrape.js";
import { generateInterface } from "./interface.js";

interface HttpOptions extends AxiosRequestConfig {
  baseUrl: string;
}

type ResponseType = Record<string, unknown>;
interface ReturnResponseType<T> extends AxiosResponse<any, any> {
  data: T;
}

export default class Nomad {
  private resRecord: ResponseType = {};

  constructor(private options: HttpOptions) {}

  public getBaseUrl(): string {
    return this.options.baseUrl;
  }

  public async get<T>(path?: string): Promise<ReturnResponseType<T>> {
    const res = await this.instance().get(path ?? "");

    try {
      this.scrapeTypeFromObject(res.data);
      generateInterface(this.resRecord, `IGetResponse`);
    } catch (err) {
      console.error(err);
    }

    return {
      ...res,
      data: res.data as T,
    };
  }

  private instance(): AxiosInstance {
    return axios.create({
      baseURL: this.options.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private scrapeTypeFromObject(obj: any) {
    const scraped = this.getScrapedData(obj);

    if (scraped && obj.length === 0) {
      scraped.forEach((name: any) => {
        this.resRecord[name] = typeof obj[name];
      });
    } else if (scraped && obj.length !== 0) {
      scraped.forEach((name: any) => {
        this.resRecord[name] = typeof obj[0][name];
      });
    }

    generateInterface(this.resRecord, `IGetResponse`);
  }

  private getScrapedData(data: any) {
    return JSON.stringify(data).length !== 0
      ? scrapeObjectProperty(data[0])
      : scrapeObjectProperty(data);
  }
}
