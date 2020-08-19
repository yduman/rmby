# API Realization

#### Here you will find the API that is planned to be designed and its completion status

#### ⚠️ Notice that this list is no final status and can be extended at any time

- [x] byMilliseconds, bySeconds, byMinutes, byHours
  - [x] olderThan
- [ ] byName
  - [x] thatEquals
  - [x] thatStartsWith
  - [x] thatEndsWith
  - [x] thatIncludes
  - [ ] thatMatches
  - [ ] thatContainsSpaces
  - [ ] thatContainsSpecialChars
- [x] byExtension
  - [x] thatEquals
- [ ] recursively
- [x] combinations

## New API structure without classes

```js
export function removeFiles() {
  return { from };
}

function from() {
  return { byTime, byName, byExtension };
}

function byTime() {
  return { inMilliseconds, inSeconds, inMinutes, inHours };
}

function byName() {
  return { thatEquals, thatStartsWith, thatEndsWith, thatIncludes };
}

function byExtension() {
  return { run, and };
}

function inMilliseconds() {
  return { olderThan };
}

function inSeconds() {
  return { olderThan };
}

function inMinutes() {
  return { olderThan };
}

function inHours() {
  return { olderThan };
}

function olderThan() {
  return { run, and };
}

function thatEquals() {
  return { run, and };
}

function thatStartsWith() {
  return { run, and };
}

function thatEndsWith() {
  return { run, and };
}

function thatIncludes() {
  return { run, and };
}

function and() {
  return { byTime, byName, byExtension };
}

function run() {
  console.log("run");
}
```
