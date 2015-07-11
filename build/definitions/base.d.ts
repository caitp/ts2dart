/// <reference path="../node_modules/typescript/bin/typescript.d.ts" />
import ts = require('typescript');
import ts2dart = require('./main');
export declare type ClassLike = ts.ClassDeclaration | ts.InterfaceDeclaration;
export declare function ident(n: ts.Node): string;
export declare class TranspilerBase {
    private transpiler;
    constructor(transpiler: ts2dart.Transpiler);
    visit(n: ts.Node): void;
    emit(s: string): void;
    emitNoSpace(s: string): void;
    reportError(n: ts.Node, message: string): void;
    visitNode(n: ts.Node): boolean;
    visitEach(nodes: ts.Node[]): void;
    visitEachIfPresent(nodes?: ts.Node[]): void;
    visitList(nodes: ts.Node[], separator?: string): void;
    getAncestor(n: ts.Node, kind: ts.SyntaxKind): ts.Node;
    hasAncestor(n: ts.Node, kind: ts.SyntaxKind): boolean;
    hasAnnotation(decorators: ts.NodeArray<ts.Decorator>, name: string): boolean;
    hasFlag(n: {
        flags: number;
    }, flag: ts.NodeFlags): boolean;
    isConst(decl: ClassLike): boolean;
    getRelativeFileName(fileName: string): string;
    maybeVisitTypeArguments(n: {
        typeArguments?: ts.NodeArray<ts.TypeNode>;
    }): void;
}
