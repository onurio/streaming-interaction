import React from 'react'
import Button from '@material-ui/core/Button';





export default function VoteButton({onClick,isPolling,clipInfo,votes,name,voted}){    

    return(
    <div style={{display:'flex',flexDirection:'column',padding:'1ch'}}>
        <Button onClick={e=>onClick(name,clipInfo)} disabled={isPolling&&!voted?false:true} variant="contained" color="primary">
            {clipInfo.pos+1}
        </Button>
        {votes?<p>Votes:{votes[clipInfo.pos]}</p>:null}
    </div>
    )
}