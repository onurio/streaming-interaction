import React from 'react';
import './InstrumentCircle.css';
import { useEffect } from 'react';
import { useState } from 'react';


const sortVotes=(votes)=>{
    if(votes){
        let arr = Object.keys(votes).map(vote=>votes[vote]);
        let sum = arr.reduce(function(a, b){
            return a + b;
        }, 0);
        arr = arr.map(val=>{
            if(val!==0){
                return val/sum;
            }else{
                return 0;
            }
        });
        return arr
    }else{
        return [0];
    }
}

export default function InstrumentCircle({name,voted,votes,sendVote,isPolling,clips,finalResults}){
    const [userVote,setUserVote] = useState(undefined);


    const handleClick=(clipIndex)=>{
        setUserVote(clipIndex);
        sendVote({inst:name,clip:clips[clipIndex]});
    }


    return(
        <div className={`instrument-container ${isPolling&&!voted?'polling':''}`}>
            <ul id="list">
                {clips.map((item,i)=>{
                    let offsetAngle = 360 / clips.length;
            		let rotateAngle = offsetAngle * i;
                    let votesData = sortVotes(votes)[i];
                    return (
                        <div key={name+i}>
                            <li className={`clip-vote-circle ${i===userVote?'chosen':''}`} 
                            style={{
                                transform:"rotate(" + rotateAngle + "deg) translate(0, -10vw) rotate(-" + rotateAngle + "deg)",
                                width:`${2+3*votesData}em`,height:`${2+3*votesData}em`,left:`calc(50% - ${1+1.5*votesData}em ${i===userVote?'- 2px':''})`,top:`calc(50% - ${1+1.5*votesData}em ${i===userVote?'- 2px':''})`
                                }}/>
                            <li onClick={e=>handleClick(i)} style={{transform:"rotate(" + rotateAngle + "deg) translate(0, -10vw) rotate(-" + rotateAngle + "deg)"}}  className='list-item'><button className={`clip-circle ${i===finalResults?'chosen':''}`} /></li>    
                        </div>
                        )
                })}
                <div className='instrument-knob' style={{transform:`rotate(${360/clips.length*finalResults}deg)`}} >
                    <div className='instrument-knob-arrow' />
                </div>
            </ul>
            <h1>{name}</h1>
            
        </div>
    )
}



