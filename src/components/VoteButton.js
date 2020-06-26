import React from 'react'
import Button from '@material-ui/core/Button';





export default function VoteButton({onClick,isPolling,num,votes,name,voted}){

    // useEffect(()=>{
    //     console.log('polling:'+isPolling+',voted:'+voted);
        
    // },[isPolling,voted])

    return(
    <div style={{display:'flex',flexDirection:'column',padding:'1ch'}}>
        <Button onClick={e=>onClick(name,num)} disabled={isPolling&&!voted?false:true} variant="contained" color="primary">
            {num}
        </Button>
        <p>Votes:{votes[num]}</p>
    </div>
    )
}