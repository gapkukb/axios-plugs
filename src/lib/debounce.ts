import axios, { Axios, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";

const store: Record<number, Function> = {};

/** 请求防抖，取消掉上次未完成的请求，与throttle互斥 */
export default function debounce(axios: AxiosPlus, option: PluginOptions) {
	axios.interceptors.request.use(
		function debounceRequest(config) {
			console.log("cancel request");

			// store[config.__id!]?.(config);
			// store[config.__id!] = config.__abort!;
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return !!config.cancelable && !config.repeatable && config.__retried === undefined;
			},
			index: option.reqIndex,
		}
	);

	function debounceResponse(result: AxiosResponse | AxiosError) {
		const c = AxiosPlus.getConfig(result);
		const retrying = c.__retried !== undefined && c.__retried !== c.retryLimit;
		if (!!c.cancelable && !c.repeatable && !retrying) {
			delete store[c.__id!];
		}
		return AxiosPlus.unifyReturn(result);
	}

	axios.interceptors.response.use(debounceResponse, debounceResponse, { index: option.resIndex });
	return axios;
}
