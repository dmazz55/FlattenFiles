var fs = require('fs');
var async = require('async');
var util = require('util');

// MUST HAVE TRAILING '\\' IN START DIRECTORY!!!
var startDir = 'C:\\Users\\dmazzeo\\Desktop\\isagw\\test\\';

var getFiles = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      var fileDir = dir + '/' + file;
      fs.stat(fileDir, function(err, stat) {
        if (stat && stat.isDirectory()) {
          getFiles(fileDir, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push({ fileName: file, fullDir: fileDir });
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

getFiles(startDir, function(err, results) {
  if (err) throw err;
  async.each(results,function(file, next){
    console.log(getNewFilePath(file.fileName));
  	//fs.renameSync(file.fullDir,startDir + file.fileName);
  })
});

function getNewFilePath(fileName){
  return startDir.endsWith('\\') ? startDir + fileName : startDir + '\\' + fileName;
}