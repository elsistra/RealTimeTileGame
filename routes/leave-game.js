// Remove Game from User's data
const checkForSession = require("../lib/checkForSession");
const fs = require("fs");
const util = require("util");
const parseCookie = require("../lib/parseCookie");

module.exports = async (req, res, db) => {
  if(req.url == '/leave-game'){
    const sessionUser = await checkForSession(req, db);
    if(sessionUser){
      // User is logged in, so we will remove them from game
      const filter = {_id: sessionUser._id};
      const update = {$set: {gameId: ''}};
      await db.collection("users").updateOne(filter, update);
      console.log('User has left the game');
      // Sender us back to dashboard
      res.setHeader("Location", "/dashboard");
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
