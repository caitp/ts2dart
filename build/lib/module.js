var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var ModuleTranspiler = (function (_super) {
    __extends(ModuleTranspiler, _super);
    function ModuleTranspiler(tr, fc, generateLibraryName) {
        _super.call(this, tr);
        this.fc = fc;
        this.generateLibraryName = generateLibraryName;
    }
    ModuleTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 228 /* SourceFile */:
                if (this.generateLibraryName) {
                    this.emit('library');
                    this.emit(this.getLibraryName());
                    this.emit(';');
                }
                ts.forEachChild(node, this.visit.bind(this));
                break;
            case 1 /* EndOfFileToken */:
                ts.forEachChild(node, this.visit.bind(this));
                break;
            case 210 /* ImportDeclaration */:
                var importDecl = node;
                if (this.isEmptyImport(importDecl))
                    return true;
                this.emit('import');
                this.visitExternalModuleReferenceExpr(importDecl.moduleSpecifier);
                if (importDecl.importClause) {
                    this.visit(importDecl.importClause);
                }
                else {
                    this.reportError(importDecl, 'bare import is unsupported');
                }
                this.emit(';');
                break;
            case 211 /* ImportClause */:
                var importClause = node;
                if (importClause.name)
                    this.fc.visitTypeName(importClause.name);
                if (importClause.namedBindings) {
                    this.visit(importClause.namedBindings);
                }
                break;
            case 212 /* NamespaceImport */:
                var nsImport = node;
                this.emit('as');
                this.fc.visitTypeName(nsImport.name);
                break;
            case 213 /* NamedImports */:
                this.emit('show');
                var used = this.filterImports(node.elements);
                if (used.length === 0) {
                    this.reportError(node, 'internal error, used imports must not be empty');
                }
                this.visitList(used);
                break;
            case 217 /* NamedExports */:
                var exportElements = node.elements;
                this.emit('show');
                if (exportElements.length === 0)
                    this.reportError(node, 'empty export list');
                this.visitList(node.elements);
                break;
            case 214 /* ImportSpecifier */:
            case 218 /* ExportSpecifier */:
                var spec = node;
                if (spec.propertyName) {
                    this.reportError(spec.propertyName, 'import/export renames are unsupported in Dart');
                }
                this.fc.visitTypeName(spec.name);
                break;
            case 216 /* ExportDeclaration */:
                var exportDecl = node;
                this.emit('export');
                if (exportDecl.moduleSpecifier) {
                    this.visitExternalModuleReferenceExpr(exportDecl.moduleSpecifier);
                }
                else {
                    this.reportError(node, 're-exports must have a module URL (export x from "./y").');
                }
                if (exportDecl.exportClause)
                    this.visit(exportDecl.exportClause);
                this.emit(';');
                break;
            case 209 /* ImportEqualsDeclaration */:
                var importEqDecl = node;
                this.emit('import');
                this.visit(importEqDecl.moduleReference);
                this.emit('as');
                this.fc.visitTypeName(importEqDecl.name);
                this.emit(';');
                break;
            case 220 /* ExternalModuleReference */:
                this.visitExternalModuleReferenceExpr(node.expression);
                break;
            default:
                return false;
        }
        return true;
    };
    ModuleTranspiler.isIgnoredImport = function (e) {
        // TODO: unify with facade_converter.ts
        var name = base.ident(e.name);
        switch (name) {
            case 'CONST':
            case 'CONST_EXPR':
            case 'forwardRef':
            case 'ABSTRACT':
            case 'IMPLEMENTS':
                return true;
            default:
                return false;
        }
    };
    ModuleTranspiler.prototype.visitExternalModuleReferenceExpr = function (expr) {
        // TODO: what if this isn't a string literal?
        var moduleName = expr;
        var text = moduleName.text;
        if (text.match(/^\.\//)) {
            // Strip './' to be more Dart-idiomatic.
            text = text.substring(2);
        }
        else if (!text.match(/^\.\.\//)) {
            // Unprefixed imports are package imports.
            text = 'package:' + text;
        }
        this.emit(JSON.stringify(text + '.dart'));
    };
    ModuleTranspiler.prototype.isEmptyImport = function (n) {
        var bindings = n.importClause.namedBindings;
        if (bindings.kind != 213 /* NamedImports */)
            return false;
        var elements = bindings.elements;
        // An import list being empty *after* filtering is ok, but if it's empty in the code itself,
        // it's nonsensical code, so probably a programming error.
        if (elements.length === 0)
            this.reportError(n, 'empty import list');
        return elements.every(ModuleTranspiler.isIgnoredImport);
    };
    ModuleTranspiler.prototype.filterImports = function (ns) {
        return ns.filter(function (e) { return !ModuleTranspiler.isIgnoredImport(e); });
    };
    ModuleTranspiler.prototype.getLibraryName = function (nameForTest) {
        var fileName = this.getRelativeFileName(nameForTest);
        var parts = fileName.split('/');
        return parts.filter(function (p) { return p.length > 0; })
            .map(function (p) { return p.replace(/[^\w.]/g, '_'); })
            .map(function (p) { return p.replace(/\.[jt]s$/g, ''); })
            .map(function (p) { return ModuleTranspiler.DART_RESERVED_WORDS.indexOf(p) != -1 ? '_' + p : p; })
            .join('.');
    };
    // For the Dart keyword list see
    // https://www.dartlang.org/docs/dart-up-and-running/ch02.html#keywords
    ModuleTranspiler.DART_RESERVED_WORDS = ('assert break case catch class const continue default do else enum extends false final ' +
        'finally for if in is new null rethrow return super switch this throw true try var void ' +
        'while with')
        .split(/ /);
    // These are the built-in and limited keywords.
    ModuleTranspiler.DART_OTHER_KEYWORDS = ('abstract as async await deferred dynamic export external factory get implements import ' +
        'library operator part set static sync typedef yield')
        .split(/ /);
    return ModuleTranspiler;
})(base.TranspilerBase);
exports["default"] = ModuleTranspiler;

//# sourceMappingURL=module.js.map