const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const parseBody = require("../lib/parseBody");
const checkForSession = require("../lib/checkForSession");

module.exports = async (req, res, db) => {
  if(req.url == '/dashboard'){
    if(req.method === 'GET'){
      // If user already has a game, send them to game.html
      const sessionUser = await checkForSession(req, db);
      if(sessionUser){
        // User is logged in, Check user for an existing game
        if(sessionUser.gameId){
          const gameId = sessionUser.gameId;
          console.log('Game found, sending user to Game');
          //Game Exists, send user to game page
          res.setHeader("Location", "/game");
          res.statusCode = 302;
          res.end();
          return true; // Exit Function
        }else{
          // Game does not exist, keep user on dashboard.js
          console.log('User has not yet joined a game');
          const html = await readFile("views/dashboard.html");
          res.end(html);
          return true; // Exit Function
        }
      }else{
        // User is not logged in, why are they on the dashboard?
        console.log('No session found. Redirecting user to login');
        res.setHeader("Location", "/login");
        res.statusCode = 302;
        res.end();
        return true; // Exit Function
      }
    }
  }
}
