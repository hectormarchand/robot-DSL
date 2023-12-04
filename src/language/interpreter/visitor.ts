import { Robot } from "../../web/simulator/entities.js";
import { BaseScene } from "../../web/simulator/scene.js";
import { Vector } from "../../web/simulator/utils.js";
import { Expression, Unit } from "../generated/ast.js";
import { BinaryArithmeticExpression, BinaryBooleanExpression, Block, Comparison, Condition, ConstantBooleanValue, Fn, FunctionCall, GetDistance, GetSpeed, GetTimestamp, GoBackward, GoForward, Loop, Model, NumberLiteral, Print, RoboMLVisitor, SetSpeed, TurnLeft, TurnRight, VariableCall, VariableDeclaration, VariableRedeclaration, acceptNode } from "../visitor.js";

export class InterpreterVisitor implements RoboMLVisitor {

    private robot: Robot;
    private variables: Map<string,Expression>;

    constructor() {
        this.robot = new Robot(new Vector(100, 100), new Vector(20, 20), 0, 0, new BaseScene());
        this.variables = new Map<string, Expression>();
    }


    visitBlock(node: Block) {
        for (let statement of node.statements) {
            acceptNode(statement, this);
        }
    }
    visitFn(node: Fn) {
        return acceptNode(node.block, this);
    }
    visitFunctionCall(node: FunctionCall) {
        if (!node.functionName.ref) {
            throw new Error("function ref is undefined");
        }
        return acceptNode(node.functionName.ref, this);
    }
    visitCondition(node: Condition) {
        const res = acceptNode(node.be, this);
        console.log("be :", res);
        if (res) {
            return acceptNode(node.block, this);
        }
    }
    visitGoBackward(node: GoBackward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(-distance);
    }
    visitGoForward(node: GoForward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(distance);
    }
    visitLoop(node: Loop) {
        while (acceptNode(node.be, this)) {
            acceptNode(node.block, this);
        }
    }
    visitModel(node: Model) {
        for (let fn of node.fn) {
            if (fn.name === "entry") {
                return acceptNode(fn, this);
            }
        }
    }
    visitSetSpeed(node: SetSpeed) {
        const speed: number = this.toMeters(acceptNode(node.speed, this), node.unit);
        this.robot.speed = speed;
    }
    visitTurnLeft(node: TurnLeft) {
        this.robot.turn(2 * Math.PI - acceptNode(node.angle, this));
    }
    visitTurnRight(node: TurnRight) {
        this.robot.turn(acceptNode(node.angle, this));
    }
    visitVariableCall(node: VariableCall) {
        if (!node.variableCall.ref) {
            throw new Error("variable ref is undefined");
        }
        return this.variables.get(node.variableCall.ref?.name);
    }
    visitVariableDeclaration(node: VariableDeclaration) {
        this.variables.set(node.name, acceptNode(node.expression, this));
    }
    visitVariableRedeclaration(node: VariableRedeclaration) {
        if (!node.variableName.ref) {
            throw new Error("variable ref is undefined");
        }
        this.variables.set(node.variableName.ref?.name, acceptNode(node.expression, this))
    }
    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression) {
        switch (node.operator) {
            case '+':
                return acceptNode(node.left, this) + acceptNode(node.right, this);
            case '-':
                return acceptNode(node.left, this) - acceptNode(node.right, this);
            case '*':
                return acceptNode(node.left, this) * acceptNode(node.right, this);
            case '/':
                return acceptNode(node.left, this) / acceptNode(node.right, this);
            default:
                throw new Error("operator not implemented");
        }
    }
    visitBinaryBooleanExpression(node: BinaryBooleanExpression) {
        switch (node.operator) {
            case 'and':
                return acceptNode(node.left, this) && acceptNode(node.right, this);
            case 'or':
                return acceptNode(node.left, this) || acceptNode(node.right, this);
            default:
                throw new Error("operator not implemented");
        }
    }
    visitComparison(node: Comparison) {
        switch (node.operator) {
            case '!=':
                return acceptNode(node.left, this) != acceptNode(node.right, this);
            case '==':
                return acceptNode(node.left, this) == acceptNode(node.right, this);
            case '<':
                return acceptNode(node.left, this) < acceptNode(node.right, this);
            case '<=':
                return acceptNode(node.left, this) <= acceptNode(node.right, this);
            case '>':
                return acceptNode(node.left, this) > acceptNode(node.right, this);
            case '>=':
                return acceptNode(node.left, this) >= acceptNode(node.right, this);
            default:
                throw new Error("operator not implemented")
        }
    }
    visitPrint(node: Print) {
        if (node.expression) {
            console.log(acceptNode(node.expression, this));
        } else if (node.str) {
            console.log(node.str);
        }
    }
    visitConstantBooleanValue(node: ConstantBooleanValue) {
        return node.booleanValue === 'true';
    }
    visitGetSpeed(node: GetSpeed) {
        return this.robot.speed;
    }
    visitGetDistance(node: GetDistance) {
        return 100;
    }
    visitGetTimestamp(node: GetTimestamp) {
        return 150;    
    }
    visitNumberLiteral(node: NumberLiteral) {
        return node.value;
    }


    private toMeters(distance: number, unit: Unit): number {
        switch (unit) {
            case "cm":
                distance /= 100;
                break;
            case "mm":
                distance /= 1000;
                break;
            default:
        }
        return distance;
    }
}