import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { CodeEditor } from "./components/code-editor";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const ref = useRef<esbuild.Service>();
  const ifream = useRef<HTMLIFrameElement>(null);

  const startService = async (): Promise<void> => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    void startService();
  }, []);

  const onClick = (): void => {
    ifream.current!.srcdoc = html;

    ref.current
      ?.build({
        entryPoints: ["index.js"],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          "process.env.NODE_ENV": '"production"',
          global: "window",
        },
      })
      .then((result) => {
        const code = result.outputFiles[0].text;
        ifream.current?.contentWindow?.postMessage(code, "*");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          }
        }, false);
      </script>
    </body>
  </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="console.log('hello world')"
        onChange={(value) => {
          setInput(value);
        }}
      ></CodeEditor>
      <div>
        <button
          className="button button-format is-primary is-small"
          onClick={onClick}
        >
          Submit
        </button>
      </div>
      <iframe ref={ifream} sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
