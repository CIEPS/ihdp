#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const pkg = require(path.join(__dirname, '../package.json'));
const { tokenizer, parser, buildTree } = require('../src/ihdp.js');

program
  .version(pkg.version)
  .arguments('<file>')
  .description('parse file and build JSON tree')
  .action(function (file) {
    fs.stat(file, (error, stats) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      if (!stats.isFile()) {
        console.error('this is not a valid file');
        process.exit(1);
      }

      const data = fs.readFileSync(file, 'utf8');
      const tree = buildTree(parser(tokenizer(data)));
      console.log(JSON.stringify(tree, null, 2));
    });
  })
  .parse(process.argv);
