import axios, { AxiosInterceptorManager } from "axios";
import { RetryOptions } from "../src/lib/retry";
import { noop } from "../src/lib/utils";
declare module "axios/*";
declare module "axios" {
	export interface AxiosRequestConfig extends RetryOptions {
		cancelable?: boolean;
		repeatable?: boolean;
		loading?: boolean;
		__id?: number;
		__abort?: typeof noop;
		cache?: boolean;
		dataType?: "jsonp" | "script" | "json" | "form" | "formData";
		jsonpCallback?: string;
		poillingInterval?:number;
		poillingInterval?:number;
		retokenShould?(err: AxiosError): boolean;
	}

	export interface AxiosInterceptorOptions {
		index: number;
	}
}

declare global {
	export type Path = "/purchase/[shopid]/[itemid]/args/[...args]";
	export type Parts<S extends string> = S extends `${any}[${infer A}]${infer B}` ? A | Parts<B> : never;
	type ParamValue<K> = K extends `...${string}` ? string[] : string;
	type RemoveDots<S extends string> = K extends `...${infer Sub}` ? Sub : S;
	export type Params<P extends string> = { [K in P]: ParamValue<K> };

	type c = ParamValue<"...args">;
	type a = Parts<"[shopid]/[itemid]/abc/[...args]">;
	type b = Params<a>;
	type d = RemoveDots<a>;
}
