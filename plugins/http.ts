import axios, { AxiosRequestConfig, Method } from "axios";
import { aborter } from "./cancel";

export function useHttp(method: Method, prefix: string = "", _http = axios) {
	return function <R = any, T = any>(path: string, _config: AxiosRequestConfig) {
		const ret = function (data?: T, config?: AxiosRequestConfig) {
			const m = method === "get" || method === "GET";
			return _http.request<T, R>({
				method,
				url: prefix + path,
				[m ? "params" : "data"]: data,
				..._config,
				...config,
			});
		};
		ret.abort = aborter({
			method,
			url: path,
		} as any);
		return ret;
	};
}

export const get = useHttp("get");
export const post = useHttp("post");
export const put = useHttp("put");
export const del = useHttp("delete");
