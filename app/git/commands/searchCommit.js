class searchCommitsCommand {
  constructor(tag) {
    this.tag = tag;
  }

  execute() {
    const commitDir = path.join(process.cwd(), ".test_dir", "commits");
    if (!fs.existsSync(commitDir)) {
      throw new Error("No commits found.");
    }

    const files = fs.readdirSync(commitDir);
    const results = [];

    files.forEach((file) => {
      const commitData = JSON.parse(
        fs.readFileSync(path.join(commitDir, file), "utf-8")
      );
      if (commitData.tag === this.tag) {
        results.push({
          hash: file,
          message: commitData.message,
          timestamp: commitData.timestamp,
        });
      }
    });

    if (results.length === 0) {
      process.stdout.write(`No commits found with tag: ${this.tag}\n`);
    } else {
      process.stdout.write(`Commits with tag "${this.tag}":\n`);
      results.forEach((commit) => {
        process.stdout.write(
          `Hash: ${commit.hash}\nMessage: ${commit.message}\nTime: ${commit.timestamp}\n\n`
        );
      });
    }
  }
}

module.exports = searchCommitsCommand;
