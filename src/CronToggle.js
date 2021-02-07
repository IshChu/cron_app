import React, { useState, useEffect } from 'react';
import { ToggleButton } from '@material-ui/lab';
import { Tooltip } from '@material-ui/core';
import useSound from 'use-sound';
import alarmSound from './alarm.mp3';
import UIfx from 'uifx';
import toast from './toast.png';
import addNotification from 'react-push-notification';

var beep = new UIfx(alarmSound);
var CronJob = require('cron').CronJob;


export function CronToggle(props) {
  const [cronval, setCronval] = useState(props.cronstring);
  const [cronjob, setCronJob] = useState(new CronJob(props.cronstring, () => {
	  console.log('working ' + cronval);
	  addNotification({
            title: 'Cron Alarm Notification',
            message: props.message,
			icon: toast,
			duration: props.notifDuration,
			silent: true,
            native: true 
        });
	  beep.play(1.0);
	  
  }, null, false, 'America/New_York'));
  const [toggled, setToggled] = useState(false);
  const [openToolTip, setOpenToolTip] = useState(false);
  const [toolTip, setToolTip] = useState('');
  const onToggle = () => { 
    setToggled(!toggled); 
  };
  const handleTooltipClose = () => {
    setOpenToolTip(false);
  };

  const handleTooltipOpen = () => {
    setOpenToolTip(true);
	setToolTip('Next Alarm at: ' + cronjob.nextDates(1)[0].toString());
  };

  useEffect(() => {
	if(toggled && !cronjob.running) {
	  cronjob.start();	
	  console.log('started')
	  console.log(cronjob.nextDates(1))
	} else if (!toggled && cronjob.running){
	  cronjob.stop();
	  console.log('stopped')
	}
//	return () => {
//	  cronjob.stop();
//	  console.log('desroyed')
//	}
  });
  
  return (
    <Tooltip 
	  open={openToolTip} 
	  onClose={handleTooltipClose} 
	  onOpen={handleTooltipOpen} 
	  title={toolTip}
	>
	  <ToggleButton
	    value={cronval}
	    selected={!toggled}
	    onChange={onToggle}
	  >
	    {toggled ? 'Running' : 'Disabled'} : {cronval}
	  </ToggleButton>
	</Tooltip>
  );
  
}

