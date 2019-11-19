'use strict';

const PLUGIN_NAME = 'gulp-sass-variables';

const PluginError = require('plugin-error');
const through = require('through2');

const getVariablesBuffer = function(sassVariables, file) {
  let str = '';
  
  for(let variable in sassVariables) {
    str += variable + ': ' + sassVariables[variable] + ';\n';
  }

  return new Buffer(str, file);
}

module.exports = function(sassVariables) {

  return through.obj(function (file, encoding, cb) {

    if(file.isNull()) {
      return cb(null, file);
    }

    if(file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if(sassVariables && typeof sassVariables === 'object') {
      let variablesBuffer = getVariablesBuffer(sassVariables, file);
      file.contents = Buffer.concat([variablesBuffer, file.contents], variablesBuffer.length + file.contents.length);
    } else {
      return cb(new PluginError(PLUGIN_NAME, 'Variables object expected'));
    }

    return cb(null, file);

  });
};
