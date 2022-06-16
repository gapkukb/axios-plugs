import AxiosPlus, { RequestConfig } from "../core";
import { noop } from "./utils";

let loadingCount = 0;
export default function loading(
	axios: AxiosPlus,
	toggle: {
		open: typeof noop;
		close: typeof noop;
	}
) {
	axios.interceptors.request.use(
		function loadingOpen(config) {
			if (config.loading && !loadingCount++) {
				toggle.open();
			}
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return config.__retried !== undefined;
			},
		}
	);
	axios.interceptors.response.use(
		function loadingClose(response) {
			console.log("after-loading");

			if (this.loading && !--loadingCount) {
				toggle.close();
			}
			return response;
		},
		undefined,
		{
			runWhen(config) {
				return config.__retried !== undefined;
			},
		}
	);
}
