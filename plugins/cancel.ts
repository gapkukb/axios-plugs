import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { cancelers, URLMD5 } from "./utils";

export function useCancel(http: AxiosInstance = axios) {
	function handler(result: AxiosResponse | AxiosError) {
		const MD5 = result.config.__MD5;
		if (MD5) delete cancelers[MD5!];
		return result;
	}
	http.defaults.allowRepeat = true;
	http.interceptors.request.use((c: AxiosRequestConfig) => {
		const s = (c.__MD5 = URLMD5(c));
		const f = cancelers[s];
		// cancelToken存在值则意味着请求pedding中
		c.cancelToken && !c.allowRepeat && f && f();
		c.cancelToken = new axios.CancelToken((cancel) => {
			cancelers[s] = cancel;
		});
		return c;
	});
	http.interceptors.response.use(handler, handler);
	return http;
}

export function aborter(c: AxiosRequestConfig) {
	return function () {
		const k = URLMD5(c);
		cancelers[k]?.();
		delete cancelers[k];
	};
}

export function abort(...excludes: any[]) {
	const iterator = Object.values(cancelers);
	for (const abort of iterator) {
		!excludes.includes(abort) && abort();
	}
}
