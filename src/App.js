import React, { useReducer, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import InstrumentCircle from './components/InstrumentCircle';


const socketURL = '/';


const instruments = []

let resultsInitial = {}
instruments.forEach(inst=>resultsInitial[inst] = 1)


const initialState = {isPolling: false,voted:{},clips:{},results:{...resultsInitial},finalResults:{}};


function reducer(state, action) {
  switch (action.type) {
    case 'togglePoll':
      let res= {}
      if(!action.state){
        res = {}
        Object.keys(state.results).forEach(inst=>{
          let max = {key:0,value:0};
          Object.keys(state.results[inst]).forEach((clip,index)=>{
            let current = Number(state.results[inst][clip]);
            if(current>max.value){
              max.value = current;
              max.key = index;
            }
          })
          res[inst]=Number(max.key);
        })
      }
      return {...state,voted:{},finalResults:res,isPolling: action.state};
    case 'clips':
      return {...state,clips:action.clips};
    case 'voted':
      return {...state,voted:{...state.voted,[action.instrument]:true}};
    case 'results':
      return {...state,results:action.results};
    case 'final-results':
      return {...state,finalResults:action.results};
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
      if(value){
        dispatch({type:'togglePoll',state:true})
      }else{
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
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
        {Object.keys(state.clips).map((name,index)=>{
          return <InstrumentCircle sendVote={sendVote} key={index} clips={state.clips[name]} isPolling={state.isPolling} voted={state.voted[name]} finalResults={state.finalResults[name]} votes={state.results[name]} id={index} name={name}   />
        })}        
      </div>
    </div>
  );
}

export default App;
