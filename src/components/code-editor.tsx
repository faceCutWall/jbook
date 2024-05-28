import MonacoEditor, { type OnChange, type OnMount } from '@monaco-editor/react'
import prettier from 'prettier/standalone'
import parser from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import React, { useRef } from 'react'
import './code-editor.css'

interface CodeEditorProps {
  initialValue: string
  onChange: (value: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
}) => {
  const editorRef = useRef<any>()

  const onEditorMount: OnMount = (editor, _): void => {
    editorRef.current = editor
    onChange(initialValue)
  }

  const onEditorChange: OnChange = (value, _): void => {
    if (value)
      onChange(value)
  }

  const onFormatClick = (): void => {
    const unformatted: string = editorRef.current.getModel().getValue()
    prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser, prettierPluginEstree],
        semi: true,
      })
      .then(formatted =>
        editorRef.current.setValue(formatted.replace(/\n$/, '')),
      )
      .catch((error) => {
        console.error(error)
        return unformatted
      })
  }

  return (
    <div className="editor-wrapper">
      <button
        type="button"
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={onEditorMount}
        onChange={onEditorChange}
        value={initialValue}
        theme="vs-dark"
        language="javascript"
        height="100%"
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
  )
}

export default CodeEditor
