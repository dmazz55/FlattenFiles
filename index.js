var fs = require('fs')
    ,async = require('async')
    ,util = require('util')
    ,prompt = require('prompt')
    ,clc = require('cli-color')

require('string.prototype.endswith');


var Print = function(){
  this.magenta = function(text){
    console.log(clc.magentaBright(text));
  };
  this.white = function(text){
    console.log(clc.whiteBright(text));
  };
  this.cyan = function(text){
    console.log(clc.cyanBright(text));
  };
  this.red = function(text){
    console.log(clc.redBright(text));
  };
  this.yellow = function(text){
    console.log(clc.yellowBright(text));
  };
  this.green = function(text){
    console.log(clc.greenBright(text));
  };
  this.emptyLine = function(){
    console.log('');
  };
}

var p = new Print();
var startDir;

main();


function main(){
  p.emptyLine();
  p.magenta('-----------------------------------');
  p.magenta('         FlattenFiles v1.0')
  p.magenta('-----------------------------------'); 
  p.cyan('       The File Flattener! ... duh');
  p.emptyLine();
  p.yellow('Enter folder to flatten or \'exit\' to Quit');
  promptForInput();
}

function promptForInput(){
  prompt.start();
  prompt.get(['input'], function(err, result){
    startDir = result.input;
    startFlattening();
  });
}

var startFlattening = function(){
  getFiles(startDir, function(err, results) {
    if (err) throw err;
    async.each(results,function(file, next){
      console.log(getNewFilePath(file.fileName));
      fs.renameSync(file.fullDir,getNewFilePath(file.fileName));
    },function(err){
      if (err) p.red(err);
      p.green('Done!');
    })
  });
}

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

function getNewFilePath(fileName){
  return startDir.endsWith('\\') ? startDir + fileName : startDir + '\\' + fileName;
}