//@ts-nocheck
import axios from "axios";
import { cancel } from "./plugins/cancel";
import { get } from "./plugins/http";
import { retry } from "./plugins/retry";
// axios.prototype.plugins = function (plugins: any[]) {
// 	plugins.forEach((plugin) => this);
// };
// axios.plugins = function (plugins: any[]) {
// 	plugins.forEach((plugin) => this);
// };

const a = axios.create();
a.plugins();
