import * as ASTInterfaces from "./generated/ast.js";

export interface RobotVisitor<T> {
    visitArithmeticExpression(node: ASTInterfaces.ArithmeticExpression): T;
}

export class ArithmeticExpression implements ASTInterfaces.ArithmeticExpression {
    $container!: ASTInterfaces.ArithmeticExpression["$container"]; // Use correct type for $container
    $type!: 'ArithmeticExpression';
    term!: ASTInterfaces.Term;

    accept<T>(visitor: RobotVisitor<T>): any     {}

}