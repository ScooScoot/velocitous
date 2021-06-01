import * as http from "http";
import * as path from "path";

import Resource from "./helpers/Resource";
import Endpoint from "./helpers/Endpoint";
import EndpointInfo from "./types/EndpointInfo";
import VelocitousConfig from "./types/VelocitousConfig";
import Config from "./helpers/Config";

export class VelocitousServer {
	public config: Config;
	public endpoints: Endpoint[] = [];
	private server: http.Server;
	private listener = async (
		req: http.IncomingMessage,
		res: http.ServerResponse
	) => {
		let requestUrl = new URL(`http://${req.headers.host}${req.url}`);

		for (let endpoint of this.endpoints) {
			if (endpoint.check(req, res, requestUrl)) {
				endpoint.operate(req, res);
				return;
			}
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

		let headers = {
			"content-length": resource.stats.size,
		};
		if (resource.mime) {
			headers["content-type"] = resource.mime;
		}

		res.writeHead(200, headers);
		resource.read().pipe(res);
	};
	constructor(config: VelocitousConfig) {
		this.config = new Config(config);
		this.server = http.createServer(
			(req: http.IncomingMessage, res: http.ServerResponse) => {
				this.listener(req, res).catch((e) => {
					res.writeHead(500);
					res.end();
					throw e;
				});
			}
		);
		this.server.listen(this.config.port, this.config.bindAddress);
	}

	endpoint(
		listener: (endpointInfo: EndpointInfo) => boolean,
		operator: (req: http.IncomingMessage, res: http.ServerResponse) => any
	): VelocitousServer {
		this.endpoints.push(new Endpoint(listener, operator));
		return this;
	}
}
