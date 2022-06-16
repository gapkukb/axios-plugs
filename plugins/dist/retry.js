"use strict";
exports.__esModule = true;
/**
   axios错误返回值error的结构解析
   if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
    } else {
        // 发送请求时出了点问题
        console.log("Error", error.message);
    }
 */
function retry(axios) {
    axios.defaults.transformRequest.push(function beforeRetry(data) {
        var _a, _b, _c;
        if (!this.__retried) {
            (_a = this.retryLimit) !== null && _a !== void 0 ? _a : ;
            3;
            (_b = this.retryDelay) !== null && _b !== void 0 ? _b : ;
            3000;
            (_c = this.retryShould) !== null && _c !== void 0 ? _c : ;
            (function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) >= 500 || e.code === "ECONNABORTED"; });
        }
        return data;
    });
    axios.interceptors.response.use(undefined, function (err) {
        console.log("retry");
        var c = err.config;
        //limit = falsy 不启用重试
        //limit = retried 达到次数上限
        //should=>false 不满足重试条件
        if (!c.retryLimit || c.__retried === c.retryLimit || !c.retryShould(err))
            return Promise.reject(err);
        return new Promise(function (resolve) {
            setTimeout(function () {
                var _a;
                (_a = c.__retried) !== null && _a !== void 0 ? _a : ;
                0;
                c.__retried++;
                console.log("\u6B63\u5728\u8FDB\u884C\u7B2C" + c.__retried + "/" + c.retryLimit + "\u6B21\u91CD\u8BD5");
                resolve(axios.request(c));
            }, c.retryDelay);
        });
    }, {
        runWhen: function (config) {
            return config.__retried === undefined;
        }
    });
    return axios;
}
exports["default"] = retry;
