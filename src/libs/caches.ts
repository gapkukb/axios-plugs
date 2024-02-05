import { Axios, AxiosAdapter, AxiosRequestConfig } from "axios";

/*** 外部传入时，可与localstorage localforage indexdb 等技术结合 */
type Accessor = {
	get: (config: AxiosRequestConfig) => any;
	set: (config: AxiosRequestConfig, data: any) => any;
};

export default function caches(instance: Axios, accessor: Accessor) {
	const rawAdpater = instance.defaults.adapter as AxiosAdapter;

	instance.defaults.adapter = function (config) {
		const cached = accessor.get(config);

		if (cached) {
			return Promise.resolve(cached);
		}
		const promise = rawAdpater(config).then((data) => {
			accessor.set(config, data);
			return data;
		});
		return promise;
	};
}
