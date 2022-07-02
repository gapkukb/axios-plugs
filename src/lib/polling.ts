import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosPlus, { PluginOptions } from "../core";
import { noop } from "./utils";

let loadingCount = 0;
export default function polling(
	axios: AxiosPlus,
	option: PluginOptions<{
		open: typeof noop;
		close: typeof noop;
	}>
) {
	axios.constructor.prototype.polling = function(){
        
    }
}
