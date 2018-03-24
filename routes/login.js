const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const parseBody = require("../lib/parseBody")

module.exports = async (req, res, db) => {
  if(req.url == '/login'){

    if(req.method === 'GET'){
      const html = await readFile("views/login.html");
      res.end(html);
      return true; // Exit Function
    }else if(req.method === 'POST'){
      const parsedBody = await parseBody(req);

      const user = await db.collection('users').findOne({username: parsedBody.user, pass: parsedBody.pass});
      if(user){
        const insertResult = await db.collection("sessions").insertOne({userId: user._id});
        res.setHeader("Set-Cookie", "session=" + insertResult.insertedId);
        console.log('User found, session set')
      }else{console.log("User not found.");}

      res.setHeader("Location", "/");
      res.statusCode = 302;
      res.end("Thanks for Logging In. Sending you to the homepage.");
      return true; // Exit Function
    }
  }
}
