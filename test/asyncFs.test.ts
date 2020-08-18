import fs from "fs";
import path from "path";
import tempy from "tempy";

import { readdir, stat, unlink } from "../src/asyncFs";

const open = fs.promises.open;
const access = fs.promises.access;
const WRITE_FLAG = "w";

describe("asyncFs", () => {
  it("should list all children on a given directory", async () => {
    // arrange
    const dirPath = tempy.directory();
    const fileName = "file-tmp.txt";
    const filePath = path.join(dirPath, fileName);
    const file = await open(filePath, WRITE_FLAG);
    await file.close();

    // act
    const dirChildren = await readdir(dirPath);

    // assert
    expect(dirChildren).toEqual([fileName]);
  });

  it("should return file stats", async () => {
    // arrange
    const filePath = tempy.file();
    const file = await open(filePath, WRITE_FLAG);
    await file.close();

    // act
    const stats = await stat(filePath);

    // assert
    expect(stats.size).toEqual(0);
  });

  it("should remove a file", async () => {
    // arrange
    const filePath = tempy.file();
    const file = await open(filePath, WRITE_FLAG);
    await file.close();
    expect(access(filePath, fs.constants.F_OK)).resolves;

    // act
    await unlink(filePath);

    // assert
    await expect(access(filePath, fs.constants.F_OK)).rejects.toThrow();
  });
});
