import React from 'react';
import Dashbord from './Dashbord';
import { resetData } from './utils/common'

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
  alert(`数据错误，将重置数据。\n${globalError.message}`);
  resetData();
  window.location.reload();
});

export default App;
