# rmby

![npm](https://img.shields.io/npm/v/rmby)
[![Build Status](https://travis-ci.org/yduman/rmby.svg?branch=master)](https://travis-ci.org/yduman/rmby)
[![codecov](https://codecov.io/gh/yduman/rmby/branch/master/graph/badge.svg)](https://codecov.io/gh/yduman/rmby)
![NPM](https://img.shields.io/npm/l/rmby)

rmby ("remove by") is a zero-dependency Node.js library with a fluent interface for removing files asynchronously by certain aspects.

- [rmby](#rmby)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
    - [Remove Files By Time](#remove-files-by-time)
    - [Remove Files By Name](#remove-files-by-name)
    - [Remove Files By Extension](#remove-files-by-extension)
    - [Remove Files By Combination](#remove-files-by-combination)
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

The `RemoveFiles` class is all you need. You can navigate yourself through the API by chaining methods, since the API provides a [fluent interface](https://martinfowler.com/bliki/FluentInterface.html). On the [API section](#api) you can see more details about the usage.

```js
// JavaScript
const { RemoveFiles } = require("rmby");

// TypeScript
import { RemoveFiles } from "rmby";
```

## API

In order to run your remove query, you have to call the `run()` method at the end of your chain. This method will remove all files that match with your filter criteria's and will return a `Promise<string[]>` containing every file path that has been removed.

### Remove Files By Time

Files can be removed by a time difference in milliseconds, seconds, minutes or hours. The time difference is always checked against the current time.

```js
// Remove all files that are older than 12 hours
async () =>
  await new RemoveFiles().from("/some/path/to/dir").byTime().inHours().olderThan(12).run();
```

### Remove Files By Name

Files can be removed regarding its name without considering the file extension. You can remove files that match exactly, start with, end with, or include the name that you provide.

```js
// Remove all files that start with "React"
async () =>
  await new RemoveFiles().from("/some/path/to/dir").byName().thatStartsWith("React").run();
```

### Remove Files By Extension

Files can be removed regarding their file extension. You can remove files that match exactly with the extension you provide.

```js
// Remove all .log files
async () => await new RemoveFiles().from("/some/path/to/dir").byExtension(".log").run();
```

### Remove Files By Combination

Files can be removed by combining the available filters. Therefore you can create more specific filters for your remove use case.

```js
// Remove all JS files that start with "f" and are older than 12 hours
async () =>
  await new RemoveFiles()
    .from("/some/path/to/dir")
    .byName()
    .thatStartsWith("f")
    .and()
    .byExtension(".js")
    .and()
    .byTime()
    .inHours()
    .olderThan(12)
    .run();
```

## Development

rmby is developed with [TypeScript](https://www.typescriptlang.org/). The `master` branch is used for development. Stable releases are always tagged with the latest version.

## Testing

rmby is using [Jest](https://jestjs.io/) as a JavaScript Testing Framework. For testing, run `npm test`. For code coverage, run `npm run test:cov`. We have currently 100% code coverage and aim to stick with it.

## Philosophy

The philosophy is to provide an easy to use library without dependencies for file removal in Node.js with a high declarative API. The fluent interface should guide the user through its use case.

## People

rmby is currently maintained by [Yadullah Duman](https://github.com/yduman)

## License

[MIT](LICENSE)
