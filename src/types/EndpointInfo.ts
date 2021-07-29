import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";

export default interface EndpointInfo {
	url: URL;
	headers: IncomingHttpHeaders;
	method: string;
	req: IncomingMessage;
	res: ServerResponse;
	ip: string;
}
