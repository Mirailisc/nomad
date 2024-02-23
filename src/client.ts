import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { generateInterface } from "./interface.js";
import { scrapeObjectProperty } from "./scrape.js";

interface HttpOptions extends AxiosRequestConfig {
  baseUrl: string;
}

type ResponseType = Record<string, unknown>;

export default class Nomad {
  private resRecord: ResponseType = {};

  constructor(private options: HttpOptions) {}

  public getBaseUrl(): string {
    return this.options.baseUrl;
  }

  private create(): AxiosInstance {
    return axios.create({
      baseURL: this.options.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async getScrapedData(data: any): Promise<any> {
    return JSON.stringify(data).length !== 0
      ? scrapeObjectProperty(data)
      : null;
  }

  public async get<T>(
    path?: string,
    name?: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const res = await this.create().get<T>(path ?? "", { ...options });

    try {
      await this.scrapeTypeFromObject(res.data, name);
    } catch (err) {
      console.error(err);
    }

    return res;
  }

  private async scrapeTypeFromObject(obj: any, interfaceName?: string) {
    const scraped = await this.getScrapedData(obj);

    if (scraped) {
      this.generateInterfaceFromObject(scraped, interfaceName);
    }
  }

  private generateInterfaceFromObject(obj: any, interfaceName?: string) {
    generateInterface(
      obj,
      interfaceName ? `I${interfaceName}` : "IGetResponse"
    );
  }
}
