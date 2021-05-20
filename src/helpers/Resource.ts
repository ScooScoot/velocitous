/// <reference types="node" />
import * as fs from "fs";
import * as path from "path";
import Mimes from "../resources/Mimes";

export default class Resource {
	public exists: boolean;
	public stats: fs.Stats;
	public path: string;
	constructor(
		resourcePath: string,
		rootFolder: string,
		rewriteIndex: boolean | string
	) {
		resourcePath = path.join(rootFolder, resourcePath);
		try {
			var stats = fs.statSync(resourcePath);
		} catch (e) {
			this.exists = false;
			return;
		}
		if (stats.isDirectory()) {
			if (rewriteIndex) {
				resourcePath = path.join(resourcePath, rewriteIndex as string);
				try {
					var stats = fs.statSync(resourcePath);
				} catch (e) {
					this.exists = false;
					return;
				}
			}
		}
		this.stats = stats;
		this.path = resourcePath;
		this.exists = true;
	}
	read() {
		if (this.exists && this.stats.isFile())
			return fs.createReadStream(this.path);
		throw "Resource does not exist or is not a file";
	}
	get mime(): null | string {
		let extension = path.basename(this.path);
		return Mimes[extension];
	}
}
