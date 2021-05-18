import { IncomingMessage, Server, ServerResponse } from "http";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
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

const mimes: { [key: string]: string } = require("./mimes");

function check_exists(path: string): Promise<string | boolean> {
	return new Promise(async function (resolve, reject) {
		if (fs.existsSync(path)) {
			if ((await fs.promises.stat(path)).isDirectory()) {
				resolve("directory");
				return;
			}
			resolve("file");
			return;
		} else {
			resolve(false);
		}
	});
}

function get_mime(path: string): string | false {
	let ext = "." + path.split(".")[path.split(".").length - 1];
	return mimes[ext];
}

async function handle_file(
	requested_path: string,
	rewriteIndex: boolean
): Promise<string | false> {
	let requested_type = await check_exists(requested_path);
	if (requested_type === "directory") {
		if (rewriteIndex) {
			let index_path = path.join(requested_path, "index.html");
			return handle_file(index_path, rewriteIndex);
		}
	} else if (requested_type === "file") {
		return requested_path;
	} else {
		return false;
	}
}

function check_endpoints(info: VelocitousInfo, endpoints: Array<any>): boolean {
	var rval = false;
	for (let i = 0; i < endpoints.length; i++) {
		if (endpoints[i].checker(info)) {
			endpoints[i].actor(info.req, info.res);
			rval = true;
		}
	}
	return rval;
}

class VelocitousServer {
	httpServer: Server;
	endpoints: any[] = [];
	constructor(config: { port; rootFolder; rewriteIndex }) {
		var { port, rootFolder, rewriteIndex } = config;
		if (rewriteIndex !== false) {
			rewriteIndex = true;
		}
		this.httpServer = http.createServer(
			(req: IncomingMessage, res: ServerResponse) => {
				(async (req, res) => {
					let requested_url = url.parse(`http://${req.headers.host}${req.url}`);
					let requested_path = path.join(
						process.cwd(),
						rootFolder,
						requested_url.path
					);

					if (
						check_endpoints(
							{
								url: requested_url,
								headers: req.headers,
								method: req.method,
								path: requested_path,
								req: req,
								res: res,
								ip: req.connection.remoteAddress,
							},
							this.endpoints
						)
					)
						return;
					let file = await handle_file(requested_path, rewriteIndex);

					if (file) {
						var ct = get_mime(file);
						if (ct) {
							res.writeHead(200, {
								"content-length": fs.statSync(file).size,
								"content-type": ct as string,
							});
						} else {
							res.writeHead(200, {
								"content-length": fs.statSync(file).size,
							});
						}
						fs.createReadStream(file).pipe(res);
					} else {
						res.writeHead(404);
						res.end();
					}
				})(req, res).catch(function (e) {
					res.writeHead(500);
					res.end();
				});
			}
		);
		this.httpServer.listen(port);
		return this;
	}
	endpoint(
		checker: (info: VelocitousInfo) => any,
		actor: (req: IncomingMessage, res: ServerResponse) => any
	): VelocitousServer {
		this.endpoints.push({
			checker: checker,
			actor: actor,
		});
		return this;
	}
	passthrough(
		checker: (info: VelocitousInfo) => any,
		target: (info: VelocitousPassthroughInfo) => any
	): VelocitousServer {
		this.endpoint(
			checker,
			function (req: IncomingMessage, res: ServerResponse) {
				var options = {
					...url.parse(
						target({
							url: url.parse(`http://${req.headers.host}${req.url}`),
							headers: req.headers,
							method: req.method,
						})
					),
					headers: req.headers,
					method: req.method,
				};
				http.get(options, function (response) {
					res.writeHead(response.statusCode, response.headers);
					response.pipe(res);
				});
			}
		);
		return this;
	}
}
module.exports = VelocitousServer;
export default VelocitousServer;
