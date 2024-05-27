import 'bulmaswatch/superhero/bulmaswatch.min.css'
import { createRoot } from 'react-dom/client'
import CodeCell from './components/code-cell'

const root = createRoot(document.getElementById('root')!)
root.render(
  <div>
    <CodeCell />
  </div>,
)
