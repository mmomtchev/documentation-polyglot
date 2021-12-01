import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plugin = path.join(__dirname, '..', 'index.js');
const fixture = path.join(__dirname, 'fixture');

function documentation(args, options, parseJSON) {
  if (!options) {
    options = {};
  }
  if (!options.cwd) {
    options.cwd = __dirname;
  }

  options.maxBuffer = 1024 * 1024;

  args.unshift('node ' + path.join(__dirname, '..', 'node_modules', '.bin', 'documentation'));

  return new Promise((resolve, reject) => {
    exec(args.join(' '), options, function (err, stdout, stderr) {
      if (err) {
        err.stderr = stderr;
        return reject(err);
      }
      if (parseJSON === false) {
        resolve(stdout);
      } else {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

function normalize(result) {
  result.forEach(function (item) {
    item.context.file = '[path]';
  });
  return result;
}

test('specifying the plugin on the command-line', async function () {
  const data = await documentation([
    `build ${fixture}/infered.js ${fixture}/simple.input.js ${fixture}/blend.cpp --plugin=${plugin}`
  ]);
  expect(normalize(data)).toMatchSnapshot();
});

test('specifying the plugin via a config file', async function () {
  const data = await documentation([
    `build ${fixture}/infered.js ${fixture}/simple.input.js ${fixture}/blend.cpp --config=${fixture}/polyglot.yml`
  ]);
  expect(normalize(data)).toMatchSnapshot();
});

test('specifying extensions in a config file', async function () {
  const data = await documentation([
    `build ${fixture}/infered.js ${fixture}/simple.input.js ${fixture}/blend.cpp --config=${fixture}/noext.yml`
  ]);
  expect(normalize(data)).toMatchSnapshot();
});