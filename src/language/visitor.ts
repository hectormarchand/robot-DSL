import * as ASTInterfaces from './generated/ast.js';
import { AstNode, Reference } from 'langium';

export interface RoboMLVisitor {
    visitBlock(node: Block): any;

    visitExpression(node: Expression): any;

    visitFn(node: Fn): any;

    visitFunctionCall(node: FunctionCall): any;

    visitCondition(node: Condition): any;

    visitGoBackward(node: GoBackward): any;

    visitGoForward(node: GoForward): any;

    visitLoop(node: Loop): any;

    visitModel(node: Model): any;

    visitSetSpeed(node: SetSpeed): any;

    visitTurnLeft(node: TurnLeft): any;

    visitTurnRight(node: TurnRight): any;

    visitVariableCall(node: VariableCall): any;

    visitVariableDeclaration(node: VariableDeclaration): any;

    visitVariableRedeclaration(node: VariableRedeclaration): any;

    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression): any;

    visitBinaryBooleanExpression(node: BinaryBooleanExpression): any;

    visitComparison(node: Comparison): any;

    visitGetSensorValue(node: GetSensorValue): any;

    visitPrint(node: Print): any;

    visitConstantBooleanValue(node: ConstantBooleanValue): any;
}

export class Block implements ASTInterfaces.Block {
    $container: ASTInterfaces.Condition | ASTInterfaces.Fn | ASTInterfaces.Loop;
    $type: 'Block';
    statements: ASTInterfaces.Statement[];

    constructor(
        container: ASTInterfaces.Condition | ASTInterfaces.Fn | ASTInterfaces.Loop,
        statements: ASTInterfaces.Statement[],
    ) {
        this.$container = container;
        this.statements = statements;
        this.$type = "Block";
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitBlock(this);
    }
}

export class Condition implements ASTInterfaces.Condition {
    $container: ASTInterfaces.Block;
    $type: 'Condition';
    be: ASTInterfaces.Expression; // boolean expression
    block: ASTInterfaces.Block;

    constructor(
        container: ASTInterfaces.Block,
        be: ASTInterfaces.Expression,
        block: ASTInterfaces.Block
    ) {
        this.$container = container;
        this.$type = "Condition";
        this.be = be;
        this.block = block;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitCondition(this);
    }
}

export class Expression implements ASTInterfaces.Expression {
    func: ASTInterfaces.FunctionCall;
    $type: 'BinaryArithmeticExpression' | 'BinaryBooleanExpression' | 'Expression' | 'GetSensorValue';
    comparison: ASTInterfaces.Comparison;
    value: number | ASTInterfaces.ConstantBooleanValue;
    variable: ASTInterfaces.VariableCall;

    constructor(
        type: 'BinaryArithmeticExpression' | 'BinaryBooleanExpression' | 'Expression' | 'GetSensorValue',
        func: ASTInterfaces.FunctionCall,
        comparison: ASTInterfaces.Comparison,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall
    ) {
        this.$type = type;
        this.func = func;
        this.comparison = comparison;
        this.value = value;
        this.variable = variable;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitExpression(this);
    }
}

export class Fn implements ASTInterfaces.Fn {
    $container: ASTInterfaces.Model;
    $type: 'Fn';
    args: ASTInterfaces.DeclaredParameter[];
    block: ASTInterfaces.Block;
    name: string;

    constructor(
        container: ASTInterfaces.Model,
        args: ASTInterfaces.DeclaredParameter[],
        block: ASTInterfaces.Block,
        name: string
    ) {
        this.$container = container;
        this.$type = 'Fn';
        this.args = args;
        this.block = block;
        this.name = name;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitFn(this);
    }
}

export class FunctionCall implements ASTInterfaces.FunctionCall {
    $container: ASTInterfaces.Block;
    $type: 'FunctionCall';
    args: ASTInterfaces.Expression[];
    functionName: Reference<ASTInterfaces.Fn>;
    
