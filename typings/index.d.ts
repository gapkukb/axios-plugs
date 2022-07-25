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
		poillingInterval?: number;
		poillingInterval?: number;
		retokenShould?(err: AxiosError): boolean;
	}

	export interface AxiosInterceptorOptions {
		index: number;
	}
}

declare global {
	type A = "{aaa}/{bbbb}/cccc/{dddd}";
	type B = "[aaa]/[bbbb]/cccc/[dddd]";
	type C = ":aaa/:bbbb/cccc/:dddd";

	type Parts<T extends string, P extends string, N extends string> = T extends `${any}${P}${infer A}${N}${infer B}` ? A | Parts<B, P, N> : never

	type PathVariablesColon<T extends string> = T extends `${any}:${infer A}/${infer B}` ? A | PathVariablesColon<B> : T extends `${any}:${infer A}` ? A : never
	type PathVariablesSquare<T extends string> = Parts<T, "[", "]">
	type PathVariablesCurly<T extends string> = Parts<T, "{", "}">

	type a = PathVariablesCurly<A>
	type b = PathVariablesSquare<B>
	type c = PathVariablesColon<C>


	type D = {
		a: string,
		b: {
			c: number,
			d: {
				e: boolean,
				f: D
			}
		}
	}

	type PickValueByPath<T, K extends string> = K extends keyof T
		? Pick<T, K>[K]
		: K extends `${infer L}.${infer R}`
		? {
			[P in L]: P extends keyof T ? GetValue<T[P], R> : never
		}[L]
		: never

	type PickValue<T, K extends string> = K extends keyof T
		? Pick<T, K>
		: K extends `${infer L}.${infer R}`
		? {
			[P in L]: P extends keyof T ? GetValue<T[P], R> : unknown
		}
		: unknown

	
	type a = PickValueByPath<D,"b.d">
	type b = PickValue<D,"d">

	
}
