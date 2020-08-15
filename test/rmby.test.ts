/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir, stat, unlink } from "../src/asyncFs";
import { Remove } from "../src/rmby";

jest.mock("../src/asyncFs", () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
}));

describe("rmby", () => {
  describe("remove by time", () => {
    const dirPath = "/path/to/dir";
    const file1 = "/path/to/dir/file1";
    const file2 = "/path/to/dir/file2";
    const file3 = "/path/to/dir/file3";
    const file4 = "/path/to/dir/file4";
    const dir1 = "/path/to/dir/dir1";
    const dir2 = "/path/to/dir/dir2";

    beforeEach(() => {
      const dirContent = ["file1", "file2", "dir1", "dir2", "file3", "file4"];
      const stats: { [key: string]: any } = {
        "/path/to/dir/file1": {
          isFile: () => true,
          mtime: new Date(Date.now() - 500),
        },
        "/path/to/dir/file2": {
          isFile: () => true,
          mtime: new Date(Date.now() - 1000 * 30),
        },
        "/path/to/dir/dir1": {
          isFile: () => false,
        },
        "/path/to/dir/dir2": {
          isFile: () => false,
        },
        "/path/to/dir/file3": {
          isFile: () => true,
          mtime: new Date(Date.now() - 1000 * 60 * 45),
        },
        "/path/to/dir/file4": {
          isFile: () => true,
          mtime: new Date(Date.now() - 1000 * 60 * 60 * 6),
        },
      };
      (readdir as any).mockResolvedValue(dirContent);
      (stat as any).mockImplementation((fileName: string) =>
        Promise.resolve(stats[fileName]),
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should remove all files older than given milliseconds", async () => {
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

    test("should remove all files older than given seconds", async () => {
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

    test("should remove all files older than given minutes", async () => {
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

    test("should remove all files older than given hours", async () => {
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
  });
});
