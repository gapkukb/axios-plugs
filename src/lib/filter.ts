import AxiosPlus, { PluginOptions } from "../core";

type Filter = typeof $filter;

function $filter(value: any) {
	return !value && value !== 0 && value !== false;
}

function forEach(entries: any, f: Filter) {
	if (!entries || typeof entries !== "object") return entries;
	Object.keys(entries).forEach((key) => {
		if (f(entries[key])) {
			delete entries[key];
		}
	});
	return entries;
}

export default function filter(
	axios: AxiosPlus,
	option: PluginOptions<{
		filter?: Filter;
	}>
) {
	const filter = option.filter || $filter;
	axios.interceptors.request.use(
		function (config) {
			console.log("filter");
			config.params = forEach(config.params, filter);
			config.data = forEach(config.data, filter);
			return config;
		},
		undefined,
		{
			runWhen(config) {
				return config.__retried === undefined;
			},
			index: option.reqIndex,
		}
	);
}
