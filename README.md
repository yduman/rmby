# rmby

![npm](https://img.shields.io/npm/v/rmby)
[![Build Status](https://travis-ci.org/yduman/rmby.svg?branch=master)](https://travis-ci.org/yduman/rmby)
[![codecov](https://codecov.io/gh/yduman/rmby/branch/master/graph/badge.svg)](https://codecov.io/gh/yduman/rmby)
![NPM](https://img.shields.io/npm/l/rmby)

rmby ("remove by") is a Node.js library with a fluent interface for removing files asynchronously by certain aspects.

- [rmby](#rmby)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
    - [Remove files by a time aspect](#remove-files-by-a-time-aspect)
      - [olderThan(number)](#olderthannumber)
    - [Remove files by a name aspect](#remove-files-by-a-name-aspect)
      - [equalTo(string)](#equaltostring)
  - [Development](#development)
  - [Testing](#testing)
  - [Philosophy](#philosophy)
  - [People](#people)
  - [License](#license)

## Installation

Node.js v10 or higher is required

```console
$ npm i --save rmby
$ yarn add rmby
```

## Usage

The `Remove` class is all you need. You can navigate yourself through the API by chaining methods, since the API follows the builder pattern. On the [API section](#api) you can see more details about the usage.

```js
// JavaScript
const { Remove } = require("rmby");

// TypeScript
import { Remove } from "rmby";
```

## API

### Remove files by a time aspect

The time difference is always checked against the current time. Files can be deleted by a time difference in milliseconds, seconds, minutes and hours. `olderThan` will return all deleted file paths.

#### olderThan(number)

`async olderThan(threshold: number): Promise<string[]>`

```js
import { Remove } from "rmby";
const remove = new Remove("/path/to/dir");

remove.byMilliseconds().olderThan(500);
remove.bySeconds().olderThan(30);
remove.byMinutes().olderThan(5);
remove.byHours().olderThan(2);
```

### Remove files by a name aspect

#### equalTo(string)

`async equalTo(nameValue: string): Promise<string[]>`

```js
import { Remove } from "rmby";
const remove = new Remove("/path/to/dir");

remove.byName().equalTo("filename");
```

## Development

rmby is developed with [TypeScript](https://www.typescriptlang.org/)

## Testing

rmby is using [Jest](https://jestjs.io/) as a JavaScript Testing Framework

```console
$ npm install
$ npm test
```

## Philosophy

The goal is to provide an easy to use library for file removal in Node.js with a high declarative API.

## People

rmby is currently maintained by [Yadullah Duman](https://github.com/yduman)

## License

[MIT](LICENSE)
