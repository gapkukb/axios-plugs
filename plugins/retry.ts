import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { RequestConfig } from "../core";

export interface RetryOptions {
	__retried?: number;
	retryLimit?: number;
	retryDelay?: number;
	retryShould?(error: AxiosError): Boolean;
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
export default function retry(axios: AxiosPlus) {
	axios.defaults.transformRequest.push(function beforeRetry(this: RequestConfig, data) {
		if (!this.__retried) {
			this.retryLimit ??= 3;
			this.retryDelay ??= 3000;
			this.retryShould ??= (e) => e.response?.status! >= 500 || e.code === "ECONNABORTED";
		}
		return data;
	});
	axios.interceptors.response.use(
		undefined,
		(err: AxiosError) => {
			console.log("retry");
			const c: RequestConfig = err.config as any;
			//limit = falsy 不启用重试
			//limit = retried 达到次数上限
			//should=>false 不满足重试条件
			if (!c.retryLimit || c.__retried === c.retryLimit || !c.retryShould!(err)) return Promise.reject(err);
			return new Promise((resolve) => {
				setTimeout(() => {
					c.__retried ??= 0;
					c.__retried!++;
					console.log(`正在进行第${c.__retried}/${c.retryLimit}次重试`);
					resolve(axios.request(c));
				}, c.retryDelay);
			});
		},
		{
			runWhen(config: RequestConfig) {
				return config.__retried === undefined;
			},
		}
	);
	return axios;
}
