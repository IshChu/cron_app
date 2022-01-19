import React, { useState, useEffect, useCallback } from 'react';
import { ToggleButton } from '@material-ui/lab';
import { Tooltip } from '@material-ui/core';
import toast from './toast.png';
import addNotification from 'react-push-notification';
import Speech from 'speak-tts';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

var CronJob = require('cron').CronJob;
const speech = new Speech() // will throw an exception if not browser supported
const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });


export function CronToggle(props) {
  const classes = useStyles();

  const [cronval, setCronval] = useState(props.cronstring);
  const [cronjob, setCronJob] = useState(new CronJob(props.cronstring, () => {
	console.log('working ' + cronval);
	addNotification({
            title: 'Cron Alarm Notification',
            message: props.message,
			icon: toast,
			duration: 6500,
			silent: true,
            native: true 
        });
		speech.speak({
			text: props.message,
		}).then(() => {
			console.log("Success !")
		}).catch(e => {
			console.error("An error occurred :", e)
		})
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
  });
  
  return (
	<Box m={1}>
	<Card className={classes.root}>
	<CardContent>
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
	    {toggled ? 'Running' : 'Disabled'} : {cronval} : {props.message}
	  </ToggleButton>
	</Tooltip>
	</CardContent>
    </Card>
	</Box>
  );
  
}

