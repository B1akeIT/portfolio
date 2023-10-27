var moment = require('moment');
var replace = require('replace-in-file');
var version = require("./package.json").version;

var buildVersion = moment().format("[1.]YYMMDD[.]HHmm");
const options = {
  files: "src/environments/environment.prod.ts",
  from: /buildVersion: '.*'/g,
  to: "buildVersion: '" + buildVersion + "'",
  allowEmptyPaths: false,
};

try {
  var changedFiles = replace.sync(options);
  console.log('Build version set: ', buildVersion);
  for (var i = 0; i < changedFiles.length; i++) {
    console.log('Changed Files: ', changedFiles[i].file);
    console.log('Changed: ', changedFiles[i].hasChanged);
  }
} catch (error) {
  console.error('Error occurred:', error);
}
