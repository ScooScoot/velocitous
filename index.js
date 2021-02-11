const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const mimes = require("./mimes");

const endpoints = [];

function check_exists(path) {
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

function get_mime(path) {
	let ext = "." + path.split(".")[path.split(".").length - 1];
	console.log(ext);
	return mimes[ext] || "*/*";
}

async function handle_file(requested_path, rewriteIndex) {
	let requested_type = await check_exists(requested_path);
	if (requested_type === "directory") {
		if (rewriteIndex) {
			let index_path = path.join(requested_path, "index.html");
			return handle_file(index_path);
		}
	} else if (requested_type === "file") {
		return requested_path;
	} else {
		return false;
	}
}

//info{url, path, headers, method, req, res, ip};
function check_endpoints(info) {
	for (let i = 0; i < endpoints.length; i++) {
		if (endpoints[i].checker(info)) {
			endpoints[i].actor(info.req, info.res);
			return true;
		}
	}
	return false;
}

const velocitousServer = {
	endpoint: function (checker, actor) {
		endpoints.push({
			checker: checker,
			actor: actor,
		});
		return this;
	},
};

module.exports.start = function (config) {
	var { port, rootFolder, rewriteIndex } = config;
	http
		.createServer(function (req, res) {
			(async function (req, res) {
				let requested_url = url.parse(`http://${req.headers.host}${req.url}`);
				let requested_path = path.join(rootFolder, requested_url.path);

				if (
					check_endpoints({
						url: requested_url,
						headers: req.headers,
						method: req.method,
						path: requested_path,
						req: req,
						res: res,
						ip: req.connection.remoteAddress,
					})
				)
					return;

				console.log(requested_path);
				let file = await handle_file(requested_path, rewriteIndex);
				console.log(get_mime(requested_path));

				if (file) {
					res.writeHead(200, {
						"content-length": fs.statSync(file).size,
						"content-type": get_mime(file),
					});
					fs.createReadStream(file).pipe(res);
				} else {
					res.writeHead(404);
					res.end();
				}
			})(req, res).catch(function (e) {
				console.log(e);
				res.writeHead(500);
				res.end();
			});
		})
		.listen(port);
	return velocitousServer;
};
