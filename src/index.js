import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import AppRouter from './AppRouter'
import reportWebVitals from './reportWebVitals'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: '6b2575ca2d4d6da3f85362b248c152b8', // don't care about using env vars for this because it will show up in the web site anyway
  plugins: [new BugsnagPluginReact()]
})

const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
