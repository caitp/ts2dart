/// <reference path="../node_modules/typescript/bin/typescript.d.ts" />
import base = require('./base');
import ts = require('typescript');
import ts2dart = require('./main');
export declare class FacadeConverter extends base.TranspilerBase {
    private tc;
    private candidateProperties;
    private candidateTypes;
    constructor(transpiler: ts2dart.Transpiler);
    private extractPropertyNames(m, candidates?);
    setTypeChecker(tc: ts.TypeChecker): void;
    maybeHandleCall(c: ts.CallExpression): boolean;
    handlePropertyAccess(pa: ts.PropertyAccessExpression): boolean;
    visitTypeName(typeName: ts.EntityName): void;
    private getHandler<T>(symbol, m);
    private getFileAndName(symbol);
    private isNamedType(node, fileName, qname);
    private reportMissingType(n, ident);
    isInsideConstExpr(node: ts.Node): boolean;
    private isConstCall(node);
    private emitCall(name, args?);
    private stdlibTypeReplacements;
    private TS_TO_DART_TYPENAMES;
    private stdlibHandlers;
    private callHandlers;
    private propertyHandlers;
}
