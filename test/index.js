const Velocitous = require("../");
new Velocitous({
	port: 4000,
	rootFolder: "test/pub",
	rewriteIndex: true,
})
	.endpoint(
		(info) => info.url.path === "/whatsMyIp",
		function (req, res) {
			res.write(`your ip is ${req.connection.remoteAddress}`);
			res.end();
		}
	)
	.endpoint(
		(info) => info.url.path === "/POSTecho",
		function (req, res) {
			if (req.method.toLowerCase() !== "post") {
				res.write("this page only works with a post request");
				res.end();
			} else {
				req.pipe(res);
			}
		}
	)
	.passthrough((info) => info.url.path === "/passthrough", "http://google.com");
