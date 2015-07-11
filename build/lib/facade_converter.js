var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var base = require('./base');
var ts = require('typescript');
var FACADE_DEBUG = false;
var FacadeConverter = (function (_super) {
    __extends(FacadeConverter, _super);
    function FacadeConverter(transpiler) {
        var _this = this;
        _super.call(this, transpiler);
        this.candidateProperties = {};
        this.candidateTypes = {};
        this.stdlibTypeReplacements = {
            'Date': 'DateTime',
            'Array': 'List',
            'XMLHttpRequest': 'HttpRequest',
            // Dart has two different incompatible DOM APIs
            // https://github.com/angular/angular/issues/2770
            'Node': 'dynamic',
            'Text': 'dynamic',
            'Element': 'dynamic',
            'HTMLElement': 'dynamic',
            'HTMLStyleElement': 'dynamic',
            'HTMLInputElement': 'dynamic',
            'HTMLDocument': 'dynamic',
            'History': 'dynamic',
            'Location': 'dynamic'
        };
        this.TS_TO_DART_TYPENAMES = {
            'lib': this.stdlibTypeReplacements,
            'lib.es6': this.stdlibTypeReplacements,
            'angular2/src/facade/async': { 'Promise': 'Future', 'Observable': 'Stream', 'ObservableController': 'StreamController' },
            'angular2/src/facade/collection': { 'StringMap': 'Map' },
            'angular2/src/facade/lang': { 'Date': 'DateTime' },
            'angular2/globals': { 'StringMap': 'Map' }
        };
        this.stdlibHandlers = {
            'Array.push': function (c, context) {
                _this.visit(context);
                _this.emitCall('add', c.arguments);
            },
            'Array.pop': function (c, context) {
                _this.visit(context);
                _this.emitCall('removeLast');
            },
            'Array.shift': function (c, context) {
                _this.visit(context);
                _this.emit('. removeAt ( 0 )');
            },
            'Array.unshift': function (c, context) {
                _this.emit('(');
                _this.visit(context);
                if (c.arguments.length == 1) {
                    _this.emit('.. insert ( 0,');
                    _this.visit(c.arguments[0]);
                    _this.emit(') ) . length');
                }
                else {
                    _this.emit('.. insertAll ( 0, [');
                    _this.visitList(c.arguments);
                    _this.emit(']) ) . length');
                }
            },
            'Array.map': function (c, context) {
                _this.visit(context);
                _this.emitCall('map', c.arguments);
                _this.emitCall('toList');
            },
            'Array.slice': function (c, context) {
                _this.emitCall('ListWrapper.slice', [context].concat(c.arguments));
            },
            'Array.splice': function (c, context) {
                _this.emitCall('ListWrapper.splice', [context].concat(c.arguments));
            },
            'Array.concat': function (c, context) {
                _this.emit('new List . from (');
                _this.visit(context);
                _this.emit(')');
                c.arguments.forEach(function (arg) {
                    if (!_this.isNamedType(arg, 'lib', 'Array')) {
                        _this.reportError(arg, 'Array.concat only takes Array arguments');
                    }
                    _this.emit('.. addAll (');
                    _this.visit(arg);
                    _this.emit(')');
                });
            },
            'ArrayConstructor.isArray': function (c, context) {
                _this.emit('( (');
                _this.visitList(c.arguments); // Should only be 1.
                _this.emit(')');
                _this.emit('is List');
                _this.emit(')');
            },
            'RegExp.test': function (c, context) {
                _this.visit(context);
                _this.emitCall('hasMatch', c.arguments);
            },
            'RegExp.exec': function (c, context) {
                _this.visit(context);
                _this.emitCall('allMatches', c.arguments);
                _this.emitCall('toList');
            }
        };
        this.callHandlers = {
            'lib': this.stdlibHandlers,
            'lib.es6': this.stdlibHandlers,
            'angular2/src/facade/collection': {
                'Map': function (c, context) {
                    // The actual Map constructor is special cased for const calls.
                    if (!_this.isInsideConstExpr(c))
                        return true;
                    if (c.arguments.length) {
                        _this.reportError(c, 'Arguments on a Map constructor in a const are unsupported');
                    }
                    if (c.typeArguments) {
                        _this.emit('<');
                        _this.visitList(c.typeArguments);
                        _this.emit('>');
                    }
                    _this.emit('{ }');
                    return false;
                }
            },
            'angular2/traceur-runtime': {
                'Map.set': function (c, context) {
                    _this.visit(context);
                    _this.emit('[');
                    _this.visit(c.arguments[0]);
                    _this.emit(']');
                    _this.emit('=');
                    _this.visit(c.arguments[1]);
                },
                'Map.get': function (c, context) {
                    _this.visit(context);
                    _this.emit('[');
                    _this.visit(c.arguments[0]);
                    _this.emit(']');
                },
                'Map.has': function (c, context) {
                    _this.visit(context);
                    _this.emitCall('containsKey', c.arguments);
                },
                'Map.delete': function (c, context) {
                    // JS Map.delete(k) returns whether k was present in the map,
                    // convert to:
                    // (Map.containsKey(k) && (Map.remove(k) != null || true))
                    // (Map.remove(k) != null || true) is required to always returns true
                    // when Map.containsKey(k)
                    _this.emit('(');
                    _this.visit(context);
                    _this.emitCall('containsKey', c.arguments);
                    _this.emit('&& (');
                    _this.visit(context);
                    _this.emitCall('remove', c.arguments);
                    _this.emit('!= null || true ) )');
                }
            },
            'angular2/src/di/forward_ref': {
                'forwardRef': function (c, context) {
                    // The special function forwardRef translates to an unwrapped value in Dart.
                    var callback = c.arguments[0];
                    if (callback.kind !== 164 /* ArrowFunction */) {
                        _this.reportError(c, 'forwardRef takes only arrow functions');
                        return;
                    }
                    _this.visit(callback.body);
                }
            },
            'angular2/src/facade/lang': {
                'CONST_EXPR': function (c, context) {
                    // `const` keyword is emitted in the array literal handling, as it needs to be transitive.
                    _this.visitList(c.arguments);
                }
            }
        };
        this.propertyHandlers = {
            'angular2/traceur-runtime': {
                'Map.size': function (p) {
                    _this.visit(p.expression);
                    _this.emit('.');
                    _this.emit('length');
                }
            }
        };
        this.extractPropertyNames(this.callHandlers);
        this.extractPropertyNames(this.propertyHandlers);
        this.extractPropertyNames(this.TS_TO_DART_TYPENAMES, this.candidateTypes);
    }
    FacadeConverter.prototype.extractPropertyNames = function (m, candidates) {
        if (candidates === void 0) { candidates = this.candidateProperties; }
        for (var fileName in m) {
            Object.keys(m[fileName])
                .filter(function (k) { return m[fileName].hasOwnProperty(k); })
                .map(function (propName) { return propName.substring(propName.lastIndexOf('.') + 1); })
                .forEach(function (propName) { return candidates[propName] = true; });
        }
    };
    FacadeConverter.prototype.setTypeChecker = function (tc) { this.tc = tc; };
    FacadeConverter.prototype.maybeHandleCall = function (c) {
        if (!this.tc)
            return false;
        var symbol;
        var context;
        var ident;
        if (c.expression.kind === 65 /* Identifier */) {
            // Function call.
            ident = base.ident(c.expression);
            if (!this.candidateProperties.hasOwnProperty(ident))
                return false;
            symbol = this.tc.getSymbolAtLocation(c.expression);
            if (FACADE_DEBUG)
                console.log('s:', symbol);
            if (!symbol) {
                this.reportMissingType(c, ident);
                return false;
            }
            context = null;
        }
        else if (c.expression.kind === 156 /* PropertyAccessExpression */) {
            // Method call.
            var pa = c.expression;
            ident = base.ident(pa.name);
            if (!this.candidateProperties.hasOwnProperty(ident))
                return false;
            symbol = this.tc.getSymbolAtLocation(pa);
            if (FACADE_DEBUG)
                console.log('s:', symbol);
            // Error will be reported by PropertyAccess handling below.
            if (!symbol)
                return false;
            context = pa.expression;
        }
        else {
            // Not a call we recognize.
            return false;
        }
        var handler = this.getHandler(symbol, this.callHandlers);
        return handler && !handler(c, context);
    };
    FacadeConverter.prototype.handlePropertyAccess = function (pa) {
        if (!this.tc)
            return;
        var ident = pa.name.text;
        if (!this.candidateProperties.hasOwnProperty(ident))
            return false;
        var symbol = this.tc.getSymbolAtLocation(pa.name);
        if (!symbol) {
            this.reportMissingType(pa, ident);
            return false;
        }
        var handler = this.getHandler(symbol, this.propertyHandlers);
        return handler && !handler(pa);
    };
    FacadeConverter.prototype.visitTypeName = function (typeName) {
        if (typeName.kind !== 65 /* Identifier */) {
            this.visit(typeName);
            return;
        }
        var ident = base.ident(typeName);
        if (this.candidateTypes.hasOwnProperty(ident) && this.tc) {
            var symbol = this.tc.getSymbolAtLocation(typeName);
            if (!symbol) {
                this.reportMissingType(typeName, ident);
                return;
            }
            var fileAndName = this.getFileAndName(symbol);
            if (fileAndName) {
                var fileSubs = this.TS_TO_DART_TYPENAMES[fileAndName.fileName];
                if (fileSubs && fileSubs.hasOwnProperty(fileAndName.qname)) {
                    this.emit(fileSubs[fileAndName.qname]);
                    return;
                }
            }
        }
        this.emit(ident);
    };
    FacadeConverter.prototype.getHandler = function (symbol, m) {
        var _a = this.getFileAndName(symbol), fileName = _a.fileName, qname = _a.qname;
        var fileSubs = m[fileName];
        if (!fileSubs)
            return null;
        return fileSubs[qname];
    };
    FacadeConverter.prototype.getFileAndName = function (symbol) {
        while (symbol.flags & 8388608 /* Alias */)
            symbol = this.tc.getAliasedSymbol(symbol);
        var decl = symbol.valueDeclaration;
        if (!decl) {
            // In the case of a pure declaration with no assignment, there is no value declared.
            // Just grab the first declaration, hoping it is declared once.
            decl = symbol.declarations[0];
        }
        var fileName = decl.getSourceFile().fileName;
        fileName = this.getRelativeFileName(fileName);
        fileName = fileName.replace(/(\.d)?\.ts$/, '');
        if (FACADE_DEBUG)
            console.log('fn:', fileName);
        var qname = this.tc.getFullyQualifiedName(symbol);
        // Some Qualified Names include their file name. Might be a bug in TypeScript,
        // for the time being just special case.
        if (symbol.flags & 16 /* Function */ || symbol.flags & 3 /* Variable */ ||
            symbol.flags & 32 /* Class */) {
            qname = symbol.getName();
        }
        if (FACADE_DEBUG)
            console.log('qn:', qname);
        return { fileName: fileName, qname: qname };
    };
    FacadeConverter.prototype.isNamedType = function (node, fileName, qname) {
        var symbol = this.tc.getTypeAtLocation(node).getSymbol();
        if (!symbol)
            return false;
        var actual = this.getFileAndName(symbol);
        if (fileName === 'lib' && !(actual.fileName === 'lib' || actual.fileName === 'lib.es6')) {
            return false;
        }
        else {
            if (fileName !== actual.fileName)
                return false;
        }
        return qname === actual.qname;
    };
    FacadeConverter.prototype.reportMissingType = function (n, ident) {
        this.reportError(n, ("Untyped property access to \"" + ident + "\" which could be ") +
            "a special ts2dart builtin. " +
            "Please add type declarations to disambiguate.");
    };
    FacadeConverter.prototype.isInsideConstExpr = function (node) {
        return this.isConstCall(this.getAncestor(node, 158 /* CallExpression */));
    };
    FacadeConverter.prototype.isConstCall = function (node) {
        return node && base.ident(node.expression) === 'CONST_EXPR';
    };
    FacadeConverter.prototype.emitCall = function (name, args) {
        this.emit('.');
        this.emit(name);
        this.emit('(');
        if (args)
            this.visitList(args);
        this.emit(')');
    };
    return FacadeConverter;
})(base.TranspilerBase);
exports.FacadeConverter = FacadeConverter;

//# sourceMappingURL=facade_converter.js.map