#! /usr/bin/env node
const { execSync } = require("node:child_process");

import fs from "fs";
import path from "path";

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
  return execSync(
    command,
    { cwd: where, detached: true },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Successfully executed command: ${command}`);
    }
  );
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
function createFolder(folder: string, where: string): string {
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

/**
 * init git repository.
 *
 * @param where location to create the folders.
 */
function initGitRepository(where: string): void {
  const repoURL = "git@github.com:FxOmar/random-repo.git";

  cmd(
    `
    git init && git remote add origin ${repoURL} &&
    echo "${new Date()}" >> README.md &&
    git add README.md &&
    git commit -m "Initial commit" &&
    git push --force --set-upstream origin master`,
    where
  );
}

function run() {
  const folderPath = createFolder("test", "/Users/fx_omar/Desktop/");
  initGitRepository(folderPath);
}

run();
