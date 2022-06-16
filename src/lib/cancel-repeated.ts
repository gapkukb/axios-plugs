import axios, { Axios, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus from "../core";
import { noop } from "./utils";

const store: Record<number, typeof noop> = {};

export default function cancelRepeated(axios: AxiosPlus) {
	axios.interceptors.request.use(
		function cancelRepeatedRequest(config) {
			store[config.__id!]?.();
			store[config.__id!] = config.__abort;
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return !!config.cancelable && !config.repeatable && config.__retried === undefined;
			},
		}
	);

	function unmark(result: AxiosResponse | AxiosError) {
		const c = result.config;
		const retrying = c.__retried !== undefined && c.__retried !== c.retryLimit;
		if (!!c.cancelable && !c.repeatable && !retrying) {
			delete store[result.config.__id!];
		}
		return Promise["code" in result ? "reject" : "resolve"](result);
	}

	axios.interceptors.response.use(unmark, unmark);
	return axios;
}
