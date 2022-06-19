import { stringify } from "qs";
import AxiosPlus, { PluginOptions } from "../core";
import { getHash } from "./utils";

const compare = { sort: (a: string, b: string) => a.localeCompare(b) };
export default function setId(axios: AxiosPlus, option: PluginOptions) {
	axios.interceptors.request.use(
		function $setId(config) {
			console.log("setId");
			const s1 = stringify(config.params, compare);
			const s2 = stringify(config.data, compare);
			const s3 = config.method! + config.url! + s1 + s2;
			config.__id = getHash(s3);
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return config.__id === undefined;
			},
			index: option.reqIndex,
		}
	);
}
