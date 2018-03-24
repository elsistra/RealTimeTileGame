// Add Game to User's data
const checkForSession = require("../lib/checkForSession");
const fs = require("fs");
const util = require("util");
const parseCookie = require("../lib/parseCookie");
const URL = require('url').URL;
const ObjectId = require("mongodb").ObjectId;

module.exports = async (req, res, db, rt) => {
  const urlObj = new URL(req.url, 'http://localhost');
  if(urlObj.pathname == '/join-game'){
    const sessionUser = await checkForSession(req, db);
    if(sessionUser){
      // User is logged in, so we will add them to game
      const gameId = urlObj.searchParams.get('id');
      const filter = {_id: sessionUser._id};
      const update = {$set: {gameId: new ObjectId(gameId)}};
      await db.collection("users").updateOne(filter, update);
      console.log('User has joined the game');
      rt.emit("new-game-joined", sessionUser);
      // Send user to game
      res.setHeader("Location", "/game");
      res.statusCode = 302;
      res.end();
      return true; // Exit Function
    }else{
      // User is not logged in
      console.log('No session found. Redirecting user to login');
      res.setHeader("Location", "/login");
      res.statusCode = 302;
      res.end();
    }
  }
}
