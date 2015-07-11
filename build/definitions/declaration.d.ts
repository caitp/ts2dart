/// <reference path="../node_modules/typescript/bin/typescript.d.ts" />
import ts = require('typescript');
import base = require('./base');
import ts2dart = require('./main');
import { FacadeConverter } from './facade_converter';
declare class DeclarationTranspiler extends base.TranspilerBase {
    private fc;
    constructor(tr: ts2dart.Transpiler, fc: FacadeConverter);
    visitNode(node: ts.Node): boolean;
    private visitVariableDeclarationType(varDecl);
    private visitFunctionLike(fn, accessor?);
    private visitParameters(parameters);
    /**
     * Visit a property declaration.
     * In the special case of property parameters in a constructor, we also allow a parameter to be
     * emitted as a property.
     */
    private visitProperty(decl, isParameter?);
    private visitClassLike(keyword, decl);
    /** Returns the parameters passed to @IMPLEMENTS as the identifier's string values. */
    private getImplementsDecorators(decorators);
    private visitDecorators(decorators);
    private visitDeclarationMetadata(decl);
    private visitNamedParameter(paramDecl);
    /**
     * Handles a function typedef-like interface, i.e. an interface that only declares a single
     * call signature, by translating to a Dart `typedef`.
     */
    private visitFunctionTypedefInterface(name, signature, typeParameters);
}
export = DeclarationTranspiler;
