class catFileCommand {
    execute() {
        const hash = process.argv[3];
        catFile(hash);
    }
}