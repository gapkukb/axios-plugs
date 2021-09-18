import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { cacheMapper } from "./utils";

interface cacheOptions {
	always?: boolean;
}

export const useCache = function (http: AxiosInstance = axios, options: cacheOptions = {}) {
	const always = options.always || false;

	http.interceptors.request.use((c: AxiosRequestConfig) => {
		if (!c.cache || !always) return c;
		cacheMapper.get(c);
	});
	http.interceptors.response.use((resp: AxiosResponse) => {
		if (!resp.config.cache || !always) return resp;
		cacheMapper.set(resp.config, resp.data);
		return resp;
	});
	return http;
};
