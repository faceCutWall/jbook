import type React from 'react'
import { useEffect, useRef } from 'react'
import './preview.css'

interface PreviewProps {
	  code: string
}

const html = `
<html>
  <head>
    <style>html {background-color: white;}</style>
  </head>
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
`

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const ifream = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    ifream.current!.srcdoc = html
    setTimeout(() => {
      ifream.current!.contentWindow!.postMessage(code, '*')
    }, 50)
  }, [code])

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
        ref={ifream}
      />
    </div>
  )
}

export default Preview
