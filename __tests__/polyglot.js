import * as fs from 'fs';
import * as path from 'path';
import { init, parse, shallow } from '../index.js';
import { fileURLToPath } from 'url';

import pluginAPI from 'documentation/src/plugin_api.js';
import { remark } from 'remark';
import removePosition from 'documentation/src/remark-remove-position.js';
const remarkParse = remark().use(removePosition).parse;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = { 'documentation-polyglot': { extensions: ['.cpp'] } };

test('polyglot', function () {
  const files = [
    path.resolve(path.join(__dirname, 'fixture', 'blend.cpp')),
    path.resolve(path.join(__dirname, 'fixture', 'simple.input.js'))
  ];
  init(config);

  expect(shallow(files[0])).toBeTruthy();
  const result = parse({
    file: files[0],
    source: fs.readFileSync(files[0], 'utf8')
  }, config, pluginAPI);
  delete result[0].context.file;
  delete result[0].context.sortKey;
  expect(result).toEqual([
    {
      errors: [],
      augments: [],
      examples: [],
      implements: [],
      properties: [],
      throws: [],
      todos: [],
      yields: [],
      sees: [],
      context: {
        loc: { end: { column: 2, line: 40 }, start: { column: 3, line: 35 } }
      },
      description: remarkParse('This method moves a hex to a color'),
      loc: { end: { column: 2, line: 40 }, start: { column: 3, line: 35 } },
      name: 'hexToUInt32Color',
      params: [
        {
          lineNumber: 3,
          title: 'param',
          name: 'hex',
          type: {
            name: 'string',
            type: 'NameExpression'
          }
        }
      ],
      returns: [
        {
          title: 'returns',
          description: remarkParse('color'),
          type: {
            name: 'number',
            type: 'NameExpression'
          }
        }
      ],
      tags: [
        {
          description: null,
          lineNumber: 2,
          name: 'hexToUInt32Color',
          title: 'name'
        },
        {
          description: null,
          lineNumber: 3,
          name: 'hex',
          title: 'param',
          type: {
            name: 'string',
            type: 'NameExpression'
          }
        },
        {
          description: 'color',
          lineNumber: 4,
          title: 'returns',
          type: {
            name: 'number',
            type: 'NameExpression'
          }
        }
      ]
    }
  ]);
  
  expect(shallow(files[1])).toBeFalsy();
  const jsresult = parse({
    file: files[1],
    source: fs.readFileSync(files[1], 'utf8')
  }, config, pluginAPI);
  expect(jsresult).toBeFalsy();
});
