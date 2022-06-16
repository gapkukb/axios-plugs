import AxiosPlus, { RequestConfig } from "../core";
import { noop } from "./utils";

let loadingCount = 0;
export default function loading(
	axios: AxiosPlus,
	config: {
		open: typeof noop;
		close: typeof noop;
	}
) {
	axios.defaults.transformRequest.push(function open(this: RequestConfig, data) {
		if (this.loading && !loadingCount++) {
			config.open();
		}
		return data;
	});
	axios.defaults.transformResponse.unshift(function close(this: RequestConfig, response) {
		if (this.loading && !--loadingCount) {
			config.close();
		}
		return response;
	});
}
