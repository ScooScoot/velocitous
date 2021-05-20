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
	check(info: EndpointInfo) {
		return this.listener(info);
	}
	operate(req: IncomingMessage, res: ServerResponse) {
		this.operator(req, res);
	}
}
