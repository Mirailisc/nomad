import Nomad from "./client.js";

const client = new Nomad({
  baseUrl: "https://acd18a62-3914-4089-8a2c-53fe676ee3be.mock.pstmn.io/users",
});

const res = await client.get();