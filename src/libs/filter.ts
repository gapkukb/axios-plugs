import { Axios } from "axios";

type Filter = typeof $filter;

const invalidValues = [null, undefined, "", NaN, Infinity, -Infinity];

function $filter(value: any) {
	return !invalidValues.includes(value);
}

function filters(entries: any, f: Filter) {
	if (!entries || typeof entries !== "object") return entries;
	Object.keys(entries).forEach((key) => {
		if (f(entries[key])) {
			delete entries[key];
		}
	});
	return entries;
}

export default function filter(axios: Axios, filtration = $filter) {
	axios.interceptors.request.use(function (config) {
		config.params = filters(config.params, filtration);
		config.data = filters(config.data, filtration);
		return config;
	});
}
