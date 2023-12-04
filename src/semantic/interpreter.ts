import { Model } from "../language/generated/ast.js";
import { Model as VisitorModel }  from "../language/visitor.js";
import { InterpreterVisitor } from "../language/interpreter/visitor.js";

export function interpret(model: Model): void {
    const visitor = new InterpreterVisitor();
    const visitorModel: VisitorModel = new VisitorModel(model.fn);
    visitorModel.accept(visitor);
}