import React,{useEffect} from 'react';
import VoteButton from './VoteButton'

const samples = [1,2,3];

export default function Instrument({name,voted,votes,sendVote,isPolling}){



    const onClick=(inst,sample)=>{
        sendVote({inst:inst,state:sample});
    }
    
    let buttons = samples.map(sample=><VoteButton key={`button-${sample}`} onClick={onClick} isPolling={isPolling} voted={voted} sendVote={sendVote} votes={votes[name]} num={sample} name={name}/>)

    

    return(
        <div style={{display:'flex',flexDirection:'column'}}>
            <p>{name}</p>
            {buttons}
        </div>
    )
}