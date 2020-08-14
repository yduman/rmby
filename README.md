# rmby

[![Build Status](https://travis-ci.org/yduman/rmby.svg?branch=master)](https://travis-ci.org/yduman/rmby)
[![codecov](https://codecov.io/gh/yduman/rmby/branch/master/graph/badge.svg)](https://codecov.io/gh/yduman/rmby)

rmby ("remove by") is a Node.js library for deleting files by certain aspects. The goal of this library is to provide a nice API for file removal, therefore making use of the builder pattern for convenient usage.

## Remove all files by a time aspect

The time difference is always checked against the current time. Files can be deleted by a time difference in milliseconds, seconds, minutes and hours. `olderThan` will return all deleted filenames.

```ts
import { Remove } from "rmby";

const remove = new Remove("/path/to/dir");

// async olderThan(threshold: number): string[]
await remove.byMilliseconds().olderThan(500);
await remove.bySeconds().olderThan(30);
await remove.byMinutes().olderThan(5);
await remove.byHours().olderThan(2);
```
