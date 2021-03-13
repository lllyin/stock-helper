import React from 'react';
import Dashbord from './pages/Dashbord';

import './App.scss';

function App() {
  return (
    <div className="App">
      <Dashbord />
    </div>
  );
}

/**
 * 容错
 */
window.addEventListener('error', (globalError) => {
  console.error('addEventListener error', globalError);
  // const r = window.confirm(`数据错误，将重置数据。\n${globalError.message}`)
  // if(r === true) {
  //   resetData();
  //   window.location.reload();
  // }
});

export default App;
