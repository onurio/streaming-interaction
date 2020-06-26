const io = require('./index.js').io;

const initial = {
    zabumba:{
            1: 0,
            2: 0,
            3: 0
    },
    agogo:{
            1: 0,
            2: 0,
            3: 0
    },
    ganza:{
            1: 0,
            2: 0,
            3: 0
    },
    pandeiro:{
            1: 0,
            2: 0,
            3: 0
    },
    triangulo:{
            1: 0,
            2: 0,
            3: 0
    }
};



let polling = {...initial};

let currentNote = 36;

module.exports = (socket) =>{

    socket.on('vote',({inst,state})=>{        
      polling = {...polling,[inst]:{...polling[inst],[state]:polling[inst][state]+1}};
      io.emit('results',polling);
    })


    socket.on('adminJoined',()=>{

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
            let max = {index:'1',val:polling[name]['1']};
            Object.keys(polling[name]).forEach(samp=>{
                if(polling[name][samp]>max.val){
                    max = {index:samp,val:polling[name][samp]}                    
                }
            })
            calculatedResults[index]= max.index;
        });
        io.to('admin').emit('finalResults',calculatedResults)
        // io.emit('note',currentNote);
    }
    
    socket.on('disconnect',()=>{
    });
};
