import { stringify } from "qs";
import AxiosPlus, { RequestConfig } from "../core";
import { getHash } from "./utils";

const compare = { sort: (a: string, b: string) => a.localeCompare(b) };
export default function setId(axios: AxiosPlus) {
	axios.interceptors.request.use(function $setId(config: RequestConfig) {
		console.log("setId");
		const s1 = stringify(config.params, compare);
		const s2 = stringify(config.data, compare);
		const s3 = config.method! + config.url! + s1 + s2;
		config.__id = getHash(s3);
		return config;
	});
}
