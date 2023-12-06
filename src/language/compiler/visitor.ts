import { Unit } from "../generated/ast.js";
import { BinaryArithmeticExpression, BinaryBooleanExpression, Block, Comparison, Condition, ConstantBooleanValue, Fn, FunctionCall, GetDistance, GetSpeed, GetTimestamp, GoBackward, GoForward, Loop, Model, NumberLiteral, Print, RoboMLVisitor, SetSpeed, TurnLeft, TurnRight, VariableCall, VariableDeclaration, VariableRedeclaration, acceptNode } from "../visitor.js";

export class CompilerVisitor implements RoboMLVisitor {

    private codeCompiled: string;

    constructor() {
        this.codeCompiled = "";
    }


    visitBlock(node: Block) {
        let res = "";
        for (let statement of node.statements) {
            res += acceptNode(statement, this);
        }
        return res;
    }
    visitFn(node: Fn) {
        if (node.name === "entry") {
            return "void loop() {\n" + acceptNode(node.block, this) + "}\n";
        } else {
            return "void "+node.name+"() {\n" + acceptNode(node.block, this) + "}\n";
        }
    }
    visitFunctionCall(node: FunctionCall) {
        if (!node.functionName.ref) {
            throw new Error("function ref is undefined");
        }
        return node.functionName.ref.name+"();\n";
    }
    visitCondition(node: Condition) {
        return "if (" + acceptNode(node.be,this)+") {\n" + acceptNode(node.block, this) +"}\n";
    }
    visitGoBackward(node: GoBackward) {
        return "goBackward(-" + acceptNode(node.distance, this)+","+this.getUnit(node.unit)+");\n";
    }
    visitGoForward(node: GoForward) {
        return "goForward(" + acceptNode(node.distance, this)+","+this.getUnit(node.unit)+");\n";
    }
    visitLoop(node: Loop) {
        return "while ("+acceptNode(node.be, this)+")" +" {\n" + acceptNode(node.block, this) + "}\n";
    }
    visitModel(node: Model) {
        for (let fn of node.fn) {
            this.codeCompiled+= acceptNode(fn, this) + "\n";
        }
    }
    visitSetSpeed(node: SetSpeed) {
        return "setSpeed(" + acceptNode(node.speed,this)+","+this.getUnit(node.unit)+");\n";
    }
    visitTurnLeft(node: TurnLeft) {
        return "turnLeft(" + acceptNode(node.angle,this)+");\n";
    }
    visitTurnRight(node: TurnRight) {
        return "turnRight(" + acceptNode(node.angle,this)+");\n";
    }
    visitVariableCall(node: VariableCall) {
        if (!node.variableCall.ref) {
            throw new Error("variable ref is undefined");
        }
        return node.variableCall.ref.name;
    }
    visitVariableDeclaration(node: VariableDeclaration) {
        return "int "+node.name+" = " + acceptNode(node.expression, this)+";\n";
    }
    visitVariableRedeclaration(node: VariableRedeclaration) {
        if (!node.variableName.ref) {
            throw new Error("variable ref is undefined");
        }
        return node.variableName.ref.name+" = " + acceptNode(node.expression, this)+";\n";
    }
    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression) {
        switch (node.operator) {
            case '+':
                return acceptNode(node.left, this)+" + " + acceptNode(node.right, this)+"\n";
            case '-':
                return acceptNode(node.left, this)+" - " + acceptNode(node.right, this)+"\n";
            case '*':
                return acceptNode(node.left, this)+" * " + acceptNode(node.right, this)+"\n";
            case '/':
                return acceptNode(node.left, this)+" / " + acceptNode(node.right, this)+"\n";
            default:
                throw new Error("operator not implemented");
        }
    }
    visitBinaryBooleanExpression(node: BinaryBooleanExpression) {
        switch (node.operator) {
            case 'and':
                return acceptNode(node.left, this)+" && " + acceptNode(node.right, this)+"\n";
            case 'or':
                return acceptNode(node.left, this)+" || " + acceptNode(node.right, this)+"\n";
            default:
                throw new Error("operator not implemented");
        }
    }
    visitComparison(node: Comparison) {
        switch (node.operator) {
            case '!=':
                return acceptNode(node.left, this)+" != " + acceptNode(node.right, this)+"\n";
            case '==':
                return acceptNode(node.left, this)+" == " + acceptNode(node.right, this)+"\n";
            case '<':
                return acceptNode(node.left, this)+" < " + acceptNode(node.right, this)+"\n";
            case '<=':
                return acceptNode(node.left, this)+" <= " + acceptNode(node.right, this)+"\n";
            case '>':
                return acceptNode(node.left, this)+" > " + acceptNode(node.right, this)+"\n";
            case '>=':
                return acceptNode(node.left, this)+" >= " + acceptNode(node.right, this)+"\n";
            default:
                throw new Error("operator not implemented")
        }
    }
    visitPrint(node: Print) {
        if (node.expression) {
            return "Serial.println(" + acceptNode(node.expression, this)+");\n";
        } else if (node.str) {
            return "Serial.println("+node.str+");\n";
        } else {
            throw new Error("print statement not implemented");
        }
    }
    visitConstantBooleanValue(node: ConstantBooleanValue) {
        if (node.booleanValue === 'true') {
            return "true";
        } else {
            return "false";
        }
    }
    visitGetSpeed(node: GetSpeed) {
        return "getSpeed()";
    }
    visitGetDistance(node: GetDistance) {
        return "getDistance()";
    }
    visitGetTimestamp(node: GetTimestamp) {
        return "millis()"; 
    }
    visitNumberLiteral(node: NumberLiteral) {
        return node.value.toString();
    }


    private getUnit(unit: Unit): string {
        switch (unit) {
            case "cm":
                return "cm";
                break;
            case "mm":
                return "mm";
                break;
            default:
                return "mm"
        }
    }

    public getCodeCompiled(): string {
        return this.codeCompiled;
    }
}