import { Model } from  "../language/visitor.js";
import { InterpreterVisitor } from "../language/interpreter/visitor.js";

export function interpret(model: Model): void {
    console.log("Interpreting model");
    const visitor = new InterpreterVisitor();
    visitor.visitModel(model);
}