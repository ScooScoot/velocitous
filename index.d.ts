declare module "velocitous" {
	function start(config: { port: number; rootFolder: string }): boolean;
	export = { start: start };
}
