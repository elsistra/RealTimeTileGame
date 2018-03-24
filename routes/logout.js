const fs = require("fs");
const util = require("util");
const parseCookie = require("../lib/parseCookie");

module.exports = async (req, res, db) => {
  if(req.url == '/logout'){
    if(req.method === 'GET'){
      const cookie = parseCookie(req);
      if(cookie.session !== undefined){
        res.setHeader("Set-Cookie", "session=" + cookie.session + "; Max-Age=0");
      }
    }
    console.log('User logged out');
    res.setHeader("Location", "/");
    res.statusCode = 302;
    res.end();
    return true; // Exit Function
  }
}
