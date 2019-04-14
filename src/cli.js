const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const mutateUtils = require('./utils');
const migrate = require('./mutate');
const logger = require('./logger');
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
    logger.info('specified command does not exist; type help to see available commands');
  }
};

e.on('help', function(str) {
  cli.responders.help();
});

e.on('exit', function(str) {
  cli.responders.exit();
});

e.on('listversions', function(str) {
  cli.responders.listVersions(str);
});

e.on('migrate', function(str) {
  cli.responders.migrate(str);
});

cli.responders = {};

cli.responders.help = function() {
  console.log('asking for help...');
  logger.horizontalLine();

  // migrate
  logger.info('migrate');
  logger.info('\t--fromVersion', 0, 'version to upgrade FROM; this one included');
  logger.info('\t--toVersion', 0, 'version to upgrade TO; this one included');
  logger.info('\t--pathToMutations', 0, 'path to mutations file');
  logger.info('\t--pathToInputConfigs', 0, 'path to input configs files');
  logger.info('\t--out', 0, 'directory path to output the files after mutation');
  logger.info('\tEXAMPLE', 0, 'migrate --fromVersion=1 --toVersion=2 --pathToMutations=./mutations --pathToInputConfigs=./input --out=./out');
  logger.verticalSpace(1);

  logger.info('exit', 0, '\texits the cli');
  logger.horizontalLine();
};

cli.responders.listVersions = function() {
  try {
    console.log(mutateUtils.getDirectories('./mutations'));
  } catch (e) {
    logger.error('something went wrong, see the below stacktrace');
    console.log(e);
  }
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
      if (inputs[0].indexOf('fromVersion') > -1) {
        gatheredInputs.fromVersion = inputs[0].split('=')[1];
        if (!gatheredInputs.fromVersion) {
          logger.error('looks like you forgot to specify the version you want to upgrade FROM');
          logger.info('use migrate --fromVersion={versionToUpgrade} to specify the version or type help for more complete working example');
        }
      }
      if (inputs[0].indexOf('toVersion') > -1) {
        gatheredInputs.toVersion = inputs[0].split('=')[1];
        if (!gatheredInputs.toVersion) {
          logger.error('looks like you forgot to specify the version you want to upgrade TO');
          logger.info('use migrate --toVersion={versionToUpgrade} to specify the version or type help for more complete working example');
        }
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
  } while (inputs);

  try {
    migrate(gatheredInputs.pathToMutations, gatheredInputs.pathToInputConfigs, parseInt(gatheredInputs.fromVersion), parseInt(gatheredInputs.toVersion), gatheredInputs.out);
  } catch (e) {
    logger.error('something went wrong; see the below stackstrace');
    console.log(e);
  }
}

cli.responders.exit = function() {
  process.exit(0);
};

cli.initPrompt = function() {
  logger.horizontalLine();
  logger.info('JSON-MIGRATE v' + packageVersion);
  logger.horizontalLine();

  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  _interface.prompt();

  _interface.on('line', function(str) {
    cli.processInput(str);
    _interface.prompt();
  })
}

cli.init = function() {
  const argsLength = process.argv.length;
  const args = process.argv.slice(2, argsLength);
  const userInput = args.join(' ');
  cli.processInput(userInput);
}

module.exports = cli;