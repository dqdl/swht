import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: './',
	resolve: {
		alias: {
			'@': '/src',
			'@components': '/src/components',
		},
	},
	build: {
		sourcemap: true,
	},
	server: {
		host: true,
		port:3005,
	},
});
