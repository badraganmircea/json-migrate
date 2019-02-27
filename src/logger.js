const logger = {};

const colors = {
  info: '\x1b[33m',
  operation: '\x1b[32m',
  reset: '\x1b[0m',
  error: '\x1b[31m'
}

const alignment = 40;

logger.horizontalLine = function() {
  const width = process.stdout.columns;
  let line = '';
  for (let i = width; i > 0 ; i --) {
    line += '-'
  }
  console.log(`${colors.info}%s${colors.reset}`, line);
};

const _addPadding = function(padding) {
  let line = '';
  if (!padding) {
    return line;
  }

  for (let i = 0; i < padding; i++) {
    line += ' ';
  }

  return line;
}

const _addAlignment = function(text) {
  const width = process.stdout.columns;
  const spacesToBeAdded = alignment - text.length;
  let line = '';
  for (let i = spacesToBeAdded; i > 0; i--) {
    line+= ' ';
  }
  return line;
};

logger.info = function(text, padding, info = '') {
  const line = _addPadding(padding);
  const align = _addAlignment(text);
  console.log(`${colors.info}%s${colors.reset}`, line + text + align + info);
}

logger.operation = function(text, padding, info = '') {
  const line = _addPadding(padding);
  const align = _addAlignment(text);
  console.log(`${colors.operation}%s${colors.reset}`, line + text + align + info);
}

logger.success = function(text, padding, info = '') {
  const line = _addPadding(padding);
  const align = _addAlignment(text);
  console.log(`${colors.operation}%s${colors.reset}`, line + text + align + info);
}

logger.error = function(text, padding, info = '') {
  const line = _addPadding(padding);
  const align = _addAlignment(text);
  console.log(`${colors.error}%s${colors.reset}`, line + text + align + info);
}

logger.verticalSpace = function(spaces) {
  for (let i = spaces; i > 0; i--) {
    console.log(`${colors.reset}\n${colors.reset}`);
  }
}

module.exports = logger;
