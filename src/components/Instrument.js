import React,{useEffect} from 'react';
import VoteButton from './VoteButton'

// const samples = [1,2,3];

export default function Instrument({name,voted,votes,sendVote,isPolling,clips}){



    const onClick=(inst,clip)=>{
        sendVote({inst,clip});
    }
    
    let buttons = clips.map(sample=><VoteButton key={`button-${sample.id}`} onClick={onClick} isPolling={isPolling} voted={voted} sendVote={sendVote} votes={votes[name]} clipInfo={sample}  name={name}/>)

    

    return(
        <div style={{display:'flex',flexDirection:'column'}}>
            <p>{name}</p>
            {buttons}
        </div>
    )
}