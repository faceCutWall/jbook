import React, { useState } from 'react'
import bundle from '../bundler'
import CodeEditor from './code-editor'
import Preview from './preview'

const CodeCell: React.FC = () => {
  const [input, setInput] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [renderTrigger, setRenderTrigger] = useState<boolean>(false)

  const onClick = async () => {
    setRenderTrigger(!renderTrigger)
	  const output = await bundle(input)
    setCode(output)
  }

  return (
    <div>
      <CodeEditor
        initialValue="console.log('hello world')"
        onChange={(value) => {
		    setInput(value)
        }}
      >
      </CodeEditor>
      <div>
        <button
          type="button"
          className="button button-format is-primary is-small"
          onClick={onClick}
        >
          Submit
        </button>
      </div>
      <Preview code={code} trigger={renderTrigger}></Preview>
    </div>
  )
}

export default CodeCell
