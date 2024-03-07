import MoancoEditor, { type EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import React, { useRef } from "react";
import "./code-editor.css";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
}) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, moancoEditor): void => {
    editorRef.current = moancoEditor;
    moancoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    moancoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = (): void => {
    const unformatted: string = editorRef.current.getModel().getValue();
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        semi: true,
      })
      .replace(/\n$/, "");
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper" style={{ width: "900px" }}>
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MoancoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="typescript"
        height="400px"
        options={{
          minimap: { enabled: false },
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
