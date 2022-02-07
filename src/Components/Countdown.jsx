import React, { useState, useEffect, useMemo, useContext } from "react";
import { intervalToDuration, isBefore } from 'date-fns';
import { useTicker } from '../hooks/useTicker.js';
import { DAOContext } from '../pages/index.jsx';

export default function Countdown(props) {
  const {days, hours, minutes, seconds, isTimeUp } = useTicker(props.futureTime*1000);

  const renderDay = () => {
    if(days == 0){
      return "";
    }else if (days == 1) {
      return "Day";
    }else {
      return "Days";
    }
  }

  const renderSeconds = () => {
    if (seconds < 10){
      return "0" + seconds.toString() ;
    }
    else{
      return seconds;
    }
  }
  
  const renderMinutes = () => {
    if (minutes < 10){
      return "0" + minutes.toString() ;
    }
    else{
      return minutes;
    }
  }


  return(
    <p> {days} {renderDay()} {hours}:{renderMinutes()}:{renderSeconds()}</p>
  )

}
