import axios, { AxiosRequestConfig, Canceler } from "axios";

export function getHash(s: string = "") {
	let hash = 0,
		i,
		chr;
	for (i = 0; i < s.length; i++) {
		chr = s.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}
	return hash.toString();
}

export function noop(...args: any[]): any {}