    constructor(
        container: ASTInterfaces.Block,
        args: ASTInterfaces.Expression[],
        functionName: Reference<ASTInterfaces.Fn>
    ) {
        this.$container = container;
        this.$type = "FunctionCall";
        this.args = args;
        this.functionName = functionName;
    }
    
    accept(visitor: RoboMLVisitor): any {
        return visitor.visitFunctionCall(this);
    }
}

export class GoBackward implements ASTInterfaces.GoBackward {
    $container: ASTInterfaces.Block;
    $type: 'GoBackward';
    distance: ASTInterfaces.Expression;
    unit: ASTInterfaces.Unit;

    constructor(
        container: ASTInterfaces.Block,
        distance: ASTInterfaces.Expression,
        unit: ASTInterfaces.Unit,
    ) {
        this.$container = container;
        this.$type = "GoBackward";
        this.distance = distance;
        this.unit = unit;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitGoBackward(this);
    }
}

export class GoForward implements ASTInterfaces.GoForward {
    $container: ASTInterfaces.Block;
    $type: 'GoForward';
    distance: ASTInterfaces.Expression;
    unit: ASTInterfaces.Unit;

    constructor(
        container: ASTInterfaces.Block,
        distance: ASTInterfaces.Expression,
        unit: ASTInterfaces.Unit,
    ) {
        this.$container = container;
        this.$type = "GoForward";
        this.distance = distance;
        this.unit = unit;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitGoForward(this);
    }
}

export class Loop implements ASTInterfaces.Loop {
    $container: ASTInterfaces.Block;
    $type: 'Loop';
    be: ASTInterfaces.Expression;
    block: ASTInterfaces.Block;

    constructor(
        container: ASTInterfaces.Block,
        be: ASTInterfaces.Expression,
        block: ASTInterfaces.Block
    ) {
        this.$container = container;
        this.$type = "Loop";
        this.be = be;
        this.block = block;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitLoop(this);
    }
}

export class Model implements ASTInterfaces.Model {
    $type: 'Model';
    fn: ASTInterfaces.Fn[];

    constructor(
        fn: ASTInterfaces.Fn[]
    ) {
        this.$type = "Model";
        this.fn = fn;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitModel(this);
    }
}

export class SetSpeed implements ASTInterfaces.SetSpeed {
    $container: ASTInterfaces.Block;
    $type: 'SetSpeed';
    speed: ASTInterfaces.Expression;
    unit: ASTInterfaces.Unit;

    constructor(
        container: ASTInterfaces.Block,
        speed: ASTInterfaces.Expression,
        unit: ASTInterfaces.Unit
    ) {
        this.$container = container;
        this.$type = "SetSpeed";
        this.speed = speed;
        this.unit = unit;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitSetSpeed(this);
    }
}

export class TurnLeft implements ASTInterfaces.TurnLeft {
    $container: ASTInterfaces.Block;
    $type: 'TurnLeft';
    angle: ASTInterfaces.Expression;

    constructor(
        container: ASTInterfaces.Block,
        angle: ASTInterfaces.Expression
    ) {
        this.$container = container;
        this.angle = angle;
        this.$type = "TurnLeft";
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitTurnLeft(this);
    }
}

export class TurnRight implements ASTInterfaces.TurnRight {
    $container: ASTInterfaces.Block;
    $type: 'TurnRight';
    angle: ASTInterfaces.Expression;

    constructor(
        container: ASTInterfaces.Block,
        angle: ASTInterfaces.Expression
    ) {
        this.$container = container;
        this.angle = angle;
        this.$type = "TurnRight";
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitTurnRight(this);
    }
}

export class VariableCall implements ASTInterfaces.VariableCall {
    $container: ASTInterfaces.Expression;
    $type: 'VariableCall';
    variableCall: Reference<ASTInterfaces.VariableDeclaration>;

