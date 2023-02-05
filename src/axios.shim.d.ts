import {} from "axios";

declare module "axios" {
	export interface AxiosStatic {
		mergeConfig(a?: any, b?: any): any;
	}
}
