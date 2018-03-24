process.on("unhandledRejection", (error) => { throw error; });
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const parseCookie = require("../lib/parseCookie");
const checkForSession = require("../lib/checkForSession");
const ObjectId = require("mongodb").ObjectId;

module.exports = async (req, res, db) => {

  if(req.url == '/'){
    const sessionUser = await checkForSession(req, db);

    // Modify the index for logged in users
    let html = await readFile("views/index.html");
    if(sessionUser){
      html += `
        <script>
          document.getElementById('a-register').style.display = 'none';
          document.getElementById('a-login').style.display = 'none';
        </script>
      `;
    }else{
      html += `
        <script>
          document.getElementById('a-logout').style.display = 'none';
          document.getElementById('a-dashboard').style.display = 'none';
        </script>
      `;
    }
    res.end(html);

    return true; // Exit Function
  }
}
