const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const GitCient = require("./git/client");

const git = new GitCient();

//commands
const catFileCommand = require("./git/commands/cat-file");
const hashObjectCommand = require("./git/commands/hash-object");
const commitCommand = require("./git/commands/commit");
const searchCommitsCommand = require("./git/commands/hash-object");

function handleCatFile() {
  const flag = process.argv[3];
  const hash = process.argv[4];
  const command = new catFileCommand(flag, hash);
  git.run(command);
}

function handleHashObject() {
  let flag = process.argv[3];
  let filepath = process.argv[4];
  if (!filepath) {
    filepath = flag;
    flag = null;
  }
  const command = new hashObjectCommand(flag, filepath);
  git.run(command);
  // console.log(flag, filepath);
}

function handleTagCommit() {
  const commitHash = process.argv[3];
  const tag = process.argv[4];
  if (!commitHash || !tag) {
    throw new Error("Please provide both a commit hash and a tag.");
  }

  const command = new commitCommand(commitHash, tag);
  git.run(command);
}

function handleSearchCommits() {
  const tag = process.argv[3];

  if (!tag) {
    throw new Error("Please provide a tag to search for.");
  }

  const command = new searchCommitsCommand(tag);
  git.run(command);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");
// console.error("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const command = process.argv[2];
//
switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "hash-object":
    handleHashObject();
    break;
  case "cat-file":
    handleCatFile();
    break;
  case "tag-commit":
    handleTagCommit();
    break;
  case "search-commits":
    handleSearchCommits();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
//
function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(
    path.join(process.cwd(), ".git", "HEAD"),
    "ref: refs/heads/main\n"
  );
  console.log("Initialized git directory");
}

async function catFile(hash) {
  const content = await fs.readFileSync(
    path.join(process.cwd(), ".git", "objects", hash.slice(0, 2), hash.slice(2))
  );
  const dataUnzipped = zlib.inflateSync(content);
  const res = dataUnzipped.toString().split("\0")[1];
  process.stdout.write(res);
}
