const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const mimes = require("./mimes");

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

async function handle_file(requested_path, rewriteIndex) {
	let requested_type = await check_exists(requested_path);
	if (requested_type === "directory") {
		if (rewriteIndex) {
			let index_path = path.join(requested_path, "index.html");
			return handle_file(index_path);
		}
	} else if (requested_type === "file") {
		return fs.createReadStream(requested_path);
	} else {
		return false;
	}
}

module.exports.start = function (config) {
	var { port, rootFolder, rewriteIndex } = config;
	http
		.createServer(function (req, res) {
			(async function (req, res) {
				let requested_url = url.parse(`http://${req.headers.host}${req.url}`);
				let requested_path = path.join(rootFolder, requested_url.path);
				console.log(requested_path);
				let file = await handle_file(requested_path, rewriteIndex);
				if (file) {
					file.pipe(res);
				} else {
					res.writeHead(404);
					res.end();
				}
				req, res;
			})(req, res).catch(function (e) {
				console.log(e);
				res.writeHead(500);
				res.end();
			});
		})
		.listen(port);
	return {
		endpoint: function (checker, actor) {},
	};
};
