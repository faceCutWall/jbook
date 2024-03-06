import type * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

interface FetchPlugin {
  name: string;
  setup: (build: esbuild.PluginBuild) => void;
}

export const fetchPlugin = (inputCode: string): FetchPlugin => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, async (args) => {
        return {
          loader: "tsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path,
        );
        if (cacheResult) {
          return cacheResult;
        }
        // go to next onLoad function
      });

      build.onLoad({ filter: /.css$/ }, async (args) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
				const style = document.createElement('style');
				style.innerText = '${escaped}';
				document.head.appendChild(style);
			`;

        const result: esbuild.OnLoadResult = {
          loader: "tsx",
          contents,
          resolveDir: new URL(".", request.responseURL as string).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "tsx",
          contents: data,
          resolveDir: new URL(".", request.responseURL as string).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
