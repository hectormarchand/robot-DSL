import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { RobotLanguageAstType } from './generated/ast.js';
import * as InterfaceAST from './generated/ast.js';
import * as ClassAST from './visitor.js';
import { RoboMLVisitor } from './visitor.js';
import type { RobotLanguageServices } from './robot-language-module.js';

/**
 * Register custom validation checks.
 * TODO : Call this function in the language module.ts file (see registerValidationChecks(...);)
 */
export function weaveAcceptMethods(services: RobotLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const weaver = services.validation.RobotAcceptWeaver
    registry.register(weaver.checks, weaver);
}

/**
 * TODO :
 * You must implement a weaving function for each concrete concept of the language.
 * you will also need to fill the check data structure to map the weaving function to the Type of node
 */
export class RoboMlAcceptWeaver {
    weaveBlock(node: InterfaceAST.Block, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitBlock(node as unknown as ClassAST.Block);}
    }

    weaveExpression(node: InterfaceAST.Expression, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitExpression(node as unknown as ClassAST.Expression);}
    }

    weaveFn(node: InterfaceAST.Fn, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitFn(node as unknown as ClassAST.Fn);}
    }

    weaveCondition(node: InterfaceAST.Condition, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitCondition(node as unknown as ClassAST.Condition);}
    }

    weaveGoForward(node: InterfaceAST.GoForward, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitGoForward(node as unknown as ClassAST.GoForward);}
    }

    weaveGoBackward(node: InterfaceAST.GoBackward, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitGoBackward(node as unknown as ClassAST.GoBackward);}
    }

    weaveLoop(node: InterfaceAST.Loop, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitLoop(node as unknown as ClassAST.Loop);}
    }

    weaveModel(node: InterfaceAST.Model, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitModel(node as unknown as ClassAST.Model);}
    }

    weaveSetSpeed(node: InterfaceAST.SetSpeed, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitSetSpeed(node as unknown as ClassAST.SetSpeed);}
    }

    weaveTurnLeft(node: InterfaceAST.TurnLeft, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitTurnLeft(node as unknown as ClassAST.TurnLeft);}
    }

    weaveTurnRight(node: InterfaceAST.TurnRight, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitTurnRight(node as unknown as ClassAST.TurnRight);}
    }

    weaveVariableCall(node: InterfaceAST.VariableCall, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitVariableCall(node as unknown as ClassAST.VariableCall);}
    }

    weaveVariableDeclaration(node: InterfaceAST.VariableDeclaration, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitVariableDeclaration(node as unknown as ClassAST.VariableDeclaration);}
    }

    weaveVariableRedeclation(node: InterfaceAST.VariableRedeclaration, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitVariableRedeclaration(node as unknown as ClassAST.VariableRedeclaration);}
    }

    weaveBinaryArithmeticExpression(node: InterfaceAST.BinaryArithmeticExpression, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitBinaryArithmeticExpression(node as unknown as ClassAST.BinaryArithmeticExpression);}
    }

    weaveBinaryBooleanExpression(node: InterfaceAST.BinaryBooleanExpression, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitBinaryBooleanExpression(node as unknown as ClassAST.BinaryBooleanExpression);}
    }

    weaveComparison(node: InterfaceAST.Comparison, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitComparison(node as unknown as ClassAST.Comparison);}
    }

    weaveGetSensorValue(node: InterfaceAST.GetSensorValue, accept: ValidationAcceptor) : void {
        (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitGetSensorValue(node as unknown as ClassAST.GetSensorValue);}
    }

    checks: ValidationChecks<RobotLanguageAstType> = {
        Block: this.weaveBlock,
        Expression: this.weaveExpression,
        Fn: this.weaveFn,
        Condition: this.weaveCondition,
        GoBackward: this.weaveGoBackward,
        GoForward: this.weaveGoForward,
        Loop: this.weaveLoop,
        Model: this.weaveModel,
        SetSpeed: this.weaveSetSpeed,
        TurnLeft: this.weaveTurnLeft,
        TurnRight: this.weaveTurnRight,
        VariableCall: this.weaveVariableCall,
        VariableDeclaration: this.weaveVariableDeclaration,
        VariableRedeclaration: this.weaveVariableRedeclation,
        BinaryArithmeticExpression: this.weaveBinaryArithmeticExpression,
        BinaryBooleanExpression: this.weaveBinaryBooleanExpression,
        Comparison: this.weaveComparison,
        GetSensorValue: this.weaveGetSensorValue
    };

}