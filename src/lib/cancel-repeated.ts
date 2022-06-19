import axios, { Axios, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";

const store: Record<number, Function> = {};

export default function cancelRepeated(axios: AxiosPlus, option: PluginOptions) {
	axios.interceptors.request.use(
		function cancelRepeatedRequest(config) {
			console.log("cancel request");

			store[config.__id!]?.(config);
			store[config.__id!] = config.__abort!;
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

	function cancelRepeatedResponse(result: AxiosResponse | AxiosError) {
		const c = AxiosPlus.isCancel(result) ? (result as any).message.__config : result.config;
		const retrying = c.__retried !== undefined && c.__retried !== c.retryLimit;
		if (!!c.cancelable && !c.repeatable && !retrying) {
			delete store[result.config.__id!];
		}
		return Promise["code" in result ? "reject" : "resolve"](result);
	}

	axios.interceptors.response.use(cancelRepeatedResponse, cancelRepeatedResponse, { index: option.resIndex });
	return axios;
}
