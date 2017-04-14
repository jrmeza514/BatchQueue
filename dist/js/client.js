let BatchQueue = (() => {
  /*
    CHAT_MESSAGES is the local cache for the messages broadcasted by the server.
    There is no limit specified for local chat buffer
  */
  let CHAT_MESSAGES = [];

  /*
    Specify the URI for the server that is hosting the chat
  */
  const SERVER = {
    connected: false,
    url: window.location.href
  };

  // Workaround only for the purpose of browser-sync
  if (SERVER.url.indexOf("localhost")) {
    SERVER.url = "http://localhost:8080";
  }

  // socket
  let socket = null;
  let SOCKET_CALLBACKS = {};

  /*
    SOCKET_CALLBACKS.onConnected receives confirmation that we have successfully
    connected to the chat server and sends back the username we wish the server
    to use
  */
  SOCKET_CALLBACKS.onConnected = batchQueue => {
    let batchList = document.getElementById('batchList');
    for (var i = 0; i < batchQueue.length; i++) {
      var batch = batchQueue[i];
      //batchList.innerHTML += "Name: " + batch.name + " DPCIS: " + batch.DPCIS + " Eaches: " + batch.eaches + " Owner: " + batch.owner + " <br/>";
    }
  };

  /*
    Create the Click listener if user decides to connect
  */
  let connect = () => {
    /*
      Check if there is an existing connection to the server
      and return if there is.
    */
    if (socket) {
      return;
    }
    /*
      Create a new socket to connect to the server
    */
    socket = io.connect(SERVER.url);
    /*
      Add the event listeners to the cosket
    */
    socket.on('connected', SOCKET_CALLBACKS.onConnected);
  };

  return {
    connect: connect
  };
})();

BatchQueue.connect();