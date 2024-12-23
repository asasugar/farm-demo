import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from '@farmfe/core';
import sass from '@farmfe/js-plugin-sass';
import viewer from '@farmfe/js-plugin-visualizer';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { VueRouterAutoImports, getFileBasedRouteName } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';

function configureVitePluginVue() {
	// return plugin and its filters
	return {
		// using plugin vue
		vitePlugin: vue(),
		// configuring filters for it. Unmatched module paths will be skipped.
		filters: ['!node_modules', 'node_modules/my-ui']
	};
}

export default defineConfig({
	compilation: {
		// compilation options here
		// persistentCache: false
		output: {
			path: 'dist',
			publicPath: '/',
			targetEnv: 'browser'
		},
		sourcemap: false,
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		}
	},
	plugins: [sass(), process.env.FARM_VIEWER ? viewer() : undefined],
	vitePlugins: [
		VueRouter({
			routesFolder: [
				{
					src: 'src/views',
					path: '',
					// override globals
					exclude: (excluded) => excluded,
					filePatterns: (filePatterns) => filePatterns,
					extensions: (extensions) => extensions
				}
			],
			extensions: ['.vue'],
			// where to generate the types
			dts: './typed-router.d.ts',
			// how to generate the route name
			getRouteName: (routeNode) => getFileBasedRouteName(routeNode),
			pathParser: {
				// should `users.[id]` be parsed as `users/:id`?
				dotNesting: true
			}
		}),
		// ⚠️ Vue must be placed after VueRouter()
		configureVitePluginVue,
		vueJsx(),
		AutoImport({
			resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
			imports: ['vue', VueRouterAutoImports]
		}),
		Components({
			resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
		})
	]
});
