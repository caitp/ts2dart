/// <reference path='../typings/fs-extra/fs-extra.d.ts' />
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/source-map/source-map.d.ts' />
// Use the version of typescript installed by npm.
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
/// <reference path='../typings/minimist/minimist.d.ts' />
require('source-map-support').install();
var SourceMap = require('source-map');
var fs = require('fs');
var fsx = require('fs-extra');
var path = require('path');
var ts = require('typescript');
var CallTranspiler = require('./call');
var DeclarationTranspiler = require('./declaration');
var ExpressionTranspiler = require('./expression');
var module_1 = require('./module');
var StatementTranspiler = require('./statement');
var TypeTranspiler = require('./type');
var LiteralTranspiler = require('./literal');
var facade_converter_1 = require('./facade_converter');
exports.COMPILER_OPTIONS = {
    allowNonTsExtensions: true,
    module: 1 /* CommonJS */,
    target: 1 /* ES5 */
};
var Transpiler = (function () {
    function Transpiler(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        // Comments attach to all following AST nodes before the next 'physical' token. Track the earliest
        // offset to avoid printing comments multiple times.
        this.lastCommentIdx = -1;
        this.errors = [];
        this.fc = new facade_converter_1.FacadeConverter(this);
        this.transpilers = [
            new CallTranspiler(this, this.fc),
            new DeclarationTranspiler(this, this.fc),
            new ExpressionTranspiler(this, this.fc),
            new LiteralTranspiler(this, this.fc),
            new module_1["default"](this, this.fc, options.generateLibraryName),
            new StatementTranspiler(this),
            new TypeTranspiler(this, this.fc),
        ];
    }
    /**
     * Transpiles the given files to Dart.
     * @param fileNames The input files.
     * @param destination Location to write files to. Creates files next to their sources if absent.
     */
    Transpiler.prototype.transpile = function (fileNames, destination) {
        var _this = this;
        if (this.options.basePath) {
            this.options.basePath = this.normalizeSlashes(this.options.basePath);
        }
        fileNames = fileNames.map(function (f) { return _this.normalizeSlashes(f); });
        var host = this.createCompilerHost();
        if (this.options.basePath && destination === undefined) {
            throw new Error('Must have a destination path when a basePath is specified ' +
                this.options.basePath);
        }
        var destinationRoot = destination || this.options.basePath || '';
        var program = ts.createProgram(fileNames, this.getCompilerOptions(), host);
        if (this.options.translateBuiltins) {
            this.fc.setTypeChecker(program.getTypeChecker());
        }
        // Only write files that were explicitly passed in.
        var fileSet = {};
        fileNames.forEach(function (f) { return fileSet[f] = true; });
        this.errors = [];
        program.getSourceFiles()
            .filter(function (sourceFile) { return fileSet[sourceFile.fileName]; })
            .filter(function (sourceFile) { return !sourceFile.fileName.match(/\.d\.ts$/); })
            .forEach(function (f) {
            var dartCode = _this.translate(f);
            var outputFile = _this.getOutputPath(f.fileName, destinationRoot);
            fsx.mkdirsSync(path.dirname(outputFile));
            fs.writeFileSync(outputFile, dartCode);
        });
        this.checkForErrors(program);
    };
    Transpiler.prototype.translateProgram = function (program) {
        var _this = this;
        if (this.options.translateBuiltins) {
            this.fc.setTypeChecker(program.getTypeChecker());
        }
        var paths = {};
        this.errors = [];
        program.getSourceFiles()
            .filter(function (sourceFile) { return (!sourceFile.fileName.match(/\.d\.ts$/) &&
            !!sourceFile.fileName.match(/\.[jt]s$/)); })
            .forEach(function (f) { return paths[f.fileName] = _this.translate(f); });
        this.checkForErrors(program);
        return paths;
    };
    Transpiler.prototype.getCompilerOptions = function () {
        var opts = {};
        for (var k in exports.COMPILER_OPTIONS)
            opts[k] = exports.COMPILER_OPTIONS[k];
        opts.rootDir = this.options.basePath;
        return opts;
    };
    Transpiler.prototype.createCompilerHost = function () {
        var defaultLibFileName = ts.getDefaultLibFileName(exports.COMPILER_OPTIONS);
        defaultLibFileName = this.normalizeSlashes(defaultLibFileName);
        return {
            getSourceFile: function (sourceName, languageVersion) {
                var path = sourceName;
                if (sourceName === defaultLibFileName) {
                    path = ts.getDefaultLibFilePath(exports.COMPILER_OPTIONS);
                }
                if (!fs.existsSync(path))
                    return undefined;
                var contents = fs.readFileSync(path, 'UTF-8');
                return ts.createSourceFile(sourceName, contents, exports.COMPILER_OPTIONS.target, true);
            },
            writeFile: function (name, text, writeByteOrderMark) { fs.writeFile(name, text); },
            getDefaultLibFileName: function () { return defaultLibFileName; },
            useCaseSensitiveFileNames: function () { return true; },
            getCanonicalFileName: function (filename) { return filename; },
            getCurrentDirectory: function () { return ''; },
            getNewLine: function () { return '\n'; }
        };
    };
    // Visible for testing.
    Transpiler.prototype.getOutputPath = function (filePath, destinationRoot) {
        var relative = this.getRelativeFileName(filePath);
        var dartFile = relative.replace(/.(js|es6|ts)$/, '.dart');
        return this.normalizeSlashes(path.join(destinationRoot, dartFile));
    };
    Transpiler.prototype.translate = function (sourceFile) {
        this.currentFile = sourceFile;
        this.output =
            new Output(sourceFile, this.getRelativeFileName(), this.options.generateSourceMap);
        this.lastCommentIdx = -1;
        this.visit(sourceFile);
        return this.output.getResult();
    };
    Transpiler.prototype.checkForErrors = function (program) {
        var _this = this;
        var errors = this.errors;
        var diagnostics = program.getGlobalDiagnostics().concat(program.getSyntacticDiagnostics());
        if ((errors.length || diagnostics.length) && this.options.translateBuiltins) {
            // Only report semantic diagnostics if ts2dart failed; this code is not a generic compiler, so
            // only yields TS errors if they could be the cause of ts2dart issues.
            // This greatly speeds up tests and execution.
            diagnostics = diagnostics.concat(program.getSemanticDiagnostics());
        }
        var diagnosticErrs = diagnostics.map(function (d) {
            var msg = '';
            if (d.file) {
                var pos = d.file.getLineAndCharacterOfPosition(d.start);
                var fn = _this.getRelativeFileName(d.file.fileName);
                msg += " " + fn + ":" + (pos.line + 1) + ":" + (pos.character + 1);
            }
            msg += ': ';
            msg += ts.flattenDiagnosticMessageText(d.messageText, '\n');
            return msg;
        });
        if (diagnosticErrs.length)
            errors = errors.concat(diagnosticErrs);
        if (errors.length) {
            var e = new Error(errors.join('\n'));
            e.name = 'TS2DartError';
            throw e;
        }
    };
    /**
     * Returns `filePath`, relativized to the program's `basePath`.
     * @param filePath Optional path to relativize, defaults to the current file's path.
     */
    Transpiler.prototype.getRelativeFileName = function (filePath) {
        if (filePath === undefined)
            filePath = this.currentFile.fileName;
        // TODO(martinprobst): Use path.isAbsolute on node v0.12.
        if (this.normalizeSlashes(path.resolve('/x/', filePath)) !== filePath) {
            return filePath; // already relative.
        }
        var base = this.options.basePath || '';
        if (filePath.indexOf(base) !== 0 && !filePath.match(/\.d\.ts$/)) {
            throw new Error("Files must be located under base, got " + filePath + " vs " + base);
        }
        return this.normalizeSlashes(path.relative(base, filePath));
    };
    Transpiler.prototype.emit = function (s) { this.output.emit(s); };
    Transpiler.prototype.emitNoSpace = function (s) { this.output.emitNoSpace(s); };
    Transpiler.prototype.reportError = function (n, message) {
        var file = n.getSourceFile() || this.currentFile;
        var fileName = this.getRelativeFileName(file.fileName);
        var start = n.getStart(file);
        var pos = file.getLineAndCharacterOfPosition(start);
        // Line and character are 0-based.
        var fullMessage = fileName + ":" + (pos.line + 1) + ":" + (pos.character + 1) + ": " + message;
        if (this.options.failFast)
            throw new Error(fullMessage);
        this.errors.push(fullMessage);
    };
    Transpiler.prototype.visit = function (node) {
        var _this = this;
        this.output.addSourceMapping(node);
        var comments = ts.getLeadingCommentRanges(this.currentFile.text, node.getFullStart());
        if (comments) {
            comments.forEach(function (c) {
                if (c.pos <= _this.lastCommentIdx)
                    return;
                _this.lastCommentIdx = c.pos;
                var text = _this.currentFile.text.substring(c.pos, c.end);
                _this.emitNoSpace('\n');
                _this.emit(text);
                if (c.hasTrailingNewLine)
                    _this.emitNoSpace('\n');
            });
        }
        for (var i = 0; i < this.transpilers.length; i++) {
            if (this.transpilers[i].visitNode(node))
                return;
        }
        this.reportError(node, 'Unsupported node type ' + ts.SyntaxKind[node.kind] + ': ' +
            node.getFullText());
    };
    Transpiler.prototype.normalizeSlashes = function (path) { return path.replace(/\\/g, '/'); };
    return Transpiler;
})();
exports.Transpiler = Transpiler;
var Output = (function () {
    function Output(currentFile, relativeFileName, generateSourceMap) {
        this.currentFile = currentFile;
        this.relativeFileName = relativeFileName;
        this.result = '';
        this.column = 1;
        this.line = 1;
        if (generateSourceMap) {
            this.sourceMap = new SourceMap.SourceMapGenerator({ file: relativeFileName + '.dart' });
            this.sourceMap.setSourceContent(relativeFileName, this.currentFile.text);
        }
    }
    Output.prototype.emit = function (str) {
        this.emitNoSpace(' ');
        this.emitNoSpace(str);
    };
    Output.prototype.emitNoSpace = function (str) {
        this.result += str;
        for (var i = 0; i < str.length; i++) {
            if (str[i] === '\n') {
                this.line++;
                this.column = 0;
            }
            else {
                this.column++;
            }
        }
    };
    Output.prototype.getResult = function () { return this.result + this.generateSourceMapComment(); };
    Output.prototype.addSourceMapping = function (n) {
        if (!this.sourceMap)
            return; // source maps disabled.
        var file = n.getSourceFile() || this.currentFile;
        var start = n.getStart(file);
        var pos = file.getLineAndCharacterOfPosition(start);
        var mapping = {
            original: { line: pos.line + 1, column: pos.character },
            generated: { line: this.line, column: this.column },
            source: this.relativeFileName
        };
        this.sourceMap.addMapping(mapping);
    };
    Output.prototype.generateSourceMapComment = function () {
        if (!this.sourceMap)
            return '';
        var base64map = new Buffer(JSON.stringify(this.sourceMap)).toString('base64');
        return '\n\n//# sourceMappingURL=data:application/json;base64,' + base64map;
    };
    return Output;
})();
// CLI entry point
if (require.main === module) {
    var args = require('minimist')(process.argv.slice(2), { base: 'string' });
    try {
        var transpiler = new Transpiler(args);
        console.log('Transpiling', args._, 'to', args.destination);
        transpiler.transpile(args._, args.destination);
    }
    catch (e) {
        if (e.name !== 'TS2DartError')
            throw e;
        console.log(e.message);
        process.exit(1);
    }
}

//# sourceMappingURL=main.js.map