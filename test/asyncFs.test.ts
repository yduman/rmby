import fs from "fs";
import path from "path";
import tempy from "tempy";
import { promisify } from "util";

import { readdir, stat, unlink } from "../src/asyncFs";

const open = promisify(fs.open);
const close = promisify(fs.close);
const access = promisify(fs.access);
const WRITE_FLAG = "w";

describe("asyncFs", () => {
  test("readdir() should list all children on a given directory", async () => {
    // arrange
    const dirPath = tempy.directory();
    const fileName = "file-tmp.txt";
    const filePath = path.join(dirPath, fileName);
    const file = await open(filePath, WRITE_FLAG);
    await close(file);

    // act
    const dirChildren = await readdir(dirPath);

    // assert
    expect(dirChildren).toEqual([fileName]);
  });

  test("stat() should return file stats", async () => {
    // arrange
    const filePath = tempy.file();
    const file = await open(filePath, WRITE_FLAG);
    await close(file);

    // act
    const stats = await stat(filePath);

    // assert
    expect(stats.size).toEqual(0);
  });

  test("unlink() should remove a file", async () => {
    // arrange
    const filePath = tempy.file();
    const file = await open(filePath, WRITE_FLAG);
    await close(file);
    expect(access(filePath, fs.constants.F_OK)).resolves;

    // act
    await unlink(filePath);

    // assert
    await expect(access(filePath, fs.constants.F_OK)).rejects.toThrow();
  });
});
