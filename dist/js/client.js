let BatchQueue = (() => {
  const addBatchFAB = document.getElementById('newBatchButton');
  const BATCH_LIST = document.getElementById('batchList');
  const newBatchNameInput = document.getElementById('newBatchName');
  const newBatchDPCISInput = document.getElementById('newBatchDPCIS');
  const newBatchEachesInput = document.getElementById('newBatchEaches');
  const newBatchOwnerInput = document.getElementById('newBatchOwner');
  const submitNewBatchButton = document.getElementById('submitNewBatchButton');
  const newBatchForm = document.getElementById('newBatchForm');
  const cancelNewBatchButton = document.getElementById('cancelNewBatchButton');

  let addBatchOverlayOpen = false;

  let toggleAddBatchOverlay = () => {
    if (addBatchOverlayOpen) {
      newBatchForm.style.left = "100%";
    } else {
      newBatchForm.style.left = "0px";
    }
    newBatchNameInput.value = "";
    newBatchDPCISInput.value = "";
    newBatchEachesInput.value = "";
    newBatchOwnerInput.value = "";
    addBatchOverlayOpen = !addBatchOverlayOpen;
  };
  addBatchFAB.addEventListener('click', toggleAddBatchOverlay, false);
  cancelNewBatchButton.addEventListener('click', toggleAddBatchOverlay, false);

  /*
    Specify the URI for the server that is hosting the chat
  */
  const SERVER = {
    connected: false,
    url: window.location.hostname
  };

  console.log(SERVER.url);
  // Workaround only for the purpose of browser-sync
  if (SERVER.url.indexOf("localhost") > 1) {
    SERVER.url = "http://localhost:8080";
  }
  console.log(SERVER.url);

  // socket
  let socket = null;
  let SOCKET_CALLBACKS = {};

  let batchQueueBuffer = [];
  /*
    SOCKET_CALLBACKS.onConnected receives confirmation that we have successfully
    connected to the chat server and sends back the username we wish the server
    to use
  */
  SOCKET_CALLBACKS.onConnected = batchQueue => {
    batchQueueBuffer = batchQueue;
    for (var i = 0; i < batchQueue.length; i++) {
      var batch = batchQueue[i];
      batchList.appendChild(createBatchUI(batch));
    }
  };

  SOCKET_CALLBACKS.onBatchAdded = batchOptions => {
    batchQueueBuffer.push(batchOptions);
    BATCH_LIST.appendChild(createBatchUI(batchOptions));
  };

  SOCKET_CALLBACKS.onBatchComplete = batchOptions => {
    for (var i = 0; i < batchQueueBuffer.length; i++) {
      let batch = batchQueueBuffer[i];
      if (JSON.stringify(batchOptions) == JSON.stringify(batch)) {
        let batchElems = BATCH_LIST.getElementsByClassName('batch');
        batchElems[i].remove();
        batchQueueBuffer.splice(i, 1);
        break;
      }
    }
  };

  SOCKET_CALLBACKS.onBatchCancelled = batchOptions => {
    for (var i = 0; i < batchQueueBuffer.length; i++) {
      let batch = batchQueueBuffer[i];
      if (JSON.stringify(batchOptions) == JSON.stringify(batch)) {
        let batchElems = BATCH_LIST.getElementsByClassName('batch');
        batchElems[i].remove();
        batchQueueBuffer.splice(i, 1);
        break;
      }
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
    console.log(SERVER.url);
    socket = io.connect("http://" + SERVER.url + ":8080");
    /*
      Add the event listeners to the cosket
    */
    socket.on('connected', SOCKET_CALLBACKS.onConnected);
    socket.on('newBatch', SOCKET_CALLBACKS.onBatchAdded);
    socket.on('batchComplete', SOCKET_CALLBACKS.onBatchComplete);
    socket.on('batchCancelled', SOCKET_CALLBACKS.onBatchCancelled);
  };

  let addBatch = () => {
    if (!socket) return;

    let values = {
      name: newBatchNameInput.value,
      DPCIS: newBatchDPCISInput.value,
      eaches: newBatchEachesInput.value,
      owner: newBatchOwnerInput.value
    };

    let areYouSure = confirm("Are you sure you want to submit " + values.name + "?");
    if (!areYouSure) return;

    socket.emit('newBatch', values);
  };

  let cancelBatch = batchOptions => {
    if (!socket) return;
    let areYouSure = confirm("Are you sure you want to cancel " + batchOptions.name + "?");

    if (!areYouSure) return;

    socket.emit('batchCancelled', batchOptions);
  };

  let completeBatch = batchOptions => {
    if (!socket) return;
    let areYouSure = confirm("Are you sure you've completed " + batchOptions.name + "?");
    if (!areYouSure) return;

    socket.emit('batchComplete', batchOptions);
  };

  submitNewBatchButton.addEventListener('click', e => {
    addBatch();
    toggleAddBatchOverlay();
  }, false);
  let createBatchUI = batchOptions => {
    let batch = document.createElement('div');
    batch.className = "batch";

    let batchName = document.createElement('div');
    batchName.className = "batchName";
    batchName.innerText = batchOptions.name;

    batch.appendChild(batchName);

    let batchStats = document.createElement("div");
    batchStats.className = "batchStats";

    let batchDPCIS = document.createElement("div");
    batchDPCIS.className = "batchDPCIS";
    batchDPCIS.innerText = "DPCIs: " + batchOptions.DPCIS;

    let batchEaches = document.createElement("div");
    batchEaches.className = "batchEaches";
    batchEaches.innerText = "Eaches: " + batchOptions.eaches;

    batchStats.appendChild(batchDPCIS);
    batchStats.appendChild(batchEaches);

    batch.appendChild(batchStats);

    let batchOwner = document.createElement("div");
    batchOwner.className = "batchOwner";
    batchOwner.innerText = "Owner: " + batchOptions.owner;

    batch.appendChild(batchOwner);

    let controls = document.createElement("div");
    controls.className = "controls";

    let completeButton = document.createElement("div");
    completeButton.className = "completeButton";
    completeButton.innerText = "Complete";

    let cancelButton = document.createElement("div");
    cancelButton.className = "cancelButton";
    cancelButton.innerText = "Cancel";

    completeButton.addEventListener('click', e => {
      completeBatch(batchOptions);
      console.log("s");
    }, false);

    cancelButton.addEventListener('click', e => {
      cancelBatch(batchOptions);
      console.log("sd");
    }, false);

    controls.appendChild(cancelButton);
    controls.appendChild(completeButton);

    batch.appendChild(controls);

    return batch;
  };

  return {
    connect: connect
  };
})();

BatchQueue.connect();