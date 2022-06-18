import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus from "../core";
import { noop } from "./utils";

let store: Record<number, AxiosRequestConfig> = {};
let regeting = false;
export default function retoken(
	axios: AxiosPlus,
	/**如果参数为undefined意味着请求未得到服务器响应 */
	should: (response: AxiosResponse | undefined) => boolean,
	then: () => Promise<any>
) {
	should ||= (response) => response?.status === 403;
	axios.interceptors.request.use(function loadingOpen(config) {
		if (!regeting) return config;
		store[config.__id!] = config;
	}, undefined);

	function retokenInterceptorsResponse(result: AxiosResponse | AxiosError) {
		const c = result.config;
		let flag: boolean;

		if ("code" in result) {
			flag = should(result.response);
		} else {
			flag = should(result as any);
		}

		if (flag) {
			regeting = true;
			return then()
				.then(() => {
					axios.request(result.config);
					Object.values(store).forEach(axios.request);
					store = {};
				})
				.finally(() => [(regeting = false)]);
		}

		return Promise["code" in result ? "reject" : "resolve"](result);
	}

	axios.interceptors.response.use(retokenInterceptorsResponse, retokenInterceptorsResponse);
}
