const { execSync } = require("node:child_process");

import fs from "fs";
import path from "path";

// Automatically run http server after user has finished entering the required inputs.

// // Create an instance of the http server.
// let app = require("http").createServer();

// // Start the server on port 3000
// app.listen(3000, "127.0.0.1");

// console.log("Node server running on port 3000");

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
 *
 * @throws if the folder does not exist.
 *
 * @returns path of the folder.
 *
 * @example getFolderPath("/Users/user/", "folder") => "/Users/user/folder"
 **/
function getFolderPath(where: string = __dirname, folder: string): string {
  if (!fs.existsSync(where)) {
    throw new Error(`Folder ${where} does not exist.`);
  }

  return path.join(where, folder);
}

/**
 * init git repository.
 *
 * @param where location to create the folders.
 */
async function initGitRepository(where: string) {
  const repoURL = "git@github.com:FxOmar/random-repo.git";

  // Create a git repository.
  // push to github.
  return await cmd(
    `
    git init && git remote add origin ${repoURL} &&
    echo "${new Date().toString()}" >> README.md &&
    git add README.md &&
    git commit -m "Initial commit" &&
    git push --force --set-upstream origin master`,
    where
  );
}

/**
 * Edit a file.
 *
 * @param fileName name of the file to edit.
 * @param where location to create the folders.
 * @param content content to write to the file.
 * @param append if true, append the content to the file.
 */
async function editFile(
  fileName: string,
  where: string,
  content: string,
  append: boolean = false
): Promise<void> {
  const filePath = getFolderPath(where, fileName);

  if (append) {
    fs.appendFileSync(filePath, content, "utf8");
    return;
  }

  const file = fs.readFileSync(filePath, "utf8");

  // Replace current file date with a new date.
  const newFile = file.replace(file, content);
  fs.writeFileSync(filePath, newFile);
}

async function run() {
  // if this function runs the first time initGitRepository,
  // and create new log file to keep track of the changes.
  // if this function runs again, edit the log file.
  // and edit README.md file and push changes to Github.

  let folderPath: string;

  const logFilePath = getFolderPath(__dirname, "log.txt");

  // Check if log file exists.
  if (!fs.existsSync(logFilePath)) {
    folderPath = createFolder("test", "/Users/fx_omar/Desktop/");

    const gitLog = initGitRepository(folderPath);

    // Create a log file to keep track of the script.
    fs.writeFileSync(
      logFilePath,
      `${gitLog}\n
      ${new Date().toString()} - ${folderPath} created successfully.\n`,
      "utf8"
    );
  } else {
    folderPath = getFolderPath("/Users/fx_omar/Desktop/", "test");

    const numberOfCommitsEveryday = 3;

    // Edit README.md file and push changes to Github.
    // Edit log file with the changes.
    for (let i = 0; i <= numberOfCommitsEveryday - 1; i++) {
      await editFile("README.md", folderPath, new Date().toString());

      await cmd(
        `git add . && git commit -m "Commit ${new Date().toString()}" && git push`,
        folderPath
      );

      await editFile(
        "log.txt",
        __dirname,
        `${new Date().toString()} - ${
          folderPath + "/README.md"
        } edited successfully.\n`,
        true
      );
    }
  }
}

run();
