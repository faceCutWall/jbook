import type * as esbuild from 'esbuild-wasm'

interface UnpkgPlugin {
  name: string
  setup: (build: esbuild.PluginBuild) => void
}

export function unpkgPathPlugin(): UnpkgPlugin {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of 'index.js'
      build.onResolve({ filter: /^index\.js$/ }, () => {
        return { path: 'index.js', namespace: 'a' }
      })

      // handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args) => {
        return {
          namespace: 'a',
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        }
      })

      build.onResolve({ filter: /.*/ }, async (args) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        }
      })
    },
  }
}
