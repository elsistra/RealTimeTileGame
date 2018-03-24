const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const path = require('path');

// Match URLs which start with /a/ and extract rest of URL.
const publicRegExp = new RegExp("^/a/(.*)(\\..*)", "i");

// Match both forward and back slashes.
const slashesRegExp = new RegExp("/|\\\\", "g")

const contentTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
};

module.exports = async (req, res, db) => {
  if (publicRegExp.test(req.url)) {
    const result = publicRegExp.exec(req.url);
    const name = result[1].replace(slashesRegExp, path.sep);
    const ext = result[2];

    const unsafeAssetPath = name + ext;
    const realAssetPath = path.normalize(unsafeAssetPath);
    if (unsafeAssetPath !== realAssetPath) {
      console.log('Not allowing directory traversal', unsafeAssetPath, realAssetPath)
      // Not allowing directory traversal
      res.statusCode = 403; // Forbidden
      res.end();
      return true;
    }

    const contentType = contentTypes[ext];
    if (!contentType) {
      console.log('Not allowing unsupported file extensions')
      // Not allowing unsupported file extensions
      res.statusCode = 403; // Forbidden
      res.end();
      return true;
    }

    try {
      const filename = path.join(__dirname, '..', 'public', realAssetPath);
      console.log('Serving resource', { filename });
      const file = await readFile(filename);
      res.setHeader('Content-Type', contentType)
      res.end(file);
      return true;
    } catch (err) {
      console.error('Most likely a file not found error', err)
      // Most likely a file not found error
      res.statusCode = 404;
      res.end();
      return true;
    }
  }
}
