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
    it("should remove all files older than given milliseconds", async () => {
      // arrange
      const dirPath = "/some/path/to/dir";
      const dirContent = ["file1", "file2", "dir1", "dir2"];
      const stats: { [key: string]: any } = {
        "/some/path/to/dir/file1": {
          isFile: () => true,
          mtime: new Date(Date.now() - 500),
        },
        "/some/path/to/dir/file2": {
          isFile: () => true,
          mtime: new Date(Date.now()),
        },
        "/some/path/to/dir/dir1": {
          isFile: () => false,
        },
        "/some/path/to/dir/dir2": {
          isFile: () => false,
        },
      };
      (readdir as any).mockResolvedValue(dirContent);
      (stat as any).mockImplementation((fileName: string) =>
        Promise.resolve(stats[fileName]),
      );

      // act
      const deletedFiles = await new Remove(dirPath)
        .byMilliseconds()
        .olderThan(500);

      // assert
      expect(unlink).toHaveBeenCalledWith("/some/path/to/dir/file1");
      expect(unlink).not.toHaveBeenCalledWith("/some/path/to/dir/file2");
      expect(unlink).not.toHaveBeenCalledWith("/some/path/to/dir/dir1");
      expect(unlink).not.toHaveBeenCalledWith("/some/path/to/dir/dir2");
      expect(deletedFiles).toEqual(["/some/path/to/dir/file1"]);
    });
  });
});
