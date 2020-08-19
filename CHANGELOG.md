# Changelog

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

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

[unreleased]: https://github.com/yduman/rmby/compare/1.0.2...master
[0.0.2]: https://github.com/yduman/rmby/releases/tag/0.0.2
[0.0.3]: https://github.com/yduman/rmby/releases/tag/0.0.3
[0.1.0]: https://github.com/yduman/rmby/releases/tag/0.1.0
[1.0.0]: https://github.com/yduman/rmby/releases/tag/1.0.0
[1.0.1]: https://github.com/yduman/rmby/releases/tag/1.0.1
[1.0.2]: https://github.com/yduman/rmby/releases/tag/1.0.2
