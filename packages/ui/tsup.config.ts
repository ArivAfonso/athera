import { Options, defineConfig, Format } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'

export default defineConfig((options: Options) => ({
    entry: ['src/index.ts', 'styles/globals.css'],
    banner: {
        js: "'use client'",
    },
    format: ['cjs', 'esm'] as Format[],
    dts: true,
    clean: false,
    external: ['react'],
    esbuildPlugins: [
        sassPlugin({
            type: 'css',
        }),
    ],
    ...options,
}))
