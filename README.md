# rmby

![npm](https://img.shields.io/npm/v/rmby)
[![Build Status](https://travis-ci.org/yduman/rmby.svg?branch=master)](https://travis-ci.org/yduman/rmby)
[![codecov](https://codecov.io/gh/yduman/rmby/branch/master/graph/badge.svg)](https://codecov.io/gh/yduman/rmby)
![NPM](https://img.shields.io/npm/l/rmby)

rmby ("remove by") is a zero-dependency Node.js library with a fluent interface for removing files asynchronously by certain aspects.

## Installation

Node.js v12 or higher is required

```console
$ npm i --save rmby
$ yarn add rmby
```

## Usage

The `remove` function is all you need. You can navigate yourself through the API by chaining functions, since the API provides a [fluent interface](https://martinfowler.com/bliki/FluentInterface.html). On the [API section](#api) you can see more details about the usage.

```js
// JavaScript
const { remove } = require("rmby");

// TypeScript
import { remove } from "rmby";
```

## API

In order to run your remove query, you have to call the `run()` method at the end of your function chain. This function will remove all files that match with your filter criteria and will return a `Promise<string[]>` containing every file path that has been removed. If your filter cannot find matches, it will just return an empty array and do nothing.

### Remove Files By Time

Files can be removed by a time difference in milliseconds, seconds, minutes or hours. The time difference is always checked against the current time.

```js
// Remove all files that are older than 12 hours
remove().from("/some/path/to/dir").byTime().olderThan(12).hours().run();
```

### Remove Files By Name

Files can be removed regarding its name without considering the file extension. You can remove files that match exactly, start with, end with, or include the name that you provide.

```js
// Remove all files that start with "React"
remove().from("/some/path/to/dir").byName().thatStartsWith("React").run();
```

### Remove Files By Extension

Files can be removed regarding their file extension. You can remove files that match exactly with the file extension you provide.

```js
// Remove all .log files
remove().from("/some/path/to/dir").byExtension(".log").run();
```

### Remove Files By Combination

Files can be removed by combining the available filters. Therefore you can create more specific filters for your use case.

```js
// Remove all log files that start with "app" and are older than 12 hours
remove()
  .from("/some/path/to/dir")
  .byName()
  .thatStartsWith("app")
  .and()
  .byExtension(".log")
  .and()
  .byTime()
  .olderThan(12)
  .hours()
  .run();
```

## Development

rmby is developed with [TypeScript](https://www.typescriptlang.org/). The `master` branch is used for development. Stable releases are always tagged with the latest version.

## Testing

rmby is using [Jest](https://jestjs.io/) as a JavaScript Testing Framework. For testing, run `npm test`. For code coverage, run `npm run test:cov`. We have currently 100% code coverage and aim to stick with it.

## Philosophy

The philosophy is to provide an easy to use library for file removal in Node.js, without dependencies and with a very declarative API. The fluent interface should guide the user through its use case.

## People

rmby is currently maintained by [Yadullah Duman](https://github.com/yduman)

## License

[MIT](LICENSE)
