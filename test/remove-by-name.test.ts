/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir, unlink } from "../src/asyncFs";
import { RemoveFiles } from "../src/rmby";

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

  describe("thatEqualsTo()", () => {
    it("should remove all files that equal to provided name", async () => {
      const deletedFiles = await new RemoveFiles()
        .from(dirPath)
        .byName()
        .thatEqualsTo("file1")
        .run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledWith(file1);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(deletedFiles).toEqual([file1]);
    });

    it("should return empty array and do nothing if name is not equal", async () => {
      const deletedFiles = await new RemoveFiles()
        .from(dirPath)
        .byName()
        .thatEqualsTo("somethingThatDoesNotExist")
        .run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
      expect(deletedFiles).toEqual([]);
    });

    it("should throw exception if readdir() goes wrong", async () => {
      (readdir as any).mockResolvedValue(new Error());

      expect(new RemoveFiles().from(dirPath).byName().thatEqualsTo("foo").run()).rejects.toThrow();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw exception if unlink() goes wrong", async () => {
      (unlink as any).mockImplementationOnce(
        (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
          callback(new Error());
        },
      );

      await expect(
        new RemoveFiles().from(dirPath).byName().thatEqualsTo("file1").run(),
      ).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
    });
  });

  describe("thatStartsWith()", () => {
    it("should remove all files that start with the provided name", async () => {
      const deletedFiles = await new RemoveFiles()
        .from(dirPath)
        .byName()
        .thatStartsWith("file")
        .run();

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

    it("should return empty array and do nothing if no filename starts with provided name", async () => {
      const deletedFiles = await new RemoveFiles()
        .from(dirPath)
        .byName()
        .thatStartsWith("xxx")
        .run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
      expect(deletedFiles).toEqual([]);
    });

    it("should throw exception if readdir() goes wrong", async () => {
      (readdir as any).mockResolvedValue(new Error());

      expect(
        new RemoveFiles().from(dirPath).byName().thatStartsWith("foo").run(),
      ).rejects.toThrow();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw exception if unlink() goes wrong", async () => {
      (unlink as any).mockImplementationOnce(
        (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
          callback(new Error());
        },
      );

      await expect(
        new RemoveFiles().from(dirPath).byName().thatStartsWith("file").run(),
      ).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
    });
  });

  describe("thatEndsWith()", () => {
    it("should remove all files that end with the provided name", async () => {
      const deletedFiles = await new RemoveFiles().from(dirPath).byName().thatEndsWith("3").run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(deletedFiles).toEqual([file3]);
    });

    it("should return empty array and do nothing if no filename ends with provided name", async () => {
      const deletedFiles = await new RemoveFiles().from(dirPath).byName().thatEndsWith("xxx").run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
      expect(deletedFiles).toEqual([]);
    });

    it("should throw exception if readdir() goes wrong", async () => {
      (readdir as any).mockResolvedValue(new Error());

      expect(new RemoveFiles().from(dirPath).byName().thatEndsWith("foo").run()).rejects.toThrow();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw exception if unlink() goes wrong", async () => {
      (unlink as any).mockImplementationOnce(
        (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
          callback(new Error());
        },
      );

      await expect(
        new RemoveFiles().from(dirPath).byName().thatEndsWith("3").run(),
      ).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
    });
  });

  describe("thatIncludes()", () => {
    it("should remove all files that that include the provided name", async () => {
      const deletedFiles = await new RemoveFiles().from(dirPath).byName().thatIncludes("ile").run();

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

    it("should return empty array and do nothing if no filename includes the provided name", async () => {
      const deletedFiles = await new RemoveFiles().from(dirPath).byName().thatIncludes("xxx").run();

      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
      expect(deletedFiles).toEqual([]);
    });

    it("should throw exception if readdir() goes wrong", async () => {
      (readdir as any).mockResolvedValue(new Error());

      expect(new RemoveFiles().from(dirPath).byName().thatIncludes("foo").run()).rejects.toThrow();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw exception if unlink() goes wrong", async () => {
      (unlink as any).mockImplementationOnce(
        (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
          callback(new Error());
        },
      );

      await expect(
        new RemoveFiles().from(dirPath).byName().thatIncludes("ile").run(),
      ).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(unlink).toHaveBeenCalledTimes(1);
    });
  });
});
