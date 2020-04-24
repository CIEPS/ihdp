'use strict';

module.exports = {
  tokenizer,
  parser,
  buildTree
};

function tokenizer (input) {
  const EOL = /\n/;
  const TAB = /\t/;

  const tokens = [];
  let position = 0;
  while (position < input.length) {
    let char = input[position];

    if (EOL.test(char)) {
      tokens.push({ type: 'eol', value: char, startPosition: position });
      char = input[++position];
      continue;
    }

    if (TAB.test(char)) {
      tokens.push({ type: 'tab', value: char, startPosition: position });
      char = input[++position];
      continue;
    }

    let value = '';
    const startPosition = position;
    while (!(EOL.test(char) || position > (input.length - 1))) {
      value += char;
      char = input[++position];
    }
    tokens.push({ type: 'data', value: value, startPosition });
  }

  return tokens;
}

function parser (tokens) {
  const output = [];
  let current = 0;
  while (current < tokens.length) {
    const result = { level: 0 };
    let token = tokens[current];
    if (token.type === 'tab') {
      let countTab = 0;
      while (token.type === 'tab') {
        countTab++;
        token = tokens[++current];
      }
      result.level = countTab;
    }
    if (token.type === 'data') {
      if (token.value.trim() === '') {
        current++;
        continue;
      }
      result.data = token.value;
    }
    if (token.type === 'eol') {
      current++;
      continue;
    }
    output.push(result);
    current++;
  }
  return output;
}

function buildTree (parsedContents) {
  const tree = {
    '-1': {
      data: 'root',
      children: []
    }
  };

  parsedContents
    // clean item with no data and item comments
    .filter(item => 'data' in item && !item.data.startsWith('--'))
    .map((item) => {
      item.children = [];
      tree[item.level] = item;
      tree[item.level - 1].children.push(item);
    });
  return tree['-1'];
}
