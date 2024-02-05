import axios, { AxiosAdapter, AxiosRequestConfig } from "axios";
export function noop(): any {}

// function imul(h1: number, h2: number) {
// 	return Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
// }

// export function hashCode(str: string, seed = 0) {
// 	let h1 = 0xdeadbeef ^ seed,
// 		h2 = 0x41c6ce57 ^ seed;
// 	for (let i = 0, ch; i < str.length; i++) {
// 		ch = str.charCodeAt(i);
// 		h1 = Math.imul(h1 ^ ch, 2654435761);
// 		h2 = Math.imul(h2 ^ ch, 1597334677);
// 	}
// 	h1 = imul(h1, h2);
// 	h2 = imul(h2, h1);
// 	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
// }

export function hashCode(str: string) {
	let hash = 0,
		i,
		chr,
		l = str.length;

	if (l === 0) return hash;
	for (i = 0; i < l; i++) {
		chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

const has = Object.prototype.hasOwnProperty;
/** 用于将对象排序后再序列化，避免对象的无序化*/
export function serialize(obj: Object = {}, prefix?: string) {
	const pairs: string[] = [];
	Object.keys(obj)
		.sort()
		.forEach((key: any) => {
			if (!has.call(obj, key)) return;
			//@ts-ignore
			const value = obj[key];
			const enkey = encodeURIComponent(key);
			const fullKey = prefix ? prefix + "[" + enkey + "]" : enkey;
			let pair: any;
			if (typeof value === "object") {
				pair = serialize(value, fullKey);
			} else {
				pair = fullKey + "=" + encodeURIComponent(value);
			}
			pairs.push(pair);
		});
	return pairs.join("&");
}

export function setId(config: AxiosRequestConfig) {
	//@ts-ignore
	config.__id__ ||= getId(config);
	return config;
}

export function getId(config: AxiosRequestConfig) {
	if (config.__id__) return config.__id__;
	let s = config.method + config.url!;
	if (config.strictMode) {
		s += serialize(config.params);
		s += serialize(config.data);
	}
	return hashCode(s);
}

export function functionalAdapter(adapter: any): AxiosAdapter {
	return typeof adapter === "function" ? adapter : axios.getAdapter(axios.defaults.adapter);
}
