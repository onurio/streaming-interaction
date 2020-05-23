import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';


const socketURL = 'http://192.168.1.5:4000';



function App() {
  const currentSocket = useRef(null);  
  const [results,setResults] = useState({up:0,down:0})
  const [isPolling,setIsPolling]  = useState(false);
  const [voted,setVoted] = useState(false);


  useEffect(()=>{
    initSocket();

  },[])


  const initSocket = () =>{
    console.log('connecting')
    const socket = io(socketURL,{secure: true});

    socket.on('connect',()=>{
      console.log('connected');
    });
    socket.connect();    

    socket.on('togglePoll',(value)=>{
      if(value){
        setIsPolling(true);
        setVoted(false);
      }else{
        setIsPolling(false);
      }
    });
    currentSocket.current = socket;
  }

  const sendVote=(value)=>{
    setVoted(true);
    currentSocket.current.emit('vote',value);
  }





  return (
    <div className="App">
      <h1 style={{position:'absolute',top:'10vh',left:'48vw'}}>{isPolling?'voting started!':'wait for a vote'}</h1>
      <div>
        {
          Object.keys(results).map(type=><h1>{type}: {results[type]}</h1>)
        }
      </div>
      <div>
        <Button onClick={e=>sendVote('up')} disabled={isPolling&&!voted?false:true} variant="contained" color="primary">
        UP
        </Button>
        <Button onClick={e=>sendVote('down')} disabled={isPolling&&!voted?false:true} variant="contained" color="primary">
        DOWN
        </Button>

      </div>
    </div>
  );
}

export default App;
