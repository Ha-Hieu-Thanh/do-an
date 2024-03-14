const io = require('socket.io-client');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlclR5cGUiOjIsInRpbWVTdGFtcCI6MTY5Nzc2NjcwMTEzMCwidG9rZW5UeXBlIjoiQUNDRVNTX1RPS0VOIiwiaWF0IjoxNjk3NzY2NzAxLCJleHAiOjE2OTg2MzA3MDF9.JXFWFcb0Hm-lZZ67tMCH-U3RuG4PbkhPPmyfJU7OuH4';

let socket = io(`http://localhost:3002/socket`, {
  extraHeaders: { authorization: token },
  transports: ['websocket', "polling"],
});

socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
  console.log({ err });

  if (err.message === 'Unauthorized') {
    console.log('Your access token is no longer active.');
  }
});

socket.on('connect', () => {
  console.log('onConnected');
  socket.emit('PING', { name: 'Nest' }, (data) => console.log(data));
  // socket.emit('GET_OR_CREATE_CONVERSATION_P2P', { targetId: 3 }, (data) => console.log(data));
  socket.on('mothai', (data) => {
    console.log(data);
  });

  // socket.emit(
  //   "getOrCreateP2PConversation",
  //   { targetId: 5 },
  //   (data) => {
  //     console.log(data);
  //     if (data.success) {
  //       // const message = {
  //       //   conversationId: "62ceca75166064a94738e9d7",
  //       //   type: 1,
  //       //   content: "Em an com roi?",
  //       //   payload: {},
  //       // };
  //       // // // Send message
  //       // socket.emit("sendMessage", message, (data) =>
  //       //   console.log("sendMessage", data)
  //       // );

  //       // Fetch message
  //       // socket.emit('fetchMessage', { conversationId: '6212075c2ec22033bf156444', takeAfter: null }, (data) =>
  //       //   console.log('sendMessage', data),
  //       // );
  //       // // Fetch conversations
  //       // socket.emit('fetchConversation', { takeAfter: null }, (data) => console.log('fetchConversation', data.data[0]));
  //       // // Fetch
  //       // socket.emit('getOrCreateP2PConversation', { targetId: '6' }, (data) =>
  //       //   console.log('getOrCreateP2PConversation', data.data),
  //       // );
  //     } else {
  //       console.log(data);
  //     }
  //   }
  // );

  socket.on('joinConversation', (data) => {
    console.log({ data });
  });
  // socket.emit("getOrCreateP2PConversation", { targetId: "3" }, (data) => {
  //   console.log("getOrCreateP2PConversation", data.data);
  // });

  // socket.disconnect();
});

socket.on('notification', (data) => {
  console.log(data);
});

socket.on('message', (data) => {
  console.log('onMessage', data);
});

socket.on('conversation', (data) => {
  console.log('onConversation', data);
});
socket.on('memberLeaveConversation', (data) => {
  console.log('memberLeaveConversation', data);
});

socket.on('exception', (data) => {
  console.log('exception', data);
});

socket.on('error', (data) => {
  console.log('error', data);
});
