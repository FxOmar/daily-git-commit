#! /usr/bin/env node
const { spawn } = require("node:child_process");

import fs from "fs";
import path from "path";

// Handles user input and calls the appropriate function
// const prompt = require("prompt");

// const schema = {
//   properties: {
//     repo: {
//       description: "Enter your github repository url",
//       pattern:
//         /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
//       message: "Repository url must be only letters, spaces, or dashes",
//       required: true,
//     },
//     password: {
//       hidden: true,
//     },
//   },
// };

// prompt.start();

// /**
//  * Ask users for their github repository url.
//  **/
// prompt.get(schema, (err: any, result: { name: string; password: string }) => {
//   console.log("Command-line input received:");
//   console.log("  name: " + result.name);
//   console.log("  password: " + result.password);
// });

/**
 * Execute a shell command.
 *
 * @param command to execute
 * @param where location to execute command
 *
 * @returns Promise that resolves to the output of the command
 */
function cmd(command: string, where: string) {
  const cmd = spawn(command, { cwd: where });

  cmd.stdout.on("data", (data: any) => {
    console.log(data.toString());
  });

  return cmd;
}

/**
 * Create a folders.
 *
 * @param folders array of folders to create.
 * @param where location to create the folders.
 *
 * @returns folders paths that were created.
 */
function createFolders(folders: string[] | string, where: string) {
  const folderPaths: string[] = [];

  if (typeof folders === "string") {
    folders = [folders];
  }

  folders.forEach((folder: string) => {
    const folderPath = createFolder(folder, where);

    folderPaths.push(folderPath);
  });

  return folderPaths;
}

/**
 * Create a folder.
 *
 * @param folder name of the folder to create.
 * @param where location to create the folder.
 *
 * @returns path of the folder that was created.
 *
 * @throws if the folder already exists.
 *
 **/
function createFolder(folder: string, where: string) {
  const folderPath = getFolderPath(where, folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  } else {
    throw new Error(`Folder ${folderPath} already exists.`);
  }

  return folderPath;
}

/**
 * Get the path of a folder.
 *
 * @param where location to create the folders.
 * @param folder name of the folder.
 * @returns path of the folder.
 *
 * @example getFolderPath("/Users/user/", "folder") => "/Users/user/folder"
 **/
function getFolderPath(where: string = __dirname, folder: string) {
  return path.join(where, folder);
}

const sss = createFolders(["hello", "world", "WTF"], "/Users/fx_omar/Desktop");

console.log(sss);
