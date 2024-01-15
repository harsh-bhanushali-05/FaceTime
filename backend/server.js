const { Server } = require("socket.io");
const io = new Server(4000, {
    cors: true,
});

const userNameToSocketIdMap = new Map(); // map to store user and there socket id 
const socketIdToUserName = new Map();
io.on('connection', (socket) => {
    socket.on("Join", data => {
        const { userName, roomID } = data;
        userNameToSocketIdMap.set(userName, socket.id);
        socketIdToUserName.set(socket.id, userName);
        io.to(roomID).emit("Join", { userName, id: socket.id });
        socket.join(roomID);

        io.to(socket.id).emit("Join", data);
    })
    socket.on('Call-other-user', ({ to, offer }) => {
        // console.log(offer)
        io.to(to).emit('incomming-call', { from: socket.id, offer });
    })
    socket.on('call-accepted', ({ to, ans }) => {
        console.log(to);
        io.to(to).emit('call-accepted', { from: socket.id, ans })
    })
    socket.on('peer-nego', ({ to, offer }) => {
        io.to(to).emit('peer-nego', { from: socket.id, offer })
    })
    socket.on('peer:nego:done', ({ to, ans }) => {
        io.to(to).emit('peer:nego:final', { from: socket.id, ans })
    })
})