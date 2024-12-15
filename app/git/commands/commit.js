const path = require("path");
const fs = require("fs");
class commitCommand {
  constructor(message, tag = null) {
    this.message = message;
    this.tag = tag;
  }

  execute() {
    const commitData = {
      message: this.message,
      tag: this.tag,
      timestamp: new Date().toISOString(),
    };

    const hash = require("crypto")
      .createHash("sha1")
      .update(JSON.stringify(commitData))
      .digest("hex");

    const commitPath = path.join(process.cwd(), ".test_dir", "commits", hash);

    if (!fs.existsSync(commitPath)) {
      fs.mkdirSync(path.dirname(commitPath), { recursive: true });
      fs.writeFileSync(commitPath, JSON.stringify(commitData));
    }

    process.stdout.write(`Commit created with hash: ${hash}\n`);
  }
}

module.exports = commitCommand;
