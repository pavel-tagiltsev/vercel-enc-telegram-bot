import dayjs from "dayjs";
import axios from "axios";
import { reportError } from "./utils";

const API_KEY = process.env.MOY_KLASS_API_KEY;

const instance = axios.create({
  baseURL: "https://api.moyklass.com/v1/company",
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

let api = {
  token: {},
  lessons: {},
  classes: {},
  filials: {},
};

api.token.set = async () => {
  try {
    const res = await instance.post(
      "/auth/getToken",
      JSON.stringify({ apiKey: API_KEY })
    );

    instance.defaults.headers.common["x-access-token"] = res.data.accessToken;
  } catch {
    await reportError("SET_TOKEN", err);
  }
};

api.token.revoke = async () => {
  try {
    await instance.post("/auth/revokeToken");
  } catch {
    await reportError("REVOKE_TOKEN", err);
  }
};

api.lessons.get = async () => {
  try {
    const res = await instance.get("/lessons", {
      params: {
        date: ["2022-10-01", dayjs().format("YYYY-MM-DD")],
        statusId: 0,
        limit: 500,
      },
    });

    return res.data.lessons;
  } catch (err) {
    await reportError("GET_LESSONS", err);
  }
};

api.lessons.getByUserId = async (user_id) => {
  try {
    const res = await instance.get("/lessons", {
      params: {
        date: ["2022-10-01", dayjs().format("YYYY-MM-DD")],
        teacherId: user_id,
        statusId: 0,
        limit: 500,
      },
    });

    return res.data.lessons;
  } catch (err) {
    await reportError("GET_LESSONS", err);
  }
};

api.classes.get = async () => {
  try {
    const res = await instance.get("/classes");

    return res.data;
  } catch (err) {
    await reportError("GET_CLASSES", err);
  }
};

api.filials.get = async () => {
  try {
    const res = await instance.get("/filials");

    return res.data;
  } catch (err) {
    await reportError("GET_FILIALS", err);
  }
};

export default api;
