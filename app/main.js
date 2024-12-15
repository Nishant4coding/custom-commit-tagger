const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const GitCient = require("./git/client");

const git = new GitCient();

//commands 


function handleCatFile() {
  const hash = process.argv[3]; }



// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
// console.error("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const command = process.argv[2];
//
switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFile();
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
