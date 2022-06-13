const socket = io();
const form = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search,
  {
    ignoreQueryPrefix : true 
  });

socket.emit('joinRoom',{username, room});

socket.on('message',(message)=>
{
  console.log(message);
  output(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


socket.on('roomUsers',({room, users})=>
{
  outputRoomName(room);
  outputUsers(users);
});

form.addEventListener('submit',(e)=>
{
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage',msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});  

function output(message)
{
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room)
{ 
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
}); 