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
const file1 = "/path/to/dir/file1.txt";
const file2 = "/path/to/dir/file2.css";
const file3 = "/path/to/dir/file3.html";
const file4 = "/path/to/dir/file4.js";
const file5 = "/path/to/dir/file5.js";
const dir1 = "/path/to/dir/dir1";
const dir2 = "/path/to/dir/dir2";

describe("Remove By Time Tests", () => {
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

  it("should remove all files older than given milliseconds", async () => {
    const deletedFiles = await remove().from(dirPath).byTime().olderThan(500).milliseconds().run();

    expect(unlink).toHaveBeenCalledTimes(5);
    expect(unlink).not.toHaveBeenCalledWith(dir1);
    expect(unlink).not.toHaveBeenCalledWith(dir2);
    expect(unlink).toHaveBeenCalledWith(file1);
    expect(unlink).toHaveBeenCalledWith(file2);
    expect(unlink).toHaveBeenCalledWith(file3);
    expect(unlink).toHaveBeenCalledWith(file4);
    expect(unlink).toHaveBeenCalledWith(file5);
    expect(deletedFiles).toEqual([file1, file2, file3, file4, file5]);
  });

  it("should remove all files older than given seconds", async () => {
    const deletedFiles = await remove().from(dirPath).byTime().olderThan(30).seconds().run();

    expect(unlink).toHaveBeenCalledTimes(4);
    expect(unlink).not.toHaveBeenCalledWith(dir1);
    expect(unlink).not.toHaveBeenCalledWith(dir2);
    expect(unlink).not.toHaveBeenCalledWith(file1);
    expect(unlink).toHaveBeenCalledWith(file2);
    expect(unlink).toHaveBeenCalledWith(file3);
    expect(unlink).toHaveBeenCalledWith(file4);
    expect(unlink).toHaveBeenCalledWith(file5);
    expect(deletedFiles).toEqual([file2, file3, file4, file5]);
  });

  it("should remove all files older than given minutes", async () => {
    const deletedFiles = await remove().from(dirPath).byTime().olderThan(45).minutes().run();

    expect(unlink).toHaveBeenCalledTimes(3);
    expect(unlink).not.toHaveBeenCalledWith(dir1);
    expect(unlink).not.toHaveBeenCalledWith(dir2);
    expect(unlink).not.toHaveBeenCalledWith(file1);
    expect(unlink).not.toHaveBeenCalledWith(file2);
    expect(unlink).toHaveBeenCalledWith(file3);
    expect(unlink).toHaveBeenCalledWith(file4);
    expect(unlink).toHaveBeenCalledWith(file5);
    expect(deletedFiles).toEqual([file3, file4, file5]);
  });

  it("should remove all files older than given hours", async () => {
    const deletedFiles = await remove().from(dirPath).byTime().olderThan(6).hours().run();

    expect(unlink).toHaveBeenCalledTimes(2);
    expect(unlink).not.toHaveBeenCalledWith(dir1);
    expect(unlink).not.toHaveBeenCalledWith(dir2);
    expect(unlink).not.toHaveBeenCalledWith(file1);
    expect(unlink).not.toHaveBeenCalledWith(file2);
    expect(unlink).not.toHaveBeenCalledWith(file3);
    expect(unlink).toHaveBeenCalledWith(file4);
    expect(unlink).toHaveBeenCalledWith(file5);
    expect(deletedFiles).toEqual([file4, file5]);
  });

  it("should throw exception if readdir() goes wrong", async () => {
    (readdir as any).mockResolvedValue(new Error());

    await expect(remove().from(dirPath).byTime().olderThan(1).hours().run()).rejects.toBeTruthy();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(stat).not.toHaveBeenCalled();
    expect(unlink).not.toHaveBeenCalled();
  });

  it("should throw exception if stat() goes wrong", async () => {
    (stat as any).mockImplementationOnce(
      (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(new Error());
      },
    );

    await expect(remove().from(dirPath).byTime().olderThan(1).hours().run()).rejects.toBeTruthy();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(stat).toHaveBeenCalledTimes(1);
    expect(unlink).not.toHaveBeenCalled();
  });

  it("should throw exception if unlink() goes wrong", async () => {
    (unlink as any).mockImplementationOnce(
      (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(new Error());
      },
    );

    await expect(remove().from(dirPath).byTime().olderThan(1).hours().run()).rejects.toBeTruthy();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(stat).toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledTimes(1);
  });
});
