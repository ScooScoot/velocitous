import { IncomingMessage, ServerResponse } from "http";
import EndpointInfo from "../types/EndpointInfo";

export default class Endpoint {
	public listener;
	public operator;
	constructor(
		listener: (endpointInfo: EndpointInfo) => boolean,
		operator: (req: IncomingMessage, res: ServerResponse) => any
	) {
		this.listener = listener;
		this.operator = operator;
	}
	check(req: IncomingMessage, res: ServerResponse, url: URL) {
		return this.listener({
			url: url,
			headers: req.headers,
			method: req.method,
			req: req,
			res: res,
			ip: req.connection.remoteAddress,
		});
	}
	operate(req: IncomingMessage, res: ServerResponse) {
		this.operator(req, res);
	}
}
