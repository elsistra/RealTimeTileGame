const parseCookie = require("../lib/parseCookie");
const ObjectId = require("mongodb").ObjectId;

// Read Cookie information to determine if user is logged in
async function checkForSession(req, db){
  const cookie = parseCookie(req);
  // If the user has a session
  if(cookie.session){
    const session = await db.collection("sessions").findOne({_id: new ObjectId(cookie.session)});
    // If a session has been found based pm the cookies information
    if(session && session.userId){
      // Find the user row from the users table which contains the userID found in sessions
      return db.collection("users").findOne({_id: session.userId});
    }
  }
}
module.exports = checkForSession;
