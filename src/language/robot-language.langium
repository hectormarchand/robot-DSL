grammar RobotLanguage

entry Model:
    fn+=Fn*;

Fn:
    'def' name=ID ('(' (args+=DeclaredParameter (',' args+=DeclaredParameter)*)? ')')
        block=Block; 

DeclaredParameter:
    name=ID;

Block:
    '{' (statements+=Statement | variableDeclarations+=VariableDeclaration)* '}';

Statement:
    Expression | ControlStructure | SetSpeed | Mouvement | VariableRedeclaration | FunctionCall;

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
    ae=ArithmeticExpression | be=BooleanExpression;

VariableCall:
    variableCall=[VariableDeclaration:ID];

FunctionCall:
    function=[Fn:ID] '(' (args+=Expression (',' args+=Expression)*)? ')';

SetSpeed:
    'set_speed' speed=ArithmeticExpression;

ArithmeticExpression:
    term=Term | term=Term operator=('+' | '-') arithmeticExpression=ArithmeticExpression;

Term:
    factor=Factor | factor=Factor operator=('*' | '/') term=Term;

Factor:
    number=INT | "(" arithmeticExpression=ArithmeticExpression ")" | var=VariableCall | value=GetSensorValue;

BooleanExpression:
    bt=BooleanTerm | bt=BooleanTerm or='or' be=BooleanExpression; 

BooleanTerm:
    bf=BooleanFactor | bf=BooleanFactor and='and' bt=BooleanTerm;

BooleanFactor:
    not='not' bf=BooleanFactor | '(' be=BooleanExpression ')' | comparison=Comparison | constant=ConstantBooleanValue | var=VariableCall;

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
