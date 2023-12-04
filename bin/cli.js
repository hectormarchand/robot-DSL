import { exit } from 'process';
import '../out/cli/main.js';
import { generateAST, visitFile } from '../out/cli/main.js';

const args = process.argv;

if (args.length == 2) {
    console.error("You must specify a command");
    exit(1);
}

const command = args[2];
let file;
switch (command) {
    case "generateAST":
        file = args[3];
        await generateAST(file);
        break;
    case "interpret":
        file = args[3];
        await visitFile(file);
        break;
    default:
        console.error(`No command with name ${command}`);
}