import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: './',
	cacheDir: "",
	resolve: {
		alias: {
			'@': '/src',
			'@/axios': '/src/axios',
			'@components': '/src/components',
			'@/assets': '/src/assets'
		}
	},
	build: {
		sourcemap: true,
		terserOptions: {

		}
	},
	clearScreen: false, // 去除清屏
	server: {
		host: '0.0.0.0',
		open: false,
		port:3000,
		hmr: {
			overlay: false // 禁止及诶按出现错误信息
		},
		proxy: {
			// 选项写法
			'/api': {
				
				target: 'http://10.51.102.158:8286',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
})
