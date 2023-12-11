grammar RobotLanguage

entry Model:
    fn+=Fn*;

Fn:
    'def' name=ID ('(' (args+=DeclaredParameter (',' args+=DeclaredParameter)*)? ')')
        block=Block; 

DeclaredParameter:
    name=ID;

Block:
    '{' (statements+=Statement)* '}';

Statement:
    Expression | ControlStructure | SetSpeed | Mouvement | VariableRedeclaration | FunctionCall | VariableDeclaration | Print;

ControlStructure:
    Condition | Loop;

Loop:
    'loop' be=BooleanExpression block=Block;

Condition:
    'if' be=BooleanExpression block=Block
    ('else' elseBlock=Block)?;


VariableDeclaration:
    'var' name=ID '=' expression=Expression;

type VariableOrParameter = DeclaredParameter | VariableDeclaration;

VariableRedeclaration:
    variableName=[VariableOrParameter:ID] '=' expression=Expression;

Expression:
    ArithmeticExpression | BooleanExpression;

VariableCall:
    variableCall=[VariableOrParameter:ID];

FunctionCall:
    functionName=[Fn:ID] '(' (args+=Expression (',' args+=Expression)*)? ')';

SetSpeed:
    'set_speed' speed=ArithmeticExpression unit=Unit;

Print:
    'print' (expression=Expression | str=STRING);

ArithmeticExpression infers Expression:
    AdditionExpression;

AdditionExpression infers Expression:
    MultiplicationExpression ({infer BinaryArithmeticExpression.left=current} operator=('+' | '-') right=MultiplicationExpression)*;

MultiplicationExpression infers Expression:
    PrimaryArithmeticExpression ({infer BinaryArithmeticExpression.left=current} operator=('*' | '/') right=PrimaryArithmeticExpression)*;

PrimaryArithmeticExpression infers Expression:
    '(' ArithmeticExpression ')' |
    {infer NumberLiteral} value=INT |
    GetSensorValue |
    VariableCall;

BooleanExpression infers Expression:
    OrExpression;

OrExpression infers Expression:
    AndExpression ({infer BinaryBooleanExpression.left=current} operator='or' right=AndExpression)*;

AndExpression infers Expression:
    PrimaryBooleanExpression ({infer BinaryBooleanExpression.left=current} operator='and' right=PrimaryBooleanExpression)*;

PrimaryBooleanExpression infers Expression:
    '(' BooleanExpression ')' |
    ConstantBooleanValue |
    VariableCall |
    Comparison;

Comparison:
    left=ArithmeticExpression operator=RelationalOperator right=ArithmeticExpression;

RelationalOperator returns string:
    '==' | '!=' | '>' | '<' | '>=' | '<=';

ConstantBooleanValue:
    booleanValue=('true' | 'false');

Mouvement:
    GoForward | GoBackward | TurnLeft | TurnRight;

GoForward:
    'forward' distance=ArithmeticExpression unit=Unit;

GoBackward:
    'backward' distance=ArithmeticExpression unit=Unit;

TurnLeft:
    'turn_left' angle=ArithmeticExpression;

TurnRight:
    'turn_right' angle=ArithmeticExpression;

Unit returns string:
    'mm' | 'cm' | 'm';

GetSensorValue:
    {infer GetTimestamp} "get_timestamp" | {infer GetDistance} "get_distance" | {infer GetSpeed} "get_speed";

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
