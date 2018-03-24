const checkForSession = require("../lib/checkForSession");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const parseBody = require("../lib/parseBody")

module.exports = async (req, res, db) => {
  if(req.url == '/game'){
    const sessionUser = await checkForSession(req, db);

    if(req.method === 'GET'){
      let html = await readFile("views/game.html");
      if(sessionUser){
        // Update games.html to contain the gameId
        html += `
          <script>
            document.getElementById('game1').textContent = "`+sessionUser.gameId+`";
          </script>
        `;
        console.log(sessionUser.gameId);

        res.end(html);
        return true; // Exit Function
      }else{
        // User is not logged in?
        console.log('No session found. Redirecting user to login');
        res.setHeader("Location", "/login");
        res.statusCode = 302;
        res.end();
      }
    }
  }
}
