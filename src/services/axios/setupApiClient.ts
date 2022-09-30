import { parseCookies, setCookie } from "nookies";
import axios, { AxiosError, AxiosResponse } from "axios";
import { isBrowser } from "../../utils/isBrowser";
import { signOut } from "../../utils/signOut";

interface ResponseInperceptorType {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedRequestQueue: ResponseInperceptorType[] = [];

export function setupApiClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${cookies["PomoTask.token"]}`;

  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response.status == 401) {
        if (error.response.message == "Invalid token!") {
          cookies = parseCookies(ctx);
          const { "PomoTask.refreshToken": refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;
            api
              .post("/refresh-token", {
                refreshToken,
              })
              .then((response) => {
                const { token, refresh_token: refreshToken } = response.data;

                setCookie(ctx, "PomoTask.token", token);
                setCookie(ctx, "PomoTask.refreshToken", refreshToken);

                api.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;

                failedRequestQueue.forEach((request) => request.resolve(token));
              })
              .catch((error) => {
                failedRequestQueue.forEach((request) => request.reject(error));
                failedRequestQueue = [];

                if (isBrowser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }
          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              resolve: (token: string) => {
                originalConfig.headers["Authorization"] = `Bearer ${token}`;
                resolve(api(originalConfig));
              },
              reject: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        }
      } else {
        if (isBrowser) {
          signOut();
        } else {
          return Promise.reject(new Error());
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
