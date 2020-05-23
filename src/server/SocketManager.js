const io = require('./index.js').io;


let polling = []


module.exports = (socket) =>{

    socket.binaryType = 'arraybuffer';

    socket.on('vote',(value)=>{
     polling.push(value);   
    })

    socket.on('startVote',()=>{
        //give people 10 seconds to vote.
        setTimeout(()=>{
            endVote();
        },10000)
    })

    const endVote=()=>{
        // emit vote end to all clients
        

        //calculate average

    }
    
    socket.on('disconnect',()=>{
    });
};
