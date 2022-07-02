import axios, { Axios, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";

export interface RetryOptions {
	__retried?: number;
	retryLimit?: number;
	retryDelay?: number;
	retryShould?(error: AxiosResponse | AxiosError): Boolean;
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

function defaultRetryShould(result: AxiosResponse | AxiosError) {
	if (AxiosPlus.isAxiosError(result)) {
		return result.code === AxiosError.ECONNABORTED || result.code === AxiosError.ETIMEDOUT || result.response?.status! >= 500;
	}
	return false;
}
export default function retry(axios: AxiosPlus, option: PluginOptions) {
	axios.interceptors.request.use(
		function beforeRetry(config) {
			config.retryDelay ??= 3000;
			config.retryShould ||= defaultRetryShould;
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return !!config.retryLimit && config.__retried === undefined;
			},
			index: option.reqIndex,
		}
	);

	function retryInterceptorsResponse(result: AxiosResponse | AxiosError) {
		console.log("retry");
		const c = AxiosPlus.getConfig(result);
		//limit = falsy 不启用重试
		//limit = retried 达到次数上限
		//should=>false 不满足重试条件
		if (!c.retryLimit || c.__retried === c.retryLimit || !c.retryShould!(result)) return AxiosPlus.unifyReturn(result);
		return new Promise(() => {
			setTimeout(() => {
				c.__retried ??= 0;
				c.__retried!++;
				console.log(`正在进行第${c.__retried}/${c.retryLimit}次重试`);
				axios.request(c);
			}, c.retryDelay);
		});
	}

	axios.interceptors.response.use(retryInterceptorsResponse, retryInterceptorsResponse, {
		index: option.resIndex,
	});
	return axios;
}