    constructor(
        container: ASTInterfaces.Expression,
        variableCall: Reference<ASTInterfaces.VariableDeclaration>
    ) {
        this.$container = container;
        this.$type = "VariableCall";
        this.variableCall = variableCall;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitVariableCall(this);
    }
}

export class VariableDeclaration implements ASTInterfaces.VariableDeclaration {
    $container: ASTInterfaces.Block;
    $type: 'VariableDeclaration';
    expression: ASTInterfaces.Expression;
    name: string;

    constructor(
        container: ASTInterfaces.Block,
        expression: ASTInterfaces.Expression,
        name: string
    ) {
        this.$container = container;
        this.$type = "VariableDeclaration";
        this.expression = expression;
        this.name = name;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitVariableDeclaration(this);
    }
}

export class VariableRedeclaration implements ASTInterfaces.VariableRedeclaration {
    $container: ASTInterfaces.Block;
    $type: 'VariableRedeclaration';
    expression: ASTInterfaces.Expression;
    variableName: Reference<VariableDeclaration>;

    constructor(
        container: ASTInterfaces.Block,
        expression: ASTInterfaces.Expression,
        name: Reference<VariableDeclaration>
    ) {
        this.$container = container;
        this.$type = "VariableRedeclaration";
        this.expression = expression;
        this.variableName = name;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitVariableRedeclaration(this);
    }
}

export class BinaryArithmeticExpression implements ASTInterfaces.BinaryArithmeticExpression {
    $type: 'BinaryArithmeticExpression';
    left: ASTInterfaces.Expression;
    operator: '*' | '+' | '-' | '/';
    right: ASTInterfaces.Expression;
    func: ASTInterfaces.FunctionCall;
    value: number | ASTInterfaces.ConstantBooleanValue;
    variable: ASTInterfaces.VariableCall;
    comparison: ASTInterfaces.Comparison;

    constructor(
        left: ASTInterfaces.Expression,
        operator: '*' | '+' | '-' | '/',
        right: ASTInterfaces.Expression,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall,
        comparison: ASTInterfaces.Comparison
    ) {
        this.$type = "BinaryArithmeticExpression";
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.func = func;
        this.value = value;
        this.variable = variable;
        this.comparison = comparison;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitBinaryArithmeticExpression(this);
    }
}

export class BinaryBooleanExpression implements ASTInterfaces.BinaryBooleanExpression {
    $type: 'BinaryBooleanExpression';
    left: ASTInterfaces.Expression;
    operator: 'and' | 'or';
    right: ASTInterfaces.Expression;
    func: ASTInterfaces.FunctionCall;
    value: number | ASTInterfaces.ConstantBooleanValue;
    variable: ASTInterfaces.VariableCall;
    comparison: ASTInterfaces.Comparison;

    constructor(
        left: ASTInterfaces.Expression,
        operator: 'and' | 'or',
        right: ASTInterfaces.Expression,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall,
        comparison: ASTInterfaces.Comparison
    ) {
        this.$type = "BinaryBooleanExpression";
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.func = func;
        this.value = value;
        this.variable = variable;
        this.comparison = comparison;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitBinaryBooleanExpression(this);
    }
}

export class Comparison implements ASTInterfaces.Comparison {
    $container: ASTInterfaces.Expression;
    $type: 'Comparison';
    left: ASTInterfaces.Expression;
    right: ASTInterfaces.Expression;
    operator: ASTInterfaces.RelationalOperator;
    
    constructor (
        container: ASTInterfaces.Expression,
        left: ASTInterfaces.Expression,
        right: ASTInterfaces.Expression,
        operator: ASTInterfaces.RelationalOperator
    ) {
        this.$container = container;
        this.$type = "Comparison";
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
   

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitComparison(this);
    }
}

