# Changelog

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [1.1.1] - 2020-09-02

### Changed

- Updated development libraries that are now compatible with version 4 of TypeScript
- Previously, when executing `run()` it would throw an error if the filter couldn't find anything. This feels wrong, because it can be totally fine if the filter doesn't find anything. Now the function will return an empty array if the filter could not find any results.

### Fixed

- Tests for filters that don't find matches

### Removed

- Tests for cases when `fs` functions fail for some reason. These tests were kind of useless and now obsolete since in case of failure we don't delete anything and just return an empty array.

## [1.1.0] - 2020-08-24

### Added

- When your filter criteria does not match with any files it will throw an error and notify you

### Changed

- The API got refactored from classes to functions. The library now just exposes the function `remove` which can be invoked for chaining. The `byTime` part of the API got a small change with the chaining order leading to this **breaking change**. Now after calling `byTime`, you need to call `olderThan` and than you can specify your desired time unit.

```diff
- new RemoveFiles().from("/some/path").byTime().inHours().olderThan(12).run()
+ remove().from("/some/path").byTime().olderThan(12).hours().run()
```

### Fixed

- Fixed a bug where the combination of filters would produce an incorrect filter result

### Removed

- Classes from the old API

## [1.0.2] - 2020-08-19

### Changed

- Simplified time difference calculation

### Fixed

- Making proper use of `Promise.all`

## [1.0.1] - 2020-08-18

### Changed

- Making use of `fs.promises` instead of `promisify`

## [1.0.0] - 2020-08-17

### Added

- New and more fine granular API that is composable (see examples below)
- Chain of Responsibility Pattern for dealing with filter criteria's
- `run()` needs to be called at the end of the chain in order to execute removal

```js
import { RemoveFiles } from "rmby";

// Remove By Time
new RemoveFiles().from("/some/dir").byTime().inMilliseconds().olderThan(1200).run();
new RemoveFiles().from("/some/dir").byTime().inSeconds().olderThan(90).run();
new RemoveFiles().from("/some/dir").byTime().inMinutes().olderThan(150).run();
new RemoveFiles().from("/some/dir").byTime().inHours().olderThan(18).run();

// Remove By Name
new RemoveFiles().from("/some/dir").byName().thatEqualsTo("index").run();
new RemoveFiles().from("/some/dir").byName().thatStartsWith("ind").run();
new RemoveFiles().from("/some/dir").byName().thatEndsWith("dex").run();
new RemoveFiles().from("/some/dir").byName().thatIncludes("nde").run();

// Remove By Extension
new RemoveFiles().from("/some/dir").byExtension(".js");

// Remove By Combination
new RemoveFiles()
  .from("/some/dir")
  .byName()
  .thatStartsWith("ind")
  .and()
  .byExtension(".js")
  .and()
  .byTime()
  .inMinutes()
  .olderThan(15)
  .run();
```

### Changed

- Re-organized tests for more modularity

### Removed

- Replaced/Removed API state of [0.1.0]

## [0.1.0] - 2020-08-15

### Added

- `byExtension().thatEquals(string)`

## [0.0.3] - 2020-08-15

### Added

- `byName().thatStartsWith(string)`
- `byName().thatEndsWith(string)`
- `byName().thatIncludes(string)`

### Changed

- `byName().equalTo(string)` is now `byName().thatEquals(string)` to conform the rest of the `byName()` API

## [0.0.2] - 2020-08-15

### Added

- `byName()`
  - `equalTo(string)`
    - This method will check for filename equality and remove the file

### Changed

- `calcTimeDiff` is no longer exported

### Removed

- Tests for `calcTimeDiff`, since it is no longer exported and is tested implicitly anyway

[unreleased]: https://github.com/yduman/rmby/compare/1.1.1...master
[0.0.2]: https://github.com/yduman/rmby/releases/tag/0.0.2
[0.0.3]: https://github.com/yduman/rmby/releases/tag/0.0.3
[0.1.0]: https://github.com/yduman/rmby/releases/tag/0.1.0
[1.0.0]: https://github.com/yduman/rmby/releases/tag/1.0.0
[1.0.1]: https://github.com/yduman/rmby/releases/tag/1.0.1
[1.0.2]: https://github.com/yduman/rmby/releases/tag/1.0.2
[1.1.0]: https://github.com/yduman/rmby/releases/tag/1.1.0
[1.1.1]: https://github.com/yduman/rmby/releases/tag/1.1.1
