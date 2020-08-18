import fs from "fs";

export const readdir = fs.promises.readdir;
export const stat = fs.promises.stat;
export const unlink = fs.promises.unlink;
