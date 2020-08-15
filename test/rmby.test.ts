/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir, stat, unlink } from "../src/asyncFs";
import { Remove } from "../src/rmby";
import fs from "fs";

fs.unlink;

jest.mock("../src/asyncFs", () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
}));

const dirPath = "/path/to/dir";
const dirContent = ["file1.txt", "file2.css", "dir1", "dir2", "file3.html", "file4.js"];
const file1 = "/path/to/dir/file1.txt";
const file2 = "/path/to/dir/file2.css";
const file3 = "/path/to/dir/file3.html";
const file4 = "/path/to/dir/file4.js";
const dir1 = "/path/to/dir/dir1";
const dir2 = "/path/to/dir/dir2";

describe("rmby", () => {
  describe("remove by time", () => {
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
      };
      (readdir as any).mockResolvedValue(dirContent);
      (stat as any).mockImplementation((fileName: string) => Promise.resolve(stats[fileName]));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should remove all files older than given milliseconds", async () => {
      // arrange
      const remove = new Remove(dirPath);

      // act
      const deletedFiles = await remove.byMilliseconds().olderThan(500);

      // assert
      expect(unlink).toHaveBeenCalledWith(file1);
      expect(unlink).toHaveBeenCalledWith(file2);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).toHaveBeenCalledWith(file4);
      expect(deletedFiles).toEqual([file1, file2, file3, file4]);
    });

    it("should remove all files older than given seconds", async () => {
      // arrange
      const remove = new Remove(dirPath);

      // act
      const deletedFiles = await remove.bySeconds().olderThan(30);

      // assert
      expect(unlink).not.toHaveBeenCalledWith(file1);
      expect(unlink).toHaveBeenCalledWith(file2);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).toHaveBeenCalledWith(file4);
      expect(deletedFiles).toEqual([file2, file3, file4]);
    });

    it("should remove all files older than given minutes", async () => {
      // arrange
      const remove = new Remove(dirPath);

      // act
      const deletedFiles = await remove.byMinutes().olderThan(45);

      // assert
      expect(unlink).not.toHaveBeenCalledWith(file1);
      expect(unlink).not.toHaveBeenCalledWith(file2);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(unlink).toHaveBeenCalledWith(file3);
      expect(unlink).toHaveBeenCalledWith(file4);
      expect(deletedFiles).toEqual([file3, file4]);
    });

    it("should remove all files older than given hours", async () => {
      // arrange
      const remove = new Remove(dirPath);

      // act
      const deletedFiles = await remove.byHours().olderThan(6);

      // assert
      expect(unlink).not.toHaveBeenCalledWith(file1);
      expect(unlink).not.toHaveBeenCalledWith(file2);
      expect(unlink).not.toHaveBeenCalledWith(dir1);
      expect(unlink).not.toHaveBeenCalledWith(dir2);
      expect(unlink).not.toHaveBeenCalledWith(file3);
      expect(unlink).toHaveBeenCalledWith(file4);
      expect(deletedFiles).toEqual([file4]);
    });

    it("should throw exception if readdir() goes wrong", async () => {
      // arrange
      const remove = new Remove(dirPath);
      (readdir as any).mockResolvedValue(new Error());

      // assert
      await expect(remove.byHours().olderThan(1)).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(stat).not.toHaveBeenCalled();
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw exception if stat() goes wrong", async () => {
      // arrange
      const remove = new Remove(dirPath);
      (stat as any).mockResolvedValue(new Error());

      // act & assert
      await expect(remove.byHours().olderThan(1)).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(stat).toHaveBeenCalledTimes(1);
      expect(unlink).not.toHaveBeenCalled();
    });

    it("should throw exception if unlink() goes wrong", async () => {
      // arrange
      const remove = new Remove(dirPath);
      (unlink as any).mockImplementationOnce(
        (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
          callback(new Error());
        },
      );

      // act & assert
      await expect(remove.byHours().olderThan(1)).rejects.toBeTruthy();
      expect(readdir).toHaveBeenCalledTimes(1);
      expect(stat).toHaveBeenCalled();
      expect(unlink).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove by name", () => {
    beforeEach(() => {
      (readdir as any).mockResolvedValue(dirContent);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("thatEquals()", () => {
      it("should remove all files that equal to provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatEquals("file1");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledWith(file1);
        expect(deletedFiles).toEqual([file1]);
      });

      it("should return empty array and do nothing if name is not equal", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatEquals("somethingThatDoesNotExist");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
        expect(deletedFiles).toEqual([]);
      });

      it("should throw exception if readdir() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (readdir as any).mockResolvedValue(new Error());

        // assert
        expect(remove.byName().thatEquals("foo")).rejects.toThrow();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
      });

      it("should throw exception if unlink() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (unlink as any).mockImplementationOnce(
          (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
            callback(new Error());
          },
        );

        // act & assert
        await expect(remove.byName().thatEquals("file1")).rejects.toBeTruthy();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(1);
      });
    });

    describe("thatStartsWith()", () => {
      it("should remove all files that start with the provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatStartsWith("file");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(4);
        expect(unlink).toHaveBeenCalledWith(file1);
        expect(unlink).toHaveBeenCalledWith(file2);
        expect(unlink).toHaveBeenCalledWith(file3);
        expect(unlink).toHaveBeenCalledWith(file4);
        expect(deletedFiles).toEqual([file1, file2, file3, file4]);
      });

      it("should return empty array and do nothing if no filename starts with provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatStartsWith("xxx");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
        expect(deletedFiles).toEqual([]);
      });

      it("should throw exception if readdir() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (readdir as any).mockResolvedValue(new Error());

        // assert
        expect(remove.byName().thatStartsWith("foo")).rejects.toThrow();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
      });

      it("should throw exception if unlink() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (unlink as any).mockImplementationOnce(
          (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
            callback(new Error());
          },
        );

        // act & assert
        await expect(remove.byName().thatStartsWith("file")).rejects.toBeTruthy();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(1);
      });
    });

    describe("thatEndsWith()", () => {
      it("should remove all files that end with the provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatEndsWith("3");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledWith(file3);
        expect(deletedFiles).toEqual([file3]);
      });

      it("should return empty array and do nothing if no filename ends with provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatEndsWith("xxx");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
        expect(deletedFiles).toEqual([]);
      });

      it("should throw exception if readdir() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (readdir as any).mockResolvedValue(new Error());

        // assert
        expect(remove.byName().thatEndsWith("foo")).rejects.toThrow();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
      });

      it("should throw exception if unlink() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (unlink as any).mockImplementationOnce(
          (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
            callback(new Error());
          },
        );

        // act & assert
        await expect(remove.byName().thatEndsWith("3")).rejects.toBeTruthy();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(1);
      });
    });

    describe("thatIncludes()", () => {
      it("should remove all files that that include the provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatIncludes("ile");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(4);
        expect(unlink).toHaveBeenCalledWith(file1);
        expect(unlink).toHaveBeenCalledWith(file2);
        expect(unlink).toHaveBeenCalledWith(file3);
        expect(unlink).toHaveBeenCalledWith(file4);
        expect(deletedFiles).toEqual([file1, file2, file3, file4]);
      });

      it("should return empty array and do nothing if no filename includes the provided name", async () => {
        // arrange
        const remove = new Remove(dirPath);

        // act
        const deletedFiles = await remove.byName().thatIncludes("xxx");

        // assert
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
        expect(deletedFiles).toEqual([]);
      });

      it("should throw exception if readdir() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (readdir as any).mockResolvedValue(new Error());

        // assert
        expect(remove.byName().thatIncludes("foo")).rejects.toThrow();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).not.toHaveBeenCalled();
      });

      it("should throw exception if unlink() goes wrong", async () => {
        // arrange
        const remove = new Remove(dirPath);
        (unlink as any).mockImplementationOnce(
          (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
            callback(new Error());
          },
        );

        // act & assert
        await expect(remove.byName().thatIncludes("ile")).rejects.toBeTruthy();
        expect(readdir).toHaveBeenCalledTimes(1);
        expect(unlink).toHaveBeenCalledTimes(1);
      });
    });
  });
});
