import fs from "fs";
import { promisify } from "util";

export const readdir = promisify(fs.readdir);
export const stat = promisify(fs.stat);
export const unlink = promisify(fs.unlink);
