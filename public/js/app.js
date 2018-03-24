console.log('app.js')

const socket = io();

var listElement1 = document.getElementById('gamesList');
if(listElement1){
  // Ask server for games data
  socket.emit('fetch-games-list');
  // Listen for games array replacement from server.
  socket.on('games-list', function (gamesArray) {
    var listElement1 = document.getElementById('gamesList');
    // For each user in Users array...
    gamesArray.forEach((game) => {
      const newElement = document.createElement('li');
      newElement.innerHTML += game._id + ' <a href="/join-game?id='+game._id+'">Join</a>';
      listElement1.appendChild(newElement);
    });
  });
  // Listen for creation of new games.
  socket.on('new-game-created', function (game) {
    const newElement = document.createElement('li');
    newElement.textContent = game._id;
    listElement1.appendChild(newElement);
  });
}

var listElement2 = document.getElementById('gameUsers');
if(listElement2){
  // Ask Server for List of users with certain gameId
  socket.emit('fetch-usersInGame-list');
  // Listen for creation of new games.
  socket.on('usersInGame-list', function (usersInGameArray) {
    usersInGameArray.forEach((user) => {
      const newElement = document.createElement('li');
      newElement.innerHTML += user._id + ' <a href="/">'+user.username+'</a>';
      listElement2.appendChild(newElement);
    });
  });
  // Listen for user joining the a game
  socket.on('new-game-joined', function (user) {
    const newElement = document.createElement('li');
    newElement.innerHTML += user._id + ' <a href="/">'+user.username+'</a>';
    listElement2.appendChild(newElement);
  });
}

var listElement3 = document.getElementById('mainGame');
if(listElement3){
  // Ask Server for List of squares with certain gameId
  socket.emit('fetch-squares-list');
  // Listen for response from server of squares
  socket.on('squares-list', function (squaresArray) {
    squaresArray.forEach((square) => {
      const newElement = document.createElement('div');
      newElement.className = 'square';
      newElement.id = 'square'+square.position;
      listElement3.appendChild(newElement);
    });
  });
  // Listen for square data updating for this gameid

}
