import * as esbuild from "esbuild-wasm";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const ref = useRef<esbuild.Service>();

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
        setCode(code);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const html = `
  <script>
    ${code}
  </script>
  `;

  return (
    <div>
      <textarea
        rows={10}
        cols={60}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
