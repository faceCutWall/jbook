import React, { useEffect, useState } from 'react'
import bundle from '../bundler'
import CodeEditor from './code-editor'
import Preview from './preview'
import Resizable from './resizable'

const CodeCell: React.FC = () => {
  const [input, setInput] = useState<string>('')
  const [code, setCode] = useState<string>('')

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        const output = await bundle(input)
        setCode(output)
      },
      500,
    )

    return () => clearTimeout(timer)
  }, [input])

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor

            initialValue="console.log('hello world')"
            onChange={(value) => {
		          setInput(value)
            }}
          >
          </CodeEditor>
        </Resizable>
        <Preview code={code}></Preview>
      </div>
    </Resizable>
  )
}

export default CodeCell
