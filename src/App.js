import React, { useState, useEffect } from 'react';
import { Button, Paper } from '@material-ui/core';
import {CronToggle} from './CronToggle.js'
import addNotification from 'react-push-notification';
import {CountdownApp} from './CountdownApp.js'
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
	formControl: {
	  margin: theme.spacing(1),
	  minWidth: 120,
	},
	selectEmpty: {
	  marginTop: theme.spacing(2),
	},
	root: {
		'& > *': {
		  margin: theme.spacing(1),
		  width: '25ch',
		},
	  },
	listRoot: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
  }));

function App() {
	//const [alarms, setAlarms] = useState([{type: "cron", message: "TEST CRON", data: '*/10 * * * * *'}, {type: 'countdown', message: 'TEST COUNTDOWN', data: 5}]);
	const [alarms, setAlarms] = useState([]);
	const classes = useStyles();

	const [formData, setFormData] = useState({
		type: 'countdown',
		message: '',
		data: ''
	})

	// useEffect(() => {
	// 	Notification.requestPermission().then(function(result) {
	// 	  if (result != 'granted') {
	// 		addNotification({
	// 			title: 'LISTEN, BUDDY!',
	// 			message: 'PLEASE ENABLE BROWSER NOTIFICATIONS FOR REMINDERS',
	// 			duration: 30000,
	// 			theme: 'red'
	// 		});
	// 	  }
	// });});  
	
	const addNewAlarm = (event) => {
		event.preventDefault()
		console.log(formData)
		setAlarms(alarms.concat({type: formData.type, message: formData.message, data: formData.data}));
		console.log(alarms)
		setFormData({
			type: 'countdown',
			message: '',
			data: ''
		});
	}

  return (
    <Box component="span" m={1} >
		<Paper onSubmit={addNewAlarm} className={classes.root}>
			<Select
				value={formData.type} 
				onChange={(e) => setFormData({...formData, type: e.target.value,
					data: e.target.value == 'countdown' ? '' : '* * * * * *'})}
			>
				<MenuItem value="countdown">CountDown Timer</MenuItem>
            	<MenuItem value="cron">Cron Timer</MenuItem>
			</Select>
			<TextField
				label="Message"
				variant="outlined"
				size="small"
				value={formData.message}
				onChange={(e) => setFormData({...formData, message: e.target.value})}
			/>
			{formData.type == 'countdown' ? '' : 
				<Link href="https://crontab.guru/" target="_blank">Cron Documentation(With extra seconds field)</Link>}
			<TextField
				label={formData.type == 'countdown' ? 'Seconds' : 'Cron String'}
				value={formData.data}
				size="small"
				variant="outlined"
				onChange={(e) => setFormData({...formData, data: e.target.value})}
			/>
			<Button onClick={addNewAlarm} variant="contained" color="primary">ADD ALARM</Button>
		</Paper>
		<Grid container  spacing={2}>
		{alarms.map((alarm) => { 
			if (alarm.type === 'countdown') {
				return (<Grid item xs={2}>
					<CountdownApp
					message={alarm.message} 
					time={alarm.data}
				/></Grid>)
			} else {
				return (<Grid item xs={2}><CronToggle
					message={alarm.message}
					cronstring={alarm.data}
				/></Grid>)
			}
		}
		)}
		</Grid>
    </Box>

  )
}
export default App;
