const VelocitousServer = require("../").default;
new VelocitousServer({
	port: 500,
	rootFolder: "test/pub",
	rewriteIndex: "index.html",
})
	.endpoint(
		({ url }) => url.pathname === "/test",
		(req, res) => {
			res.write("testing");
			res.end();
		}
	)
	.endpoint(
		({ url }) => url.pathname === "/testing",
		(req, res) => {
			res.write("test");
			res.end();
		}
	);
