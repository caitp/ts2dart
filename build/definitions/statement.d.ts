/// <reference path="../node_modules/typescript/bin/typescript.d.ts" />
import ts = require('typescript');
import base = require('./base');
import ts2dart = require('./main');
declare class StatementTranspiler extends base.TranspilerBase {
    constructor(tr: ts2dart.Transpiler);
    visitNode(node: ts.Node): boolean;
}
export = StatementTranspiler;
