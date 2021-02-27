"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var mimes = require("./mimes");
function check_exists(path) {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs.existsSync(path)) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs.promises.stat(path)];
                    case 1:
                        if ((_a.sent()).isDirectory()) {
                            resolve("directory");
                            return [2 /*return*/];
                        }
                        resolve("file");
                        return [2 /*return*/];
                    case 2:
                        resolve(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
}
function get_mime(path) {
    var ext = "." + path.split(".")[path.split(".").length - 1];
    return mimes[ext];
}
function handle_file(requested_path, rewriteIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var requested_type, index_path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, check_exists(requested_path)];
                case 1:
                    requested_type = _a.sent();
                    if (requested_type === "directory") {
                        if (rewriteIndex) {
                            index_path = path.join(requested_path, "index.html");
                            return [2 /*return*/, handle_file(index_path, rewriteIndex)];
                        }
                    }
                    else if (requested_type === "file") {
                        return [2 /*return*/, requested_path];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function check_endpoints(info, endpoints) {
    for (var i = 0; i < endpoints.length; i++) {
        if (endpoints[i].checker(info)) {
            endpoints[i].actor(info.req, info.res);
            return true;
        }
    }
    return false;
}
var VelocitousServer = /** @class */ (function () {
    function VelocitousServer(config) {
        var _this = this;
        this.endpoints = [];
        var port = config.port, rootFolder = config.rootFolder, rewriteIndex = config.rewriteIndex;
        if (rewriteIndex !== false) {
            rewriteIndex = true;
        }
        this.httpServer = http.createServer(function (req, res) {
            (function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var requested_url, requested_path, file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requested_url = url.parse("http://" + req.headers.host + req.url);
                            requested_path = path.join(process.cwd(), rootFolder, requested_url.path);
                            if (check_endpoints({
                                url: requested_url,
                                headers: req.headers,
                                method: req.method,
                                path: requested_path,
                                req: req,
                                res: res,
                                ip: req.connection.remoteAddress
                            }, this.endpoints))
                                return [2 /*return*/];
                            return [4 /*yield*/, handle_file(requested_path, rewriteIndex)];
                        case 1:
                            file = _a.sent();
                            if (file) {
                                res.writeHead(200, {
                                    "content-length": fs.statSync(file).size,
                                    "content-type": get_mime(file)
                                });
                                fs.createReadStream(file).pipe(res);
                            }
                            else {
                                res.writeHead(404);
                                res.end();
                            }
                            return [2 /*return*/];
                    }
                });
            }); })(req, res)["catch"](function (e) {
                res.writeHead(500);
                res.end();
            });
        });
        this.httpServer.listen(port);
        return this;
    }
    VelocitousServer.prototype.endpoint = function (checker, actor) {
        this.endpoints.push({
            checker: checker,
            actor: actor
        });
        return this;
    };
    VelocitousServer.prototype.passthrough = function (checker, target) {
        this.endpoint(checker, function (req, res) {
            http.get(target, function (response) {
                response.pipe(res);
            });
        });
    };
    return VelocitousServer;
}());
module.exports = VelocitousServer;
