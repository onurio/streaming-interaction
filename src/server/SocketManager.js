const io = require('./index.js').io;


let initial = {};
let idRef = {};
let polling = {};

module.exports = (socket) =>{
    console.log(socket.id+' connected');
    socket.on('vote',({inst,clip})=>{
      polling = {...polling,[inst]:{...polling[inst],[clip.pos]:polling[inst][clip.pos]+1}};
      io.emit('results',polling);
    })


    socket.on('adminJoined',()=>{


        socket.on('clips',(clips)=>{
            let polls = {};
            idRef = {};
            Object.keys(clips).forEach(track=>{
                polls[track] = {};
                idRef[track] = {};
                clips[track].forEach(obj=>{
                    polls[track][obj.pos] = 0;
                    idRef[track][obj.pos] = obj.id;
                });
            })
            initial = {...polls};
            io.emit('clips',clips);
        })

        socket.join('admin');
        console.log('admin joined');
        
        socket.on('triggerPoll',()=>{
            polling = {...initial};
            io.emit('results',polling);
            io.emit('togglePoll',true);
        })
    
        socket.on('stopPoll',()=>{
            io.emit('results',polling);
            io.emit('togglePoll',false);
            endVote();
        })
    
    });


    const endVote=()=>{
        // emit vote end to all clients
        let calculatedResults = {};
        Object.keys(polling).forEach((name,index)=>{
            let max = {index:0,val:0};
            Object.keys(polling[name]).forEach(samp=>{
                if(polling[name][samp]>max.val){
                    max = {index:samp,val:polling[name][samp]}                    
                }
            })
            calculatedResults[name]= max.index;
        });
        let final = Object.keys(calculatedResults).map(name=>idRef[name][calculatedResults[name]]);
        io.to('admin').emit('finalResults',final);
        // io.emit('note',currentNote);
    }
    
    socket.on('disconnect',()=>{
    });
};
