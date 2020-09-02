/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir, unlink } from "../src/asyncFs";
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

describe("Remove By Name Tests", () => {
  beforeEach(() => {
    (readdir as any).mockResolvedValue(dirContent);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("thatEquals()", () => {
    it("should remove all files that equal to provided name", async () => {
      const deletedFiles = await remove().from(dirPath).byName().thatEquals("file1").run();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledWith(file1);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(deletedFiles).toEqual([file1]);
    });

    it("should return empty results and delete nothing if there is no match", async () => {
      const deleteResults = await remove()
        .from(dirPath)
        .byName()
        .thatEquals("somethingThatDoesNotExist")
        .run();
      expect(deleteResults.length).toBe(0);
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw error if readdir() goes wrong", async () => {
      (readdir as any).mockResolvedValue(new Error());
      await expect(remove().from(dirPath).byName().thatEquals("foo").run()).resolves.toStrictEqual(
        [],
      );
      expect(unlink).not.toHaveBeenCalled();
    });
  });

  describe("thatStartsWith()", () => {
    it("should remove all files that start with the provided name", async () => {
      const deletedFiles = await remove().from(dirPath).byName().thatStartsWith("file").run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(5);
      expect(unlink).toHaveBeenCalledWith(file1);
      expect(unlink).toHaveBeenCalledWith(file2);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).toHaveBeenCalledWith(file4);
      expect(unlink).toHaveBeenCalledWith(file5);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(deletedFiles).toEqual([file1, file2, file3, file4, file5]);
    });

    it("should return empty results and delete nothing if there is no match", async () => {
      const deleteResults = await remove().from(dirPath).byName().thatStartsWith("xxx").run();
      expect(deleteResults.length).toBe(0);
      expect(unlink).not.toHaveBeenCalled();
    });
  });

  describe("thatEndsWith()", () => {
    it("should remove all files that end with the provided name", async () => {
      const deletedFiles = await remove().from(dirPath).byName().thatEndsWith("3").run();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(deletedFiles).toEqual([file3]);
    });

    it("should return empty results and delete nothing if there is no match", async () => {
      const deleteResults = await remove().from(dirPath).byName().thatEndsWith("xxx").run();
      expect(deleteResults.length).toBe(0);
      expect(unlink).not.toHaveBeenCalled();
    });
  });

  describe("thatIncludes()", () => {
    it("should remove all files that that include the provided name", async () => {
      const deletedFiles = await remove().from(dirPath).byName().thatIncludes("ile").run();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(5);
      expect(unlink).toHaveBeenCalledWith(file1);
      expect(unlink).toHaveBeenCalledWith(file2);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).toHaveBeenCalledWith(file4);
      expect(unlink).toHaveBeenCalledWith(file5);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(deletedFiles).toEqual([file1, file2, file3, file4, file5]);
    });

    it("should return empty results and delete nothing if there is no match", async () => {
      const deleteResults = await remove().from(dirPath).byName().thatIncludes("xxx").run();
      expect(deleteResults.length).toBe(0);
      expect(unlink).not.toHaveBeenCalled();
    });
  });
});
