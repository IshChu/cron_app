// Stolen and modified from https://stackoverflow.com/a/67858834

import React, {useState, useEffect, useRef} from 'react'
//import './styles.css'
import Speech from 'speak-tts';
import toast from './toast.png';
import addNotification from 'react-push-notification';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

const speech = new Speech() // will throw an exception if not browser supported

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
}

export function CountdownApp(props) {
  const [secondsRemaining, setSecondsRemaining] = useState(props.time)
  const [status, setStatus] = useState(STATUS.STOPPED)
  const classes = useStyles();

  const secondsToDisplay = secondsRemaining % 60
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
  const minutesToDisplay = minutesRemaining % 60
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

  const handleStart = () => {
    setStatus(STATUS.STARTED)
  }
  const handleStop = () => {
    setStatus(STATUS.STOPPED)
  }
  const handleReset = () => {
    setStatus(STATUS.STOPPED)
    setSecondsRemaining(props.time)
  }
  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
      } else {
        addNotification({
            title: 'Countdown Alarm Notification',
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
		});
        setSecondsRemaining(props.time);
    };
    },
    status === STATUS.STARTED ? 1000 : null,
    // passing null stops the interval
  )
  return (
    <Box component="span" m={1}>
    <Card className={classes.root}>
      <CardContent>
       <h4>{props.message}</h4>
      <Button onClick={handleStart}   variant="contained" color="primary">
        Start
      </Button>
      <Button onClick={handleStop}  variant="contained" color="secondary">
        Stop
      </Button>
      <Button onClick={handleReset}  variant="contained"  color="primary">
        Reset
      </Button>
      <div style={{padding: 20}}>
        {twoDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
        {twoDigits(secondsToDisplay)}
      </div>
      <div>Status: {status}</div>
      </CardContent>
      </Card>
    </Box>
  )
}

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

// https://stackoverflow.com/a/2998874/1673761
const twoDigits = (num) => String(num).padStart(2, '0')
