import type React from 'react'
import { useEffect, useRef } from 'react'

interface PreviewProps {
	  code: string
	  trigger: boolean
}

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
`

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const ifream = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    ifream.current!.srcdoc = html
    ifream.current?.contentWindow?.postMessage(code, '*')
  })

  return (
    <iframe
      title="preview"
      sandbox="allow-scripts"
      srcDoc={html}
      ref={ifream}
    />
  )
}

export default Preview
