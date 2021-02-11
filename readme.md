# Velicitous

Velicitous is a static file server with programmable endpoints for nodejs.

# Usage

Example

```js
const velocitous = require("velocitous");
const server = velocitous.start({
	port: 80,
	rootFolder: "var/www/html",
	rewriteIndex: true,
});
server.endpoint(
	(info) => info.url.pathname === "something",
	function (req, res) {
		res.write("you've found something!");
		res.end();
	}
);
```

# API

### velocitous.start(config)

config:
_`port`- The port the server should run on.
_`rootFolder`- A relative location that contains static files to be served. \*`rewriteIndex`- Whether the server should serve `index.html` automatically.

### velocitousServer.endpoint(checker, actor)

arguments: 
-`checker` - A function which returns truthy or falsy value depending on whether the requested resource matches some condition. 
-`actor` - A function which the `IncomingMessage` and `ServerResponse` is passed to, instead of serving a static resource, if the `checker` returns a truthy value.
