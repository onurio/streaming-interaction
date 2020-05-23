const maxApi  = require('max-api');
const io = require('socket.io-client');


let appName = undefined;
let socket;

maxApi.addHandler('connect',(url)=>{
    socket = io(url);
    socket.emit('adminJoined');
    socket.on('reconnect',(times)=>{
        console.log(`reconnected ${times} times`);
        socket.emit('adminJoined');   
    })

    socket.on('note',(value)=>{
        maxApi.outlet(value);
    })
    // socket.on('users',(users)=>maxApi.outlet(users));
});


maxApi.addHandler('disconnect',()=>{
    socket.close();
});

maxApi.addHandler('startPoll',()=>{        
    socket.emit('triggerPoll');
})

maxApi.addHandler('stopPoll',()=>{
    socket.emit('stopPoll');
})