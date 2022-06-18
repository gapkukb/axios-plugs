import { AxiosPlus, filter, loading, setId, convert, adapter, retry } from ".";

const axios = new AxiosPlus({
	timeout: 10,
	retryLimit: 3,
	loading: true,
});

// axios.register(retry, {
//     reqIndex:0,
//     resIndex:0
// });
// axios.register(loading, {
// 	open() {
// 		console.log("open");
// 	},
// 	close() {
// 		console.log("close");
// 	},
// });
// axios.register(convert);
// axios.register(filter);
// axios.register(setId);
// axios.register(adapter);

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
).catch((e) => {
	console.log("failed");
});
