/// <reference types="node" />
import { IncomingMessage, Server, ServerResponse } from "http";
import * as http from "http";
import * as url from "url";
declare interface VelocitousInfo {
    url: url.UrlWithStringQuery;
    headers: http.IncomingHttpHeaders;
    method: string;
    path: string;
    req: IncomingMessage;
    res: ServerResponse;
    ip: string;
}
declare interface VelocitousPassthroughInfo {
    url: url.UrlWithStringQuery;
    headers: http.IncomingHttpHeaders;
    method: string;
}
declare class VelocitousServer {
    httpServer: Server;
    endpoints: any[];
    constructor(config: {
        port: any;
        rootFolder: any;
        rewriteIndex: any;
    });
    endpoint(checker: (info: VelocitousInfo) => any, actor: (req: IncomingMessage, res: ServerResponse) => any): VelocitousServer;
    passthrough(checker: (info: VelocitousInfo) => any, target: (info: VelocitousPassthroughInfo) => any): VelocitousServer;
}
export default VelocitousServer;
