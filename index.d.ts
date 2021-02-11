import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import { UrlWithStringQuery } from "url";

type checker = (info: {
	url: UrlWithStringQuery;
	headers: IncomingHttpHeaders;
	method: string;
	path: string;
	req: IncomingMessage;
	res: ServerResponse;
	ip: string;
}) => any;

type actor = (req: IncomingMessage, res: ServerResponse) => any;

interface velocitousServer {
	endpoint(checker: checker, actor: actor): velocitousServer;
}

declare module "velocitous" {
	function start(config: {
		port: number;
		rootFolder: string;
	}): velocitousServer;
	export = { start: start };
}
