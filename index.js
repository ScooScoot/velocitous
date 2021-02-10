const http = require("http");
const serveDir=

http
	.createServer(function (req, res) {
		res.write(req.url);
		res.end();
	})
	.listen(800);
