const http = require("http");
const io = require("socket.io");
const MongoClient = require('mongodb').MongoClient;
const checkForSession = require("./lib/checkForSession");

// ROUTE HANDLERS BELOW THIS LINE -----------------------------------------------------------------------------
const routes = [
  require("./routes/public"),
  require("./routes/index"),
  require("./routes/register"),
  require("./routes/login"),
  require("./routes/dashboard"),
  require("./routes/new-game"),
  require("./routes/logout"),
  require("./routes/game"),
  require("./routes/leave-game"),
  require("./routes/join-game")
];


async function main() {
  // Create client instance
  const client = await MongoClient.connect("mongodb://localhost:27017");
  // Select Squarelords DB using client instance
  const db = client.db("squarelords");


  // Create HTTP Server
  const server = http.createServer(async function (req, res) {
    // Loops through routes until a route returns true
    for (let i = 0; i < routes.length; i++) {
      // NOTE: realtimeServer is valid here because this function is a child of the scope the realtimeServer
      // was defined in and the function does not execute until the server is listening and receiving requests.
      // This gives the realtimeServer the time it needed to be defined further down.
      if (await routes[i](req, res, db, realtimeServer)) { return; }
    }
    res.statusCode = 404;
    res.end("Not Found");
  });


  // REAL TIME SERVER EMITS AND LISTENERS HERE -------------------------------------------------------------
    const realtimeServer = io(server);
    realtimeServer.on('connect', function (socket) {
      // A client has connected to the realtime server.
      socket.on('fetch-games-list', async function () {
        const gamesList = await db.collection('games').find().toArray();
        socket.emit('games-list', gamesList);
      });
      socket.on('fetch-usersInGame-list', async function () {
         const sessionUser = await checkForSession(socket.handshake, db);
        if(sessionUser){
          // A list of users in the same game
          const usersInGameList = await db.collection('users').find({gameId: sessionUser.gameId}).toArray();
          console.log('usersInGame-list sent from server');
          socket.emit('usersInGame-list', usersInGameList);
        }
      });
      socket.on('fetch-squares-list', async function () {
         const sessionUser = await checkForSession(socket.handshake, db);
        if(sessionUser){
          // A list of squares in the game
          const squaresList = await db.collection('squares').find({gameId: sessionUser.gameId}).toArray();
          console.log('squares-list sent from server');
          socket.emit('squares-list', squaresList);
        }
      });
    });
  server.listen(8080);
}

main();
