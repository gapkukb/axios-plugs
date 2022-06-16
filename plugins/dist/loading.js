"use strict";
exports.__esModule = true;
var loadingCount = 0;
function loading(axios, toggle) {
    axios.interceptors.request.use(function loadingOpen(config) {
        if (config.loading && !loadingCount++) {
            toggle.open();
        }
        return config;
    }, undefined, {
        runWhen: function (config) {
            return config.__retried !== undefined;
        }
    });
    axios.interceptors.response.use(function loadingClose(response) {
        console.log("after-loading");
        if (this.loading && !--loadingCount) {
            toggle.close();
        }
        return response;
    }, undefined, {
        runWhen: function (config) {
            return config.__retried !== undefined;
        }
    });
}
exports["default"] = loading;
