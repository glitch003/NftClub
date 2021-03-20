import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import App from './App'
import RedirectPage from './RedirectPage'

const URL_MAP = {
  home: {
    path: '/',
    component: props => <App {...props} />
  },
  redirectPage: {
    path: '/l/:linkId',
    component: props => <RedirectPage {...props} />
  }
}

export default function AppRouter () {
  return (
    <Router>
      <Switch>
        {Object.values(URL_MAP).map(u =>
          <Route
            key={u.path}
            exact
            path={u.path}
            render={routeProps => u.component(routeProps)}
          />
        )}
      </Switch>
    </Router>
  )
}
