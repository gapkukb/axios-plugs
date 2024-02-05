import { defineConfig, Plugin } from "vite";
import { spawnSync } from "child_process";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
	return {
		build: {
			rollupOptions: {
				external: ["axios"],
			},
			target: "es2015",
			lib: {
				entry: "./src/main.ts",
				name: "yamiLoader",
				formats: ["es", "iife", "umd", "amd"] as any,
				fileName: (formatName) => `index.${formatName}.js`,
			},
		},
		server: {
			proxy: {
				"/api": {
					target: "htts://jsonplaceholder.typicode.com",
				},
				"/gateway": {
					target: "http://faffsdaf",
				},
			},
		},
		plugins: [VitePluginFetchOpenApi()],
	};
});

function VitePluginFetchOpenApi(filter?: (target: string) => string | false): Plugin {
	return {
		name: "vite-plugin-fetch-openapi",
		async configResolved(config) {
			const targets = Object.values(config.server.proxy || {})
				.map((item) => {
					if (typeof item === "string") return;
					const target = filter?.(item.target) ?? item.target;
					if (target === false) return;
					return item.target;
				})
				.filter(Boolean);

			const child = spawnSync(
				"npx",
				[
					"openapi-typescript",
					"https://laroplus.c66uat.com/_front_api_/v2/api-docs",
					"--additional-properties",
					"--output src/typings/test.ts",
				],
				{
					shell: true,
					stdio: "inherit",
				}
			);
		},
	};
}
