import axios, { AxiosRequestConfig, Canceler } from "axios";
import md5 from "md5";

function urlJoin(c: AxiosRequestConfig): string {
	return (c.method || "get") + c.url;
}

export function URLMD5(c: AxiosRequestConfig): string {
	return md5(urlJoin(c));
}

export function requestURLMD5(c: AxiosRequestConfig): [string, string] {
	const key = urlJoin(c) + JSON.stringify(c.data || c.params);
	return [URLMD5(c), md5(key)];
}

export const cancelers: Record<string, Canceler> = {};

type CacheFunc<T = void> = (c: AxiosRequestConfig, data?: any) => T;
interface Mapper {
	expries: number;
	store: Record<string, any>;
	get: CacheFunc<any>;
	set: CacheFunc;
	delete: CacheFunc;
	deleteGroup: CacheFunc;
	deleteAll(): void;
}
export const cacheMapper = {
	expries: 3600,
	store: {},
	get(c) {
		const [group, key] = requestURLMD5(c);
		return this.store[group]?.[key];
	},
	set(c, data: any) {
		const [group, key] = requestURLMD5(c);
		if (!this.store[group]) {
			this.store[group] = {};
		}
		this.store[group][key] = data;
	},
	delete(c) {
		const [group, key] = requestURLMD5(c);
		delete this.store[group][key];
	},
	deleteGroup(c) {
		const [group, key] = requestURLMD5(c);
		delete this.store[group];
	},
	deleteAll() {
		this.store = {};
	},
} as Mapper;
