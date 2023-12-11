import { Model } from "../language/generated/ast.js";
import { Model as VisitorModel } from "../language/visitor.js";
import { CompilerVisitor } from "../language/compiler/visitor.js";
import path from "path";
import fs from "fs";

export function compile(model: Model): void {
    const visitor = new CompilerVisitor();
    const visitorModel: VisitorModel = new VisitorModel(model.fn);
    const compiledCode: string = visitorModel.accept(visitor);

    // Get the directory path using import.meta.url
    const currentFilePath = new URL(import.meta.url).pathname;
    let currentDir = path.dirname(currentFilePath);
    // remove first character if it is '/'
    if (process.platform === "win32" && currentDir.charAt(0) == '/') {
        currentDir = currentDir.slice(1);
    }

    console.log(currentDir);
    // create .ino file
    const filePath = path.join(currentDir, '../../output/output.ino');
    fs.writeFile(filePath, compiledCode, function (err: any) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}