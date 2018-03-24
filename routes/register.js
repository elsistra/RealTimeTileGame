const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const parseBody = require("../lib/parseBody")

module.exports = async (req, res, db) => {
  if(req.url == '/register'){

    if(req.method === 'GET'){
      const html = await readFile("views/register.html");
      res.end(html);
      return true; // Exit Function
    }else if(req.method === 'POST'){
      const parsedBody = await parseBody(req);
      if(parsedBody.pass1 && parsedBody.pass2 && parsedBody.user){
        if(parsedBody.pass1 === parsedBody.pass2){ // If password match
          const newUser = {username: parsedBody.user, pass: parsedBody.pass1};
          await db.collection("users").insertOne(newUser);
        }else{console.log('Passwords do not match');}
      }else{console.log('A field was left empty');}

      res.setHeader("Location", "/");
      res.statusCode = 302;
      res.end("Thanks for registering. Sending you to the homepage.");
      return true; // Exit Function
    }
  }
}
