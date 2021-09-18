import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RetryOptions {
	retryLimit: number;
	retryDelay: number;
	should(error: AxiosError): Boolean;
}
interface Plus extends AxiosRequestConfig {
	retryLimit: number;
	retryDelay: number;
	__retried: number;
	should(error: AxiosError): Boolean;
}

/**
   axios错误返回值error的结构解析
   if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
    } else {
        // 发送请求时出了点问题
        console.log("Error", error.message);
    }
 */
export const retry = function (http: AxiosInstance = axios, options?: RetryOptions) {
	let _default: RetryOptions = {
		retryLimit: 3,
		retryDelay: 3000,
		// 服务端错误才重试
		should: (error) => error.response?.status! >= 500,
	};
	Object.assign(http.defaults, _default, options);
	http.interceptors.response.use(undefined, (err: AxiosError) => {
		const c: Plus = err.config as any;
		// 判断是否配置了重试
		if (!c.retryLimit || !c.should!(err)) return Promise.reject(err);

		c.__retried = c.__retried ?? c.retryLimit;
		if (c.__retried--) {
			return new Promise((resolve) => {
				setTimeout(() => {
					console.log("retrying....");
					resolve(http.request(c));
				}, c.retryDelay);
			});
		}
		return Promise.reject(err);
	});
	return http;
};
