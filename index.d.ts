declare module "static-speed" {
	function start(config: { port: number; rootFolder: string }): boolean;
	export = { start: start };
}
