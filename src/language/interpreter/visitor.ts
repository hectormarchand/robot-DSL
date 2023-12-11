import { wsServer } from "../../web/app.js";
import { Robot } from "../../web/simulator/entities.js";
import { BaseScene, Scene } from "../../web/simulator/scene.js";
import { Vector } from "../../web/simulator/utils.js";
import { Expression, Unit } from "../generated/ast.js";
import { BinaryArithmeticExpression, BinaryBooleanExpression, Block, Comparison, Condition, ConstantBooleanValue, Fn, FunctionCall, GetDistance, GetSpeed, GetTimestamp, GoBackward, GoForward, Loop, Model, NumberLiteral, Print, RoboMLVisitor, SetSpeed, TurnLeft, TurnRight, VariableCall, VariableDeclaration, VariableRedeclaration, acceptNode } from "../visitor.js";

export class InterpreterVisitor implements RoboMLVisitor {

    private scene: Scene;
    private robot: Robot;
    private variables: Map<string,Expression>;
    public wait: boolean;

    constructor() {
        this.scene = new BaseScene();
        this.robot = this.scene.robot;
        //this.robot = new Robot(new Vector(100, 100), new Vector(20, 20), 0, 0, new BaseScene());
        this.variables = new Map<string, Expression>();
        this.wait = false;

        this.sendSceneToClient(this.scene);
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
        if (acceptNode(node.be, this)) {
            return acceptNode(node.block, this);
        } else if (node.elseBlock){
            return acceptNode(node.elseBlock, this);
        }
    }
    async visitGoBackward(node: GoBackward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(-distance);

        this.sendRobotToClient({dist: -distance, angle: 0});
    }
    async visitGoForward(node: GoForward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(distance);

        this.sendRobotToClient({dist: distance, angle: 0});
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
        let angle: number = acceptNode(node.angle, this) * Math.PI / 180; // degree to radian

        this.robot.turn(-angle);

        this.sendRobotToClient({dist: 0, angle: -angle});
    }
    visitTurnRight(node: TurnRight) {
        let angle: number = acceptNode(node.angle, this) * Math.PI / 180; // degree to radian

        this.robot.turn(angle);
        
        this.sendRobotToClient({dist: 0, angle: angle});
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
        const poi: Vector | undefined = this.robot.getRay().intersect(this.scene.entities);

        if (poi) {
            const dist: number = poi.distanceTo(this.robot.pos);
            return dist;
        }
        return 100000;
    }
    visitGetTimestamp(node: GetTimestamp) {
        return this.scene.timestamps[0].time;
    }
    visitNumberLiteral(node: NumberLiteral) {
        return node.value;
    }

    getScene(): Scene {
        return this.scene;
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

    private sendRobotToClient({dist, angle}: {dist: number, angle: number}): void {
        wsServer.emitRobot({dist, angle});
    }

    private sendSceneToClient(scene: Scene): void {
        wsServer.emitScene(this.scene);
    }
}
