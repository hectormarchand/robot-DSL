import { Model } from "../language/generated/ast.js";
import { Model as VisitorModel }  from "../language/visitor.js";
import { CompilerVisitor } from "../language/compiler/visitor.js";
import path from "path";
import fs from "fs";

export function compile(model: Model): void {
    const visitor = new CompilerVisitor();
    const visitorModel: VisitorModel = new VisitorModel(model.fn);
    visitorModel.accept(visitor);

    // Get the directory path using import.meta.url
    const currentFilePath = new URL(import.meta.url).pathname;
    let currentDir = path.dirname(currentFilePath);
    // remove first character if it is '/'
    if (currentDir.charAt(0) == '/') {
        currentDir = currentDir.slice(1);
    }

    console.log(currentDir);
    // create .ino file
    const filePath = path.join(currentDir, '../../robot.ino');
    fs.writeFile(filePath, visitor.getCodeCompiled(), function(err: any) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}