const server = require("./index").start({
	port: 800,
	rootFolder: "./",
	rewriteIndex: true,
});
server.endpoint(
	(info) => info.url.path === "/someapi",
	function (req, res) {
		res.writeHead(200);
		res.write(JSON.stringify({ data: "a mockup api" }));
		res.end();
	}
);
