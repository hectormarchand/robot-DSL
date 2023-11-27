import * as ASTInterfaces from './generated/ast.js';
import { Reference } from 'langium';

export interface RoboMLVisitor{
    visitBlock(node : Block): any;

    visitExpression(node : Expression): any;

    visitFn(node: Fn): any;

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
}

export class Block implements ASTInterfaces.Block {
    $container: ASTInterfaces.Condition | ASTInterfaces.Loop | ASTInterfaces.Fn;
    $type: 'Block';
    statements: ASTInterfaces.Statement[];
    variableDeclarations: ASTInterfaces.VariableDeclaration[];

    constructor(
        container: ASTInterfaces.Condition | ASTInterfaces.Loop | ASTInterfaces.Fn,
        statements: ASTInterfaces.Statement[],
        variableDeclarations: ASTInterfaces.VariableDeclaration[]
    ) {
        this.$container = container;
        this.$type = "Block";
        this.statements = statements;
        this.variableDeclarations = variableDeclarations;
    }

    accept(visitor: RoboMLVisitor) : any {
        visitor.visitBlock(this);
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
        visitor.visitCondition(this);
    }
}

export class Expression implements ASTInterfaces.Expression {
    $type: 'BinaryArithmeticExpression' | 'BinaryBooleanExpression' | 'Comparison' | 'Expression' | 'GetSensorValue';
    func: ASTInterfaces.FunctionCall;
    value: number | ASTInterfaces.ConstantBooleanValue;
    variable: ASTInterfaces.VariableCall;
   
    constructor(
        type: 'BinaryArithmeticExpression' | 'BinaryBooleanExpression' | 'Comparison' | 'Expression' | 'GetSensorValue',
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall
    ) {
        this.$type = type;
        this.func = func;
        this.value = value;
        this.variable = variable;
    }

    accept(visitor: RoboMLVisitor): any {
        visitor.visitExpression(this);
    } 
}

export class Fn implements ASTInterfaces.Fn {
    $container: ASTInterfaces.Model;
    $type: 'Fn';
    args: ASTInterfaces.DeclaredParameter[];
    block: ASTInterfaces.Block;
    name: string;
   
    constructor (
        container: ASTInterfaces.Model,
        type: 'Fn',
        args: ASTInterfaces.DeclaredParameter[],
        block: ASTInterfaces.Block,
        name: string
    ) {
        this.$container = container;
        this.$type = type;
        this.args = args;
        this.block = block;
        this.name = name;
    }

    accept(visitor: RoboMLVisitor): any {
        visitor.visitFn(this);
    }
}

export class GoBackward implements ASTInterfaces.GoBackward {
    $container: ASTInterfaces.Block;
    $type: 'GoBackward';
    distance: ASTInterfaces.Expression;
    unit: ASTInterfaces.Unit;
    
    constructor (
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
        visitor.visitGoBackward(this);
    }
}

export class GoForward implements ASTInterfaces.GoForward {
    $container: ASTInterfaces.Block;
    $type: 'GoForward';
    distance: ASTInterfaces.Expression;
    unit: ASTInterfaces.Unit;
    
    constructor (
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
        visitor.visitGoForward(this);
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
        visitor.visitLoop(this);
    }
}

export class Model implements ASTInterfaces.Model {
    $type: 'Model';
    fn: ASTInterfaces.Fn[];
    
    constructor (
        fn: ASTInterfaces.Fn[]
    ) {
        this.$type = "Model";
        this.fn = fn;
    }

    accept(visitor: RoboMLVisitor): any {
        visitor.visitModel(this);
    }
}

export class SetSpeed implements ASTInterfaces.SetSpeed {
    $container: ASTInterfaces.Block;
    $type: 'SetSpeed';
    speed: ASTInterfaces.Expression;
    unit: ASTInterfaces.Unit;
   
    constructor (
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
        visitor.visitSetSpeed(this);
    }
}

export class TurnLeft implements ASTInterfaces.TurnLeft {
    $container: ASTInterfaces.Block;
    $type: 'TurnLeft';
    angle: ASTInterfaces.Expression;
    
    constructor (
        container: ASTInterfaces.Block,
        angle: ASTInterfaces.Expression
    ) {
        this.$container = container;
        this.angle = angle;
        this.$type = "TurnLeft";
    }

