import { BinaryArithmeticExpression, BinaryBooleanExpression, Block, Comparison, Condition, ConstantBooleanValue, Fn, FunctionCall, GetDistance, GetSpeed, GetTimestamp, GoBackward, GoForward, Loop, Model, NumberLiteral, Print, RoboMLVisitor, SetSpeed, TurnLeft, TurnRight, VariableCall, VariableDeclaration, VariableRedeclaration, acceptNode } from "../visitor.js";

export class CompilerVisitor implements RoboMLVisitor {

    private codeTemplate: string;

    constructor() {
        this.codeTemplate = `
        #include <PinChangeInt.h>
        #include <PinChangeIntConfig.h>
        #include <EEPROM.h>
        #define _NAMIKI_MOTOR	 //for Namiki 22CL-103501PG80:1
        #include <fuzzy_table.h>
        #include <PID_Beta6.h>
        #include <MotorWheel.h>
        #include <Omni4WD.h>
        
        //#include <fuzzy_table.h>
        //#include <PID_Beta6.h>
        
        /*
        
                    \                    /
           wheel1   \                    /   wheel4
           Left     \                    /   Right
        
        
                                      power switch
        
                    /                    \
           wheel2   /                    \   wheel3
           Right    /                    \   Left
        
        */
        
        /*
          irqISR(irq1,isr1);
          MotorWheel wheel1(5,4,12,13,&irq1);
        
          irqISR(irq2,isr2);
          MotorWheel wheel2(6,7,14,15,&irq2);
        
          irqISR(irq3,isr3);
          MotorWheel wheel3(9,8,16,17,&irq3);
        
          irqISR(irq4,isr4);
          MotorWheel wheel4(10,11,18,19,&irq4);
        */
        
        irqISR(irq1, isr1);
        MotorWheel wheel1(3, 2, 4, 5, &irq1);
        
        irqISR(irq2, isr2);
        MotorWheel wheel2(11, 12, 14, 15, &irq2);
        
        irqISR(irq3, isr3);
        MotorWheel wheel3(9, 8, 16, 17, &irq3);
        
        irqISR(irq4, isr4);
        MotorWheel wheel4(10, 7, 18, 19, &irq4);
        
        
        Omni4WD Omni(&wheel1, &wheel2, &wheel3, &wheel4);
        
        void setup() {
          //TCCR0B=TCCR0B&0xf8|0x01;    // warning!! it will change millis()
          TCCR1B = TCCR1B & 0xf8 | 0x01; // Pin9,Pin10 PWM 31250Hz
          TCCR2B = TCCR2B & 0xf8 | 0x01; // Pin3,Pin11 PWM 31250Hz
        
          Omni.PIDEnable(0.31, 0.01, 0, 10);
        }`
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
            return "void " + node.name + "() {\n" + acceptNode(node.block, this) + "}\n";
        }
    }
    visitFunctionCall(node: FunctionCall) {
        if (!node.functionName.ref) {
            throw new Error("function ref is undefined");
        }
        return node.functionName.ref.name + "();\n";
    }
    visitCondition(node: Condition) {
        return "if (" + acceptNode(node.be, this) + ") {\n" + acceptNode(node.block, this) + "}\n";
    }
    visitGoBackward(node: GoBackward) {
        return "Omni.setCarBackoff(" + acceptNode(node.distance, this) + ");\n";
    }
    visitGoForward(node: GoForward) {
        return "Omni.setCarAdvance(" + acceptNode(node.distance, this) + ");\n";
    }
    visitLoop(node: Loop) {
        return "while (" + acceptNode(node.be, this) + ")" + " {\n" + acceptNode(node.block, this) + "}\n";
    }
    visitModel(node: Model): string {
        let builder: string = this.codeTemplate;
        for (let fn of node.fn) {
            builder += acceptNode(fn, this) + "\n";
        }
        return builder;
    }
    visitSetSpeed(node: SetSpeed) {
        return "Omni.setCarSpeedMMPS(" + acceptNode(node.speed, this) + ");\n";
    }
    visitTurnLeft(node: TurnLeft) {
        return "Omni.setCarRotateLeft(" + acceptNode(node.angle, this) + ");\n";
    }
    visitTurnRight(node: TurnRight) {
        return "Omni.setCarRotateRight(" + acceptNode(node.angle, this) + ");\n";
    }
    visitVariableCall(node: VariableCall) {
        if (!node.variableCall.ref) {
            throw new Error("variable ref is undefined");
        }
        return node.variableCall.ref.name;
    }
    visitVariableDeclaration(node: VariableDeclaration) {
        return "int " + node.name + " = " + acceptNode(node.expression, this) + ";\n";
    }
    visitVariableRedeclaration(node: VariableRedeclaration) {
        if (!node.variableName.ref) {
            throw new Error("variable ref is undefined");
        }
        return node.variableName.ref.name + " = " + acceptNode(node.expression, this) + ";\n";
    }
    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression) {
        switch (node.operator) {
            case '+':
                return acceptNode(node.left, this) + " + " + acceptNode(node.right, this) + "\n";
            case '-':
                return acceptNode(node.left, this) + " - " + acceptNode(node.right, this) + "\n";
            case '*':
                return acceptNode(node.left, this) + " * " + acceptNode(node.right, this) + "\n";
            case '/':
                return acceptNode(node.left, this) + " / " + acceptNode(node.right, this) + "\n";
            default:
                throw new Error("operator not implemented");
        }
    }
    visitBinaryBooleanExpression(node: BinaryBooleanExpression) {
        switch (node.operator) {
            case 'and':
                return acceptNode(node.left, this) + " && " + acceptNode(node.right, this) + "\n";
            case 'or':
                return acceptNode(node.left, this) + " || " + acceptNode(node.right, this) + "\n";
            default:
                throw new Error("operator not implemented");
        }
    }
    visitComparison(node: Comparison) {
        switch (node.operator) {
            case '!=':
                return acceptNode(node.left, this) + " != " + acceptNode(node.right, this) + "\n";
            case '==':
                return acceptNode(node.left, this) + " == " + acceptNode(node.right, this) + "\n";
            case '<':
                return acceptNode(node.left, this) + " < " + acceptNode(node.right, this) + "\n";
            case '<=':
                return acceptNode(node.left, this) + " <= " + acceptNode(node.right, this) + "\n";
            case '>':
                return acceptNode(node.left, this) + " > " + acceptNode(node.right, this) + "\n";
            case '>=':
                return acceptNode(node.left, this) + " >= " + acceptNode(node.right, this) + "\n";
            default:
                throw new Error("operator not implemented")
        }
    }
    visitPrint(node: Print) {
        if (node.expression) {
            return "Serial.println(" + acceptNode(node.expression, this) + ");\n";
        } else if (node.str) {
            return "Serial.println(" + node.str + ");\n";
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
        return "Omni.getCarSpeedMMPS()";
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


    // private getUnit(unit: Unit): string {
    //     switch (unit) {
    //         case "m":
    //             return "m";
    //         case "cm":
    //             return "cm";
    //         case  "mm":
    //             return "mm";
    //         default:
    //             throw new Error("Unit not supported");
    //     }
    // }
}