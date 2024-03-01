import * as esbuild from "esbuild-wasm";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const ref = useRef<esbuild.Service>();

  const startService = async (): Promise<void> => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
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
        plugins: [unpkgPathPlugin()],
      })
      .then((result) => {
        setCode(result.outputFiles[0].text);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
