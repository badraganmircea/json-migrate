const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const mutateUtils = require('./utils');
const migrate = require('./mutate');
const logger= require('./logger');
const packageVersion = require('../package.json').version;

const {
  join
} = require('path');

class _events extends events {};

const e = new _events();

const cli = {};

cli.processInput = function(str) {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  if (!str) return;

  const uniqueInputs = [
    'help',
    'exit',
    'listversions',
    'migrate'
  ];

  let matchedFound = false;
  let matchCount = 0;

  uniqueInputs.some(function(input) {
    if (str.toLowerCase().indexOf(input) > -1) {
      matchedFound = true;
      e.emit(input, str);
      return true;
    }
  })

  if (!matchedFound) {
    console.log('specified command does not exist');
  }
};

e.on('help', function(str) {
  cli.responders.help();
});

e.on('exit', function(str) {
  cli.responders.exit();
});

e.on('listversions', function(str) {
  cli.responders.listVersions();
});

e.on('migrate', function(str) {
  cli.responders.migrate(str);
});

cli.responders = {};

cli.responders.help = function() {
  console.log('TODO-you asked for help..');
};

cli.responders.listVersions = function() {
  console.log(mutateUtils.getDirectories('./mutations'));
};

cli.responders.migrate = function(str) {
  // TODO: this parser logic in separate function
  const argumentsRegex = new RegExp(/("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g);
  let inputs;
  const gatheredInputs = {};

  do {
    // gather inputs
    inputs = argumentsRegex.exec(str);

    if (inputs) {
      if (inputs[0].indexOf('version') > -1) {
        gatheredInputs.version = inputs[0].split('=')[1];
      }
      if (inputs[0].indexOf('pathToMutations') > -1) {
        gatheredInputs.pathToMutations = inputs[0].split('=')[1];
      }
      if (inputs[0].indexOf('pathToInputConfigs') > -1) {
        gatheredInputs.pathToInputConfigs = inputs[0].split('=')[1];
      }
      if (inputs[0].indexOf('out') > -1) {
        gatheredInputs.out = inputs[0].split('=')[1];
      }
    }
  } while(inputs);

  migrate(gatheredInputs.pathToMutations, gatheredInputs.pathToInputConfigs, null, gatheredInputs.version, gatheredInputs.out);
}

cli.responders.exit = function() {
  process.exit(0);
};

cli.init = function() {
  logger.horizontalLine();
  logger.info('JSON-MIGRATE v'+ packageVersion);
  logger.horizontalLine();

  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  _interface.prompt();

  _interface.on('line', function(str) {
    cli.processInput(str);
    logger.verticalSpace(1);
    _interface.prompt();
  })

  _interface.on('close', function() {
    process.exit(0);
  })
}

module.exports = cli;
