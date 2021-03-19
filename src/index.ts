import { assert } from "console";
import { IncomingMessage, Server, ServerResponse } from "http";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";

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

function get_mime(path: any): string | false {
	let ext = "." + path.split(".")[path.split(".").length - 1];
	return mimes[ext];
}

async function handle_file(
	requested_path: any,
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

function check_endpoints(info: any, endpoints: Array<any>): boolean {
	for (let i = 0; i < endpoints.length; i++) {
		if (endpoints[i].checker(info)) {
			endpoints[i].actor(info.req, info.res);
			return true;
		}
	}
	return false;
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
	endpoint(checker: Function, actor: Function) {
		this.endpoints.push({
			checker: checker,
			actor: actor,
		});
		return this;
	}
	passthrough(checker: Function, target: string) {
		this.endpoint(checker, function (req, res) {
			http.get(target, function (response) {
				response.pipe(res);
			});
		});
	}
}
module.exports = VelocitousServer;
export default VelocitousServer;
