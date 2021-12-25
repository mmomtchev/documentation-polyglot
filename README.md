# documentation-polyglot.js

<p align="center">
  <img src="https://raw.githubusercontent.com/documentationjs/documentation/master/.github/documentation-js-logo.png" width="650" />
</p>

<p align="center">
  The documentation system for modern JavaScript
</p>

***When good engineers meet, they discuss algorithms, but when great engineers meet, they discuss documentation***

[![License: ISC](https://img.shields.io/github/license/mmomtchev/documentation-polyglot)](https://github.com/mmomtchev/documentation-polyglot/blob/master/LICENSE)
[![Node.js CI](https://github.com/mmomtchev/documentation-polyglot/actions/workflows/node.js.yml/badge.svg)](https://github.com/mmomtchev/documentation-polyglot/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/mmomtchev/documentation-polyglot/branch/master/graph/badge.svg?token=NUOEAMLXG2)](https://codecov.io/gh/mmomtchev/documentation-polyglot)

# Plugin Notes

This plugin restores the C++ support for `documentation.js`.

**It requires a plugin framework in `documentation.js` that has yet to be merged**. You can install it from here:

```
npm install -D @mmomtchev/documentation
```

It is an improved version of the old `--polyglot` CLI option of `documentation.js` that got axed in 2017.

The project should already be usable.

It uses *dumb* parsing without an AST blindly extracting JSDoc-compliant comment blocks.

I intend to add extensible helpers allowing to extract some (*C++ is notoriously difficult to parse and this aims to be an universal extractor anyways*) information from the C++ code.

# Installation

The module is not yet published

```
npm install -D documentation-polyglot
```

# Usage

Note that enabling `documentation-polyglot` will also enable `--shallow` if this is not already the case.

## Loading via the command-line

```
documentation build --plugin=documentation-polyglot src/*.cpp lib/*.js -f md -o project.md
```

## Loading via a configuration file

```
documentation build --config=project-documentation.yml src/*.cpp lib/*.js -f md -o project.md
```

`project-documentation.yml`:
```yml
toc:
  - Project Headline

plugin:
  - documentation-polyglot

documentation-polyglot:
  extensions: [ .cpp ]
```

## Extracting information from C++ code

An example for extracting names of `Node::Nan` methods

```yml
documentation-polyglot:
  extensions: [ .cpp ]
  infer:
    kind:
      function: [ NAN_METHOD\(.*\) ]
    name: [ NAN_METHOD\s*\((.*)\) ]
```

An `infer` section applies an implicit JSDoc tag to the tag having the section name:
 * with subsections it will apply the subsection name when one of the provided REs matches.
 * with only REs it will apply the first capture group
