// @author mirailisc
// @ts-ignore
import { IGetResponse } from "../generated/interface.js";

import Nomad from "./client.js";

const client = new Nomad({
  baseUrl: "https://acd18a62-3914-4089-8a2c-53fe676ee3be.mock.pstmn.io",
});

const res = await client.get<IGetResponse[]>("/users");

console.log(res[0].username);
