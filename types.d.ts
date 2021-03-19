declare module "velocitous" {
	/// <reference types="node" />
	import { Server } from "http";
	class VelocitousServer {
		httpServer: Server;
		endpoints: any[];
		constructor(config: { port: any; rootFolder: any; rewriteIndex: any });
		endpoint(checker: Function, actor: Function): this;
		passthrough(checker: Function, target: string): void;
	}
	export default VelocitousServer;
}
