const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const formatMessage = require('./utils/messages'); 
const {userJoin, getUser, userLeave, getRoomUsers} = require('./utils/users'); 
const { get } = require('https');

app.use(express.static(path.join(__dirname,'public')));

const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;
const admin = 'admin';
io.on('connection',(socket)=>
{

  socket.on('joinRoom', ({username, room})=>
  {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message',formatMessage(admin,'welcome to chatcord'));

    socket.broadcast
    .to(user.room)
    .emit('message',formatMessage(admin,`${user.username} has joined the chat`));
  

    io.to(user.room)
    .emit('roomUsers',
    {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

 
  socket.on('chatMessage',(msg)=>
  {
    const user = getUser(socket.id);

      io.
      to(user.room)
      .emit('message',formatMessage(user.username,msg));
  })

  socket.on('disconnect',()=>
  {
    const user = userLeave(socket.id);
    
    if(user)
    {
      io
      .to(user.room)
      .emit('message',formatMessage(admin,`${user.username}has left the chat`));
    };

    io.to(user.room)
    .emit('roomUsers',
    {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });


});

server.listen(PORT,()=>
{
  console.log(`Server running on PORT ${PORT}`);
})
