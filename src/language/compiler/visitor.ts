import { Robot } from "../../web/simulator/entities.js";
import { BaseScene } from "../../web/simulator/scene.js";
import { Vector } from "../../web/simulator/utils.js";
import { Unit } from "../generated/ast.js";
import { BinaryArithmeticExpression, BinaryBooleanExpression, Block, Comparison, Condition, ConstantBooleanValue, Fn, FunctionCall, GetDistance, GetSpeed, GetTimestamp, GoBackward, GoForward, Loop, Model, NumberLiteral, Print, RoboMLVisitor, SetSpeed, TurnLeft, TurnRight, VariableCall, VariableDeclaration, VariableRedeclaration, acceptNode } from "../visitor.js";

export class CompilerVisitor implements RoboMLVisitor {

    private robot: Robot;
    private codeCompiled: string;

    constructor() {
        this.robot = new Robot(new Vector(100, 100), new Vector(20, 20), 0, 0, new BaseScene());
        this.codeCompiled = "";
    }


    visitBlock(node: Block) {
        for (let statement of node.statements) {
            acceptNode(statement, this);
        }
    }
    visitFn(node: Fn) {
        if (node.name === "entry") {
            this.codeCompiled+="void loop() {\n";
            acceptNode(node.block, this);
            this.codeCompiled+="}\n";
        } else {
            this.codeCompiled+="void "+node.name+"() {\n";
            acceptNode(node.block, this);
            this.codeCompiled+="}\n";
        }
        //return acceptNode(node.block, this);
    }
    visitFunctionCall(node: FunctionCall) {
        if (!node.functionName.ref) {
            throw new Error("function ref is undefined");
        }
        this.codeCompiled+=node.functionName.ref.name+"();\n";
        //return acceptNode(node.functionName.ref, this);
    }
    visitCondition(node: Condition) {
        this.codeCompiled+="if ("+acceptNode(node.be,this)+") {\n";
        acceptNode(node.block, this);
        this.codeCompiled+="}\n";
    }
    visitGoBackward(node: GoBackward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(-distance);
        this.codeCompiled+="goBackward(-"+distance+");\n";
    }
    visitGoForward(node: GoForward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(distance);
        this.codeCompiled+="goForward("+distance+");\n";

    }
    visitLoop(node: Loop) {
        this.codeCompiled+="loop {\n";
        acceptNode(node.block, this);
        this.codeCompiled+="}\n";
    }
    visitModel(node: Model) {
        for (let fn of node.fn) {
            return acceptNode(fn, this);
        }
    }
    visitSetSpeed(node: SetSpeed) {
        const speed: number = this.toMeters(acceptNode(node.speed, this), node.unit);
        this.robot.speed = speed;
        this.codeCompiled+="setSpeed("+acceptNode(node.speed,this)+");\n";
    }
    visitTurnLeft(node: TurnLeft) {
        this.robot.turn(2 * Math.PI - acceptNode(node.angle, this));
        this.codeCompiled+="turnLeft("+acceptNode(node.angle,this)+");\n";
    }
    visitTurnRight(node: TurnRight) {
        this.robot.turn(acceptNode(node.angle, this));
        this.codeCompiled+="turnRight("+acceptNode(node.angle,this)+");\n";
    }
    visitVariableCall(node: VariableCall) {
        if (!node.variableCall.ref) {
            throw new Error("variable ref is undefined");
        }
        this.codeCompiled+=node.variableCall.ref.name;
        //return this.variables.get(node.variableCall.ref?.name);
    }
    visitVariableDeclaration(node: VariableDeclaration) {
        this.codeCompiled+="int "+node.name+" = "+acceptNode(node.expression, this)+";\n";
        //this.variables.set(node.name, acceptNode(node.expression, this));
    }
    visitVariableRedeclaration(node: VariableRedeclaration) {
        if (!node.variableName.ref) {
            throw new Error("variable ref is undefined");
        }
        this.codeCompiled+=node.variableName.ref.name+" = "+acceptNode(node.expression, this)+";\n";
        //this.variables.set(node.variableName.ref?.name, acceptNode(node.expression, this))
    }
    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression) {
        switch (node.operator) {
            case '+':
                this.codeCompiled+=acceptNode(node.left, this)+" + "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) + acceptNode(node.right, this);
            case '-':
                this.codeCompiled+=acceptNode(node.left, this)+" - "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) - acceptNode(node.right, this);
            case '*':
                this.codeCompiled+=acceptNode(node.left, this)+" * "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) * acceptNode(node.right, this);
            case '/':
                this.codeCompiled+=acceptNode(node.left, this)+" / "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) / acceptNode(node.right, this);
            default:
                throw new Error("operator not implemented");
        }
    }
    visitBinaryBooleanExpression(node: BinaryBooleanExpression) {
        switch (node.operator) {
            case 'and':
                this.codeCompiled+=acceptNode(node.left, this)+" && "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) && acceptNode(node.right, this);
            case 'or':
                this.codeCompiled+=acceptNode(node.left, this)+" || "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) || acceptNode(node.right, this);
            default:
                throw new Error("operator not implemented");
        }
    }
    visitComparison(node: Comparison) {
        switch (node.operator) {
            case '!=':
                this.codeCompiled+=acceptNode(node.left, this)+" != "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) != acceptNode(node.right, this);
            case '==':
                this.codeCompiled+=acceptNode(node.left, this)+" == "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) == acceptNode(node.right, this);
            case '<':
                this.codeCompiled+=acceptNode(node.left, this)+" < "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) < acceptNode(node.right, this);
            case '<=':
                this.codeCompiled+=acceptNode(node.left, this)+" <= "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) <= acceptNode(node.right, this);
            case '>':
                this.codeCompiled+=acceptNode(node.left, this)+" > "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) > acceptNode(node.right, this);
            case '>=':
                this.codeCompiled+=acceptNode(node.left, this)+" >= "+acceptNode(node.right, this)+"\n";
                //return acceptNode(node.left, this) >= acceptNode(node.right, this);
            default:
                throw new Error("operator not implemented")
        }
    }
    visitPrint(node: Print) {
        if (node.expression) {
            this.codeCompiled+="Serial.println("+acceptNode(node.expression, this)+");\n";
        } else if (node.str) {
            this.codeCompiled+="Serial.println("+node.str+");\n";
        }
    }
    visitConstantBooleanValue(node: ConstantBooleanValue) {
        if (node.booleanValue === 'true') {
            this.codeCompiled+="true";
        } else {
            this.codeCompiled+="false";
        }
    }
    visitGetSpeed(node: GetSpeed) {
        this.codeCompiled+="getSpeed()";
    }
    visitGetDistance(node: GetDistance) {
        this.codeCompiled+="getDistance()";
    }
    visitGetTimestamp(node: GetTimestamp) {
        this.codeCompiled+="millis()"; 
    }
    visitNumberLiteral(node: NumberLiteral) {
        this.codeCompiled+=node.value;
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

    public getCodeCompiled(): string {
        return this.codeCompiled;
    }
}