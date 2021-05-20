import * as http from "http";
import * as path from "path";

import Resource from "./helpers/Resource";
import Endpoint from "./helpers/Endpoint";
import EndpointInfo from "./types/EndpointInfo";
import VelocitousConfig from "./types/VelocitousConfig";
import Mimes from "./resources/Mimes";

class VelocitousServer {
	public config;
	public endpoints: Endpoint[] = [];
	private server: http.Server;
	private listener = async (
		req: http.IncomingMessage,
		res: http.ServerResponse
	) => {
		let requestUrl = new URL(`http://${req.headers.host}${req.url}`);
		let endpointRun = false;
		this.endpoints.forEach((endpoint: Endpoint) => {
			if (
				endpoint.check({
					url: requestUrl,
					headers: req.headers,
					method: req.method,
					req: req,
					res: res,
					ip: req.connection.remoteAddress,
				})
			) {
				endpoint.operate(req, res);
				endpointRun = true;
			}
		});
		if (endpointRun) {
			return;
		}
		let resource = new Resource(
			requestUrl.pathname,
			path.join(process.cwd(), this.config.rootFolder),
			this.config.rewriteIndex
		);
		if (!resource.exists) {
			res.writeHead(404);
			res.end();
			return;
		}

		let ext =
			"." + resource.path.split(".")[resource.path.split(".").length - 1];
		let mimeType = Mimes[ext];

		let headers = {
			"content-length": resource.stats.size,
		};
		if (mimeType) {
			headers["content-type"] = mimeType;
		}

		res.writeHead(200, headers);
		resource.read().pipe(res);
	};
	constructor(config: VelocitousConfig) {
		this.config = config;
		if (config.rewriteIndex === undefined) {
			config.rewriteIndex = "index.html";
		}
		this.server = http.createServer(
			(req: http.IncomingMessage, res: http.ServerResponse) => {
				this.listener(req, res);
			}
		);
		this.server.listen(this.config.port);
	}
	endpoint(
		listener: (endpointInfo: EndpointInfo) => boolean,
		operator: (req: http.IncomingMessage, res: http.ServerResponse) => any
	) {
		this.endpoints.push(new Endpoint(listener, operator));
	}
}

export default VelocitousServer;
module.exports = {
	default: VelocitousServer,
};
