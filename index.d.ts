declare module "velocitous" {
	function endpoint(): void;
	function start(config: {
		port: number;
		rootFolder: string;
	}): { endpoint: endpoint };
	export = { start: start };
}
