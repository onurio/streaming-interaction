const io = require('./index.js').io;


let polling = {up:0,down:0};
let currentNote = 36;

module.exports = (socket) =>{

    socket.on('vote',(value)=>{
      polling = {...polling,[value]:polling[value]+1};
      
      io.emit('results',polling);
    })


    socket.on('adminJoined',()=>{

        socket.join('admin');
        console.log('admin joined');
        
        socket.on('triggerPoll',()=>{
            polling = {up:0,down:0};
            io.emit('results',polling);
            io.emit('togglePoll',true);
        })
    
        socket.on('stopPoll',()=>{
            console.log('stopPoll')
            socket.emit('togglePoll',false);
            endVote();
        })
    
    });


    const endVote=()=>{
        // emit vote end to all clients
        if(polling.up>polling.down){
            currentNote++;
        }else{
            currentNote--;
        }
        socket.to('admin').emit('note',currentNote)
        io.emit('note',currentNote);
    }
    
    socket.on('disconnect',()=>{
    });
};
