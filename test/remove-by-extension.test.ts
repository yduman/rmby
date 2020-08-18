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

describe("Remove By File Extension Tests", () => {
  beforeEach(() => {
    (readdir as any).mockResolvedValue(dirContent);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should remove all files that equal to provided file extension", async () => {
    const deletedFiles = await new RemoveFiles().from(dirPath).byExtension(".txt").run();

    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledWith(file1);
    expect(deletedFiles).toEqual([file1]);
  });

  it("should return empty array and do nothing if name is not equal", async () => {
    const deletedFiles = await new RemoveFiles().from(dirPath).byExtension(".java").run();

    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).not.toHaveBeenCalled();
    expect(deletedFiles).toEqual([]);
  });

  it("should throw exception if readdir() goes wrong", async () => {
    (readdir as any).mockResolvedValue(new Error());

    expect(new RemoveFiles().from(dirPath).byExtension(".java").run()).rejects.toThrow();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).not.toHaveBeenCalled();
  });

  it("should throw exception if unlink() goes wrong", async () => {
    (unlink as any).mockImplementationOnce(
      (filename: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(new Error());
      },
    );

    await expect(new RemoveFiles().from(dirPath).byExtension(".txt").run()).rejects.toBeTruthy();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledTimes(1);
  });
});
