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
				return !!config.loading && config.__retried === undefined;
			},
			index: option.reqIndex,
		}
	);

	function loadingClose(result: AxiosResponse | AxiosError) {
		const c = AxiosPlus.getConfig(result);
		const retrying = c.__retried !== undefined && c.__retried !== c.retryLimit;
		if (c.loading && !retrying && !--loadingCount) {
			option.close();
		}
		return AxiosPlus.unifyReturn(result);
	}

	axios.interceptors.response.use(loadingClose, loadingClose, { index: option.resIndex });
}
