var glob = require('glob');
var pangu = require('pangu');
var Rx = require('rx');
var fs = require('fs');

var listFiles = Rx.Observable.fromNodeCallback(glob);

var pattern = Rx.Observable.just('docs/**/*.md');
var source = pattern.selectMany(function(_pattern) {
  return listFiles(_pattern);
});

source.subscribe(function(filename) {
  console.log(`「${JSON.stringify(filename)}」`);
});
