import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus from "../core";
import { noop } from "./utils";

let loadingCount = 0;
export default function loading(
	axios: AxiosPlus,
	toggle: {
		open: typeof noop;
		close: typeof noop;
	}
) {
	const option = {
		runWhen(config: AxiosRequestConfig) {
			return config.__retried === undefined;
		},
	};

	axios.interceptors.request.use(
		function loadingOpen(config) {
			if (config.loading && !loadingCount++) {
				toggle.open();
			}
			return config;
		},
		undefined,
		option
	);

	function loadingClose(result: AxiosResponse | AxiosError) {
		const c = result.config;
		const retrying = c.__retried !== undefined && c.__retried !== c.retryLimit;

		if (c.loading && !retrying && !--loadingCount) {
			toggle.close();
		}
		return Promise["code" in result ? "reject" : "resolve"](result);
	}

	axios.interceptors.response.use(loadingClose, loadingClose);
}
