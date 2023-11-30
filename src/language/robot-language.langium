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
    Expression | ControlStructure | SetSpeed | Mouvement | VariableRedeclaration | FunctionCall | VariableDeclaration;

ControlStructure:
    Condition | Loop;

Loop:
    'loop' be=BooleanExpression block=Block;

Condition:
    'if' be=BooleanExpression block=Block;


VariableDeclaration:
    'var' name=ID '=' expression=Expression;

VariableRedeclaration:
    variableName=[VariableDeclaration:ID] '=' expression=Expression;

Expression:
    ArithmeticExpression | BooleanExpression;

VariableCall:
    variableCall=[VariableDeclaration:ID];

FunctionCall:
    function=[Fn:ID] '(' (args+=Expression (',' args+=Expression)*)? ')';

SetSpeed:
    'set_speed' speed=ArithmeticExpression unit=Unit;

ArithmeticExpression infers Expression:
    AdditionExpression;

AdditionExpression infers Expression:
    MultiplicationExpression ({infer BinaryArithmeticExpression.left=current} operator=('+' | '-') right=MultiplicationExpression)*;

MultiplicationExpression infers Expression:
    PrimaryArithmeticExpression ({infer BinaryArithmeticExpression.left=current} operator=('*' | '/') right=PrimaryArithmeticExpression)*;

PrimaryArithmeticExpression infers Expression:
    '(' ArithmeticExpression ')' |
    value=INT |
    {infer GetSensorValue} sensorValue=GetSensorValue |
    func=FunctionCall |
    variable=VariableCall;

BooleanExpression infers Expression:
    OrExpression;

OrExpression infers Expression:
    AndExpression ({infer BinaryBooleanExpression.left=current} operator='or' right=AndExpression)*;

AndExpression infers Expression:
    PrimaryBooleanExpression ({infer BinaryBooleanExpression.left=current} operator='and' right=PrimaryBooleanExpression)*;

PrimaryBooleanExpression infers Expression:
    '(' BooleanExpression ')' |
    value=ConstantBooleanValue |
    func=FunctionCall |
    variable=VariableCall |
    {infer Comparison} comparison=Comparison;

Comparison:
    ae1=ArithmeticExpression operator=RelationalOperator ae2=ArithmeticExpression;

RelationalOperator returns string:
    '==' | '!=' | '>' | '<' | '>=' | '<=';

ConstantBooleanValue returns string:
    'true' | 'false';

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
    timestamp=GetTimestamp | speed=GetSpeed | distance=GetDistance;

GetTimestamp returns string:
    'get_timestamp';

GetSpeed returns string:
    'get_speed';

GetDistance returns string:
    'get_distance';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
