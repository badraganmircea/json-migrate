const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');

const {
  lstatSync,
  readdirSync
} = require('fs');
const {
  join
} = require('path');


const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory);

class _events extends events {};

const e = new _events();

const cli = {};

cli.processInput = function(str) {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  if (!str) return;
  const uniqueInputs = [
    'help',
    'exit',
    'listversions'
  ];

  let matchedFount = false;
  let matchCount = 0;

  uniqueInputs.some(function(input) {
    if (str.toLowerCase().indexOf(input) > -1) {
      matchedFount = true;
      e.emit(input, str);
      return true;
    }
  })

  if (!matchedFount) {
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
})

cli.responders = {};

cli.responders.help = function() {
  console.log('TODO-you asked for help..');
}

cli.responders.listVersions = function() {
  console.log(getDirectories('./mutations'));
}

cli.responders.exit = function() {
  process.exit(0);
}

cli.init = function() {
  console.log('\x1b[34m%s\x1b[0m', 'the cli is running');

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

  _interface.on('close', function() {
    process.exit(0);
  })
}

module.exports = cli;