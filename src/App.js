import React, { useReducer, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Instrument from './components/Instrument';


const socketURL = '/';


const instruments = ['zabumba','agogo','pandeiro','triangulo','ganza']

let resultsInitial = {}
instruments.forEach(inst=>resultsInitial[inst] = 1)


const initialState = {isPolling: false,voted:{},clips:{},results:{...resultsInitial}};


function reducer(state, action) {
  switch (action.type) {
    case 'togglePoll':
      return {...state,voted:{},isPolling: action.state,};
    case 'clips':
      return {...state,clips:action.clips};
    case 'voted':
      return {...state,voted:{...state.voted,[action.instrument]:true}};
    case 'results':
      return {...state,results:action.results}
    default:
      throw new Error();
  }
}



function App() {
  const currentSocket = useRef(null);  
  const [state, dispatch] = useReducer(reducer, initialState);


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


    socket.on('results',(results)=>{
      dispatch({type:'results',results});      
    })

    socket.on('clips',(clips)=>{
      dispatch({type:'clips',clips:clips});
    })
    

    socket.on('togglePoll',(value)=>{      
      console.log(value);
      if(value){
        dispatch({type:'togglePoll',state:true})
      }else{
        console.log('stopped vote');
        
        dispatch({type:'togglePoll',state:false})
      }
    });

    currentSocket.current = socket;
  }




  const sendVote=(value)=>{
    dispatch({type:'voted',instrument:value.inst,clip:value.clip})
    currentSocket.current.emit('vote',value);
  }





  return (
    <div className="App">
      <h1 >{state.isPolling?'voting started!':'wait for a vote'}</h1>
      {/* <div style={{display:'grid',gap:4,gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr'}}>
        {
          Object.keys(results).map(type=><h3 key={type}>{type}: {results[type]}</h3>)
        }
      </div> */}
      <div style={{display:'flex'}}>
        {Object.keys(state.clips).map((name,index)=>{
          return <Instrument sendVote={sendVote} key={index} clips={state.clips[name]} isPolling={state.isPolling} voted={state.voted[name]} votes={state.results} id={index} name={name}   />
        })}
      </div>
    </div>
  );
}

export default App;
