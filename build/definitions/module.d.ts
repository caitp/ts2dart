/// <reference path="../node_modules/typescript/bin/typescript.d.ts" />
import ts = require('typescript');
import base = require('./base');
import ts2dart = require('./main');
import { FacadeConverter } from './facade_converter';
export default class ModuleTranspiler extends base.TranspilerBase {
    private fc;
    private generateLibraryName;
    constructor(tr: ts2dart.Transpiler, fc: FacadeConverter, generateLibraryName: boolean);
    visitNode(node: ts.Node): boolean;
    private static isIgnoredImport(e);
    private visitExternalModuleReferenceExpr(expr);
    private isEmptyImport(n);
    private filterImports(ns);
    private static DART_RESERVED_WORDS;
    private static DART_OTHER_KEYWORDS;
    getLibraryName(nameForTest?: string): string;
}
