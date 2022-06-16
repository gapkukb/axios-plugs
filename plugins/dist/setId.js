"use strict";
exports.__esModule = true;
var qs_1 = require("qs");
var utils_1 = require("./utils");
var compare = { sort: function (a, b) { return a.localeCompare(b); } };
function setId(axios) {
    axios.interceptors.request.use(function $setId(config) {
        console.log("setId");
        var s1 = qs_1.stringify(config.params, compare);
        var s2 = qs_1.stringify(config.data, compare);
        var s3 = config.method + config.url + s1 + s2;
        config.__id = utils_1.getHash(s3);
        return config;
    }, undefined, {
        runWhen: function (config) {
            return config.__id === undefined;
        },
        synchronous: true
    });
}
exports["default"] = setId;
