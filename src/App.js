import React from 'react';
import { Button } from '@material-ui/core';
import {CronToggle} from './CronToggle.js'
function App() {
	
	
	
  return (
    <div>
      <CronToggle 
	    cronstring='*/10 * * * * *' 
		notifDuration='6500'
		message='THIS IS A TEST'
	  />
	  <CronToggle 
	    cronstring='0 14,44 * * * *' 
		notifDuration='6500'
		message='IT IS TIME FOR MVP'
	  />
    </div>
  )
}
export default App;
