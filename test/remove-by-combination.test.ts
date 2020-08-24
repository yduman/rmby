/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir, stat, unlink } from "../src/asyncFs";
import { remove } from "../src/rmby";

jest.mock("../src/asyncFs", () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
}));

const dirPath = "/path/to/dir";
const dirContent = ["file1.txt", "file2.css", "dir1", "dir2", "file3.html", "file4.js", "file5.js"];
const file3 = "/path/to/dir/file3.html";
const file5 = "/path/to/dir/file5.js";

describe("Remove By Combination Tests", () => {
  beforeEach(() => {
    const stats: { [key: string]: any } = {
      "/path/to/dir/file1.txt": {
        isFile: () => true,
        mtime: new Date(Date.now() - 500),
      },
      "/path/to/dir/file2.css": {
        isFile: () => true,
        mtime: new Date(Date.now() - 1000 * 30),
      },
      "/path/to/dir/dir1": {
        isFile: () => false,
      },
      "/path/to/dir/dir2": {
        isFile: () => false,
      },
      "/path/to/dir/file3.html": {
        isFile: () => true,
        mtime: new Date(Date.now() - 1000 * 60 * 45),
      },
      "/path/to/dir/file4.js": {
        isFile: () => true,
        mtime: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
      "/path/to/dir/file5.js": {
        isFile: () => true,
        mtime: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
    };
    (readdir as any).mockResolvedValue(dirContent);
    (stat as any).mockImplementation((fileName: string) => Promise.resolve(stats[fileName]));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be able to remove files with chained combinations", async () => {
    const deletedFiles = await remove()
      .from(dirPath)
      .byName()
      .thatStartsWith("f")
      .and()
      .byExtension(".js")
      .and()
      .byTime()
      .olderThan(12)
      .hours()
      .run();

    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledWith(file5);
    expect(deletedFiles).toEqual([file5]);
  });

  it("should be able to remove files with extension and than name", async () => {
    const deletedFiles = await remove()
      .from(dirPath)
      .byExtension(".html")
      .and()
      .byName()
      .thatStartsWith("file")
      .run();

    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledWith(file3);
    expect(deletedFiles).toEqual([file3]);
  });
});