    accept(visitor: RoboMLVisitor): any {
        visitor.visitTurnLeft(this);
    }
}

export class TurnRight implements ASTInterfaces.TurnRight {
    $container: ASTInterfaces.Block;
    $type: 'TurnRight';
    angle: ASTInterfaces.Expression;
    
    constructor (
        container: ASTInterfaces.Block,
        angle: ASTInterfaces.Expression
    ) {
        this.$container = container;
        this.angle = angle;
        this.$type = "TurnRight";
    }

    accept(visitor: RoboMLVisitor): any {
        visitor.visitTurnRight(this);
    }
}

export class VariableCall implements ASTInterfaces.VariableCall {
    $container: ASTInterfaces.Expression;
    $type: 'VariableCall';
    variableCall: Reference<ASTInterfaces.VariableDeclaration>;
    
    constructor (
        container: ASTInterfaces.Expression,
        variableCall: Reference<ASTInterfaces.VariableDeclaration>
    ) {
        this.$container = container;
        this.$type = "VariableCall";
        this.variableCall = variableCall;
    }

    accept(visitor: RoboMLVisitor): any {
        visitor.visitVariableCall(this);
    }
}

export class VariableDeclaration implements ASTInterfaces.VariableDeclaration {
    $container: ASTInterfaces.Block;
    $type: 'VariableDeclaration';
    expression: ASTInterfaces.Expression;
    name: string;

    constructor (
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
        visitor.visitVariableDeclaration(this);
    }
}

export class VariableRedeclaration implements ASTInterfaces.VariableRedeclaration {
    $container: ASTInterfaces.Block;
    $type: 'VariableRedeclaration';
    expression: ASTInterfaces.Expression;
    variableName: Reference<VariableDeclaration>;

    constructor (
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
        visitor.visitVariableRedeclaration(this);
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
    
    constructor (
        left: ASTInterfaces.Expression,
        operator: '*' | '+' | '-' | '/',
        right: ASTInterfaces.Expression,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall
    ) {
        this.$type = "BinaryArithmeticExpression";
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.func = func;
        this.value = value;
        this.variable = variable;
    }
    
    accept(visitor: RoboMLVisitor): any {
        visitor.visitBinaryArithmeticExpression(this);
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
    
    constructor (
        left: ASTInterfaces.Expression,
        operator: 'and' | 'or',
        right: ASTInterfaces.Expression,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall
    ) {
        this.$type = "BinaryBooleanExpression";
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.func = func;
        this.value = value;
        this.variable = variable;
    }
    
    
    accept(visitor: RoboMLVisitor): any {
        visitor.visitBinaryBooleanExpression(this);
    }
}

export class Comparison implements ASTInterfaces.Comparison {
    $container: ASTInterfaces.Comparison;
    $type: 'Comparison';
    ae1?: ASTInterfaces.Expression | undefined;
    ae2?: ASTInterfaces.Expression | undefined;
    operator?: ASTInterfaces.RelationalOperator | undefined;
    func: ASTInterfaces.FunctionCall;
    value: number | ASTInterfaces.ConstantBooleanValue;
    variable: ASTInterfaces.VariableCall;

    constructor(
        container: ASTInterfaces.Comparison,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall,
        ae1?: ASTInterfaces.Expression | undefined,
        ae2?: ASTInterfaces.Expression | undefined,
        operator?: ASTInterfaces.RelationalOperator | undefined
    ) {
        this.$container = container;
        this.$type = "Comparison";
        this.ae1 = ae1;
        this.ae2 = ae2;
        this.operator = operator;
        this.func = func;
        this.value = value;
        this.variable = variable;
    }
        
    accept(visitor: RoboMLVisitor): any {
        visitor.visitComparison(this);
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

    constructor (
        container: ASTInterfaces.GetSensorValue,
        func: ASTInterfaces.FunctionCall,
        value: number | ASTInterfaces.ConstantBooleanValue,
        variable: ASTInterfaces.VariableCall,
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
        this.distance = distance;
        this.sensorValue = sensorValue;
        this.speed = speed;
        this.timestamp = timestamp
    }
    
    accept(visitor: RoboMLVisitor): any {
        visitor.visitGetSensorValue(this);
    }
    
}