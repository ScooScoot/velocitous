declare module "velocitous" {
	/// <reference types="node" />
	import { IncomingMessage, Server, ServerResponse } from "http";
	import * as http from "http";
	import * as url from "url";
	interface VelocitousInfo {
		url: url.UrlWithStringQuery;
		headers: http.IncomingHttpHeaders;
		method: string;
		path: string;
		req: IncomingMessage;
		res: ServerResponse;
		ip: string;
	}
	interface VelocitousPassthroughInfo {
		url: url.UrlWithStringQuery;
		headers: http.IncomingHttpHeaders;
		method: string;
	}
	class VelocitousServer {
		httpServer: Server;
		endpoints: any[];
		constructor(config: { port: any; rootFolder: any; rewriteIndex: any });
		endpoint(
			checker: (info: VelocitousInfo) => any,
			actor: (req: IncomingMessage, res: ServerResponse) => any
		): VelocitousServer;
		passthrough(
			checker: (info: VelocitousInfo) => any,
			target: (info: VelocitousPassthroughInfo) => any
		): VelocitousServer;
	}
	export default VelocitousServer;
}
