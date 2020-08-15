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
    - [Remove files by time](#remove-files-by-time)
    - [Remove files by name](#remove-files-by-name)
    - [Remove files by file extension](#remove-files-by-file-extension)
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

The last method of the fluent API returns always a `Promise<string[]>` containing every filepath that has been removed.

### Remove files by time

Files can be deleted by a time difference in milliseconds, seconds, minutes and hours. The time difference is always checked against the current time.

```js
async () => await new Remove("/path/to/dir").byMilliseconds().olderThan(500);
async () => await new Remove("/path/to/dir").bySeconds().olderThan(30);
async () => await new Remove("/path/to/dir").byMinutes().olderThan(5);
async () => await new Remove("/path/to/dir").byHours().olderThan(2);
```

### Remove files by name

Files can be deleted regarding its name without the file extension. Delete files that match exactly, start with, end with, or include the name that you provide.

```js
async () => await new Remove("/path/to/dir").byName().thatEquals("filename");
async () => await new Remove("/path/to/dir").byName().thatStartsWith("file");
async () => await new Remove("/path/to/dir").byName().thatEndsWith("name");
async () => await new Remove("/path/to/dir").byName().thatIncludes("lena");
```

### Remove files by file extension

```js
async () => await new Remove("/path/to/dir").byExtension().thatEquals(".txt");
```

## Development

rmby is developed with [TypeScript](https://www.typescriptlang.org/). The `master` branch is used for development. Stable releases are always tagged with the latest version.

## Testing

rmby is using [Jest](https://jestjs.io/) as a JavaScript Testing Framework. For testing, run `npm test`. For code coverage, run `npm run test:cov`. The goal is to stick with 100% code coverage.

## Philosophy

The philosophy is to provide an easy to use library without dependencies for file removal in Node.js with a high declarative API. The fluent interface should guide the user through its use case.

## People

rmby is currently maintained by [Yadullah Duman](https://github.com/yduman)

## License

[MIT](LICENSE)
