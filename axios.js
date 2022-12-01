import axios from "axios";

const GET_TOKEN_URL = "/auth/getToken";
const REVOKE_TOKEN_URL = "/auth/revokeToken";

export const instance = axios.create({
  baseURL: "https://api.moyklass.com/v1/company",
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

export async function setToken() {
  const token = await instance.post(
    GET_TOKEN_URL,
    JSON.stringify({ apiKey: process.env.MOY_KLASS_API_KEY })
  );

  instance.defaults.headers.common["x-access-token"] = token.data.accessToken;
}

export async function revokeToken() {
  await instance.post(REVOKE_TOKEN_URL);
}