export class GetSensorValue implements ASTInterfaces.GetSensorValue {
    $container: ASTInterfaces.GetSensorValue;
    $type: 'GetSensorValue';
    distance?: 'get_distance' | undefined;
    sensorValue?: ASTInterfaces.GetSensorValue | undefined;
    speed?: 'get_speed' | undefined;
    timestamp?: 'get_timestamp' | undefined;
    func: ASTInterfaces.FunctionCall;
    value: number | ASTInterfaces.ConstantBooleanValue;
    variable: ASTInterfaces.VariableCall;
    comparison: ASTInterfaces.Comparison;

    constructor(
        container: ASTInterfaces.GetSensorValue,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall,
        comparison: ASTInterfaces.Comparison,
        distance?: 'get_distance' | undefined,
        sensorValue?: ASTInterfaces.GetSensorValue | undefined,
        speed?: 'get_speed' | undefined,
        timestamp?: 'get_timestamp' | undefined,
    ) {
        this.$container = container;
        this.$type = "GetSensorValue";
        this.func = func;
        this.value = value;
        this.variable = variable;
        this.comparison = comparison;
        this.distance = distance;
        this.sensorValue = sensorValue;
        this.speed = speed;
        this.timestamp = timestamp
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitGetSensorValue(this);
    }
}

export class Print implements ASTInterfaces.Print {
    $container: ASTInterfaces.Block;
    $type: 'Print';
    expression?: ASTInterfaces.Expression | undefined;
    str?: string | undefined;

    constructor(
        container: ASTInterfaces.Block,
        expression?: ASTInterfaces.Expression | undefined,
        str?: string | undefined
    ) {
        this.$container = container;
        this.$type = "Print";
        this.expression = expression;
        this.str = str;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitPrint(this);
    }
}

export class ConstantBooleanValue implements ASTInterfaces.ConstantBooleanValue {
    $container: ASTInterfaces.Expression;
    $type: 'ConstantBooleanValue';
    booleanValue: 'false' | 'true';

    constructor(
        container: ASTInterfaces.Expression,
        booleanValue: 'false' | 'true'
    ) {
        this.$container = container;
        this.$type = "ConstantBooleanValue";
        this.booleanValue = booleanValue;
    }

    accept(visitor: RoboMLVisitor): any {
        return visitor.visitConstantBooleanValue(this);
    }
}


export function acceptNode(node: AstNode, visitor: RoboMLVisitor): any {
    console.log("-->", node.$type);
    switch (node.$type) {
        case 'Block':
            return (node as Block).accept(visitor);
        case 'Expression':
            return (node as Expression).accept(visitor);
        case 'VariableDeclaration':
            return (node as VariableDeclaration).accept(visitor);
        case 'VariableRedeclaration':
            return (node as VariableRedeclaration).accept(visitor);
        case 'VariableCall':
            return (node as VariableCall).accept(visitor);
        case 'Fn':
            return (node as Fn).accept(visitor);
        case 'FunctionCall':
            return (node as FunctionCall).accept(visitor);
        case 'Condition':
            return (node as Condition).accept(visitor);
        case 'Loop':
            return (node as Loop).accept(visitor);
        case 'GoForward':
            return (node as GoForward).accept(visitor);
        case 'GoBackward':
            return (node as GoBackward).accept(visitor);
        case 'TurnLeft':
            return (node as TurnLeft).accept(visitor);
        case 'TurnRight':
            return (node as TurnRight).accept(visitor);
        case 'SetSpeed':
            return (node as SetSpeed).accept(visitor);
        case 'BinaryArithmeticExpression':
            return (node as BinaryArithmeticExpression).accept(visitor);
        case 'BinaryBooleanExpression':
            return (node as BinaryBooleanExpression).accept(visitor);
        case 'Comparison':
            return (node as Comparison).accept(visitor);
        case 'GetSensorValue':
            return (node as GetSensorValue).accept(visitor);
        case 'Print':
            return (node as Print).accept(visitor);
        case 'ConstantBooleanValue':
            return (node as ConstantBooleanValue).accept(visitor);
        default:
            throw new Error("node not implemented");
    }
}