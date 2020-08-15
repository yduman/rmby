# Changelog

## [Unreleased]

### Added

- `byName().thatStartsWith(string)`
- `byName().thatEndsWith(string)`
- `byName().thatIncludes(string)`

### Changed

- `byName().equalTo(string)` is now `byName().thatEquals(string)` to conform the rest of the `byName()` API

### Fixed

### Removed

## [0.0.2] - 2020-08-15

### Added

- `byName()`
  - `equalTo(string)`
    - This method will check for filename equality and remove the file

### Changed

- `calcTimeDiff` is no longer exported

### Fixed

--

### Removed

- Tests for `calcTimeDiff`, since it is no longer exported and is tested implicitly anyway

[unreleased]: https://github.com/yduman/rmby/compare/0.0.2...master
[0.0.2]: https://github.com/yduman/rmby/releases/tag/0.0.2
