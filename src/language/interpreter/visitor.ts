import { BinaryArithmeticExpression, BinaryBooleanExpression, Block, Comparison, Condition, Expression, Fn, GetSensorValue, GoBackward, GoForward, Loop, Model, RoboMLVisitor, SetSpeed, TurnLeft, TurnRight, VariableCall, VariableDeclaration, VariableRedeclaration, acceptNode } from "../visitor.js";

export class InterpreterVisitor implements RoboMLVisitor {
    visitBlock(node: Block) {
        for (let variable of node.statements) {
            acceptNode(variable, this);
        }
    }
    visitExpression(node: Expression) {
        acceptNode(node, this);
    }
    visitFn(node: Fn) {
        throw new Error("Method not implemented.");
    }
    visitCondition(node: Condition) {
        acceptNode(node.be,this);
        acceptNode(node.block,this);
        throw new Error("Method not implemented.");
    }
    visitGoBackward(node: GoBackward) {
        throw new Error("Method not implemented.");
    }
    visitGoForward(node: GoForward) {
        throw new Error("Method not implemented.");
    }
    visitLoop(node: Loop) {
        acceptNode(node.be,this);
        acceptNode(node.block,this);
        throw new Error("Method not implemented.");
    }
    visitModel(node: Model) {
        for (let fn of node.fn) {
            acceptNode(fn, this);
        }
    }
    visitSetSpeed(node: SetSpeed) {
        throw new Error("Method not implemented.");
    }
    visitTurnLeft(node: TurnLeft) {
        throw new Error("Method not implemented.");
    }
    visitTurnRight(node: TurnRight) {
        throw new Error("Method not implemented.");
    }
    visitVariableCall(node: VariableCall) {
        throw new Error("Method not implemented.");
    }
    visitVariableDeclaration(node: VariableDeclaration) {
        throw new Error("Method not implemented.");
    }
    visitVariableRedeclaration(node: VariableRedeclaration) {
        throw new Error("Method not implemented.");
    }
    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression) {
        throw new Error("Method not implemented.");
    }
    visitBinaryBooleanExpression(node: BinaryBooleanExpression) {
        throw new Error("Method not implemented.");
    }
    visitComparison(node: Comparison) {
        throw new Error("Method not implemented.");
    }
    visitGetSensorValue(node: GetSensorValue) {
        throw new Error("Method not implemented.");
    }
}