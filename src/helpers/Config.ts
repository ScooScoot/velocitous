import VelocitousConfig from "../types/VelocitousConfig";

export default class Config implements VelocitousConfig {
	port: number;
	rootFolder: string;
	rewriteIndex?: boolean | string;
    bindAddress?: string;
    headers?: { [key: string]: string };
	constructor(config: VelocitousConfig) {
		this.port = config.port;
        this.rootFolder = config.rootFolder;

        this.headers = config.headers || {};
		this.rewriteIndex = config.rewriteIndex || "index.html";
		this.bindAddress = config.bindAddress || "0.0.0.0";
	}
}
