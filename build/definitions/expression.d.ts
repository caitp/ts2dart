/// <reference path="../node_modules/typescript/bin/typescript.d.ts" />
import ts = require('typescript');
import base = require('./base');
import ts2dart = require('./main');
import { FacadeConverter } from './facade_converter';
declare class ExpressionTranspiler extends base.TranspilerBase {
    private fc;
    constructor(tr: ts2dart.Transpiler, fc: FacadeConverter);
    visitNode(node: ts.Node): boolean;
}
export = ExpressionTranspiler;
