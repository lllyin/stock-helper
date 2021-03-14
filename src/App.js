import React, { useReducer } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { reducers, initState, Context } from '@/reducers/index'
import BasicLayout from './components/BasicLayout'
import Dashbord from './pages/Dashbord'
import Positions from './pages/Positions'

import './App.scss'

function App() {
  const [store, dispatch] = useReducer(reducers, initState)

  return (
    <Router>
      <Context.Provider value={{ store, dispatch }}>
        <div className="App">
          <BasicLayout>
            <Switch>
              <Route path="/dashbord">
                <Dashbord />
              </Route>
              <Route path="/positions">
                <Positions />
              </Route>
              <Route path="/">404</Route>
            </Switch>
          </BasicLayout>
        </div>
      </Context.Provider>
    </Router>
  )
}

/**
 * 容错
 */
window.addEventListener('error', (globalError) => {
  console.error('addEventListener error', globalError)
  // const r = window.confirm(`数据错误，将重置数据。\n${globalError.message}`)
  // if(r === true) {
  //   resetData();
  //   window.location.reload();
  // }
})

export default App
