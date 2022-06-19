import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";
import { noop } from "./utils";

let loadingCount = 0;
export default function loading(
	axios: AxiosPlus,
	option: PluginOptions<{
		open: typeof noop;
		close: typeof noop;
	}>
) {
	axios.interceptors.request.use(
		function loadingOpen(config) {
			if (config.loading && !loadingCount++) {
				option.open();
			}
			return config;
		},
		undefined,
		{
			runWhen(config: AxiosRequestConfig) {
				return config.__retried === undefined;
			},
			index: option.reqIndex,
		}
	);

	function loadingClose(result: AxiosResponse | AxiosError) {
		console.log("----------------------------------");
		console.log(Object.keys(result));
		//@ts-ignore
		console.log(result.message);
		let c: AxiosRequestConfig;
		if (AxiosPlus.isCancel(result)) {
			if (!--loadingCount) option.close();
		} else {
			const c = result.config;
			const retrying = c.__retried !== undefined && c.__retried !== c.retryLimit;

			if (c.loading && !retrying && !--loadingCount) {
				option.close();
			}
		}
		return Promise["code" in result ? "reject" : "resolve"](result);
	}

	axios.interceptors.response.use(loadingClose, loadingClose, { index: option.resIndex });
}
