export default interface VelocitousConfig {
	port: number;
	rootFolder: string;
	rewriteIndex?: boolean | string;
	bindAddress?: string;
    headers?: { [key: string]: string };
}
