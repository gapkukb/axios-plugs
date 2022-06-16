import Axios from "./core";
import filter from "./plugins/filter";
import loading from "./plugins/loading";
import setId from "./plugins/setId";
import convert from "./plugins/convert";
import adpater from "./plugins/adpater";

const axios = new Axios({
	timeout: 30000,
});

axios.register(filter);
axios.register(loading, {
	default: true,
	open() {
		console.log("open");
	},
	close() {
		console.log("close");
	},
});
axios.register(setId);
axios.register(convert);
axios.register(adpater);

const { get, post, put, delete: del } = axios.createMethods("get", "post", "put", "delete");

const getBaidu = post("http://www.baidu.com", { dataType: "form" });
getBaidu(
	{
		a: 1,
	},
	{
		params: {
			c: 3,
		},
		data: {
			b: 2,
		},
	}
);
