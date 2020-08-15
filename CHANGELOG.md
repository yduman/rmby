# Changelog

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [0.1.0] - 2020-08-15

### Added

- `byExtension().thatEquals(string)`

### Changed

--

### Fixed

--

### Removed

--

## [0.0.3] - 2020-08-15

### Added

- `byName().thatStartsWith(string)`
- `byName().thatEndsWith(string)`
- `byName().thatIncludes(string)`

### Changed

- `byName().equalTo(string)` is now `byName().thatEquals(string)` to conform the rest of the `byName()` API

### Fixed

--

### Removed

--

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

[unreleased]: https://github.com/yduman/rmby/compare/0.1.0...master
[0.0.2]: https://github.com/yduman/rmby/releases/tag/0.0.2
[0.0.3]: https://github.com/yduman/rmby/releases/tag/0.0.3
[0.1.0]: https://github.com/yduman/rmby/releases/tag/0.1.0
