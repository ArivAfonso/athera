import { Options, defineConfig, Format } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'

export default defineConfig((options: Options) => ({
    entry: ['src/index.ts'],
    banner: {
        js: "'use client'",
    },
    format: ['cjs', 'esm'] as Format[],
    dts: true,
    clean: true,
    external: ['react'],
    esbuildPlugins: [
        sassPlugin({
            type: 'css',
        }),
    ],
    injectStyle: true,
    ...options,
}))
