const qs = require("querystring");

// Needed to parse form post data
function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk;
    });
    req.on("end", function () {
      const parsedBody = qs.parse(body);
      resolve(parsedBody);
    });
  });
}
module.exports = parseBody;
