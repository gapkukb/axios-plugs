import { Axios, AxiosRequestConfig } from "axios";
import { functionalAdapter } from "../utils";

export default function loading(
	instance: Axios,
	option: {
		default?: boolean;
		delay?: number;
		toggle(showing: boolean, config: AxiosRequestConfig): void;
	}
) {
	let counter = 0;
	let timer = 0;
	const adapter = functionalAdapter(instance.defaults.adapter);

	const toggle: (typeof option)["toggle"] = (showing, config) => {
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			option.toggle(showing, config);
		}, option.delay ?? 200);
	};

	instance.defaults.adapter = function (config) {
		const enable = config.loading !== false;
		if (enable && counter++ === 0) {
			toggle(true, config);
		}
		return adapter(config).finally(() => {
			if (enable && --counter === 0) {
				toggle(false, config);
			}
		});
	};
}
