var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var DeclarationTranspiler = (function (_super) {
    __extends(DeclarationTranspiler, _super);
    function DeclarationTranspiler(tr, fc) {
        _super.call(this, tr);
        this.fc = fc;
    }
    DeclarationTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 200 /* VariableDeclarationList */:
                // Note: VariableDeclarationList can only occur as part of a for loop.
                var varDeclList = node;
                this.visitList(varDeclList.declarations);
                break;
            case 199 /* VariableDeclaration */:
                var varDecl = node;
                this.visitVariableDeclarationType(varDecl);
                this.visit(varDecl.name);
                if (varDecl.initializer) {
                    this.emit('=');
                    this.visit(varDecl.initializer);
                }
                break;
            case 202 /* ClassDeclaration */:
                var classDecl = node;
                this.visitClassLike('class', classDecl);
                break;
            case 203 /* InterfaceDeclaration */:
                var ifDecl = node;
                // Function type interface in an interface with a single declaration
                // of a call signature (http://goo.gl/ROC5jN).
                if (ifDecl.members.length === 1 && ifDecl.members[0].kind === 139 /* CallSignature */) {
                    this.visitFunctionTypedefInterface(ifDecl.name.text, ifDecl.members[0], ifDecl.typeParameters);
                }
                else {
                    this.visitClassLike('abstract class', ifDecl);
                }
                break;
            case 223 /* HeritageClause */:
                var heritageClause = node;
                if (heritageClause.token === 79 /* ExtendsKeyword */) {
                    this.emit('extends');
                }
                else {
                    this.emit('implements');
                }
                // Can only have one member for extends clauses.
                this.visitList(heritageClause.types);
                break;
            case 177 /* ExpressionWithTypeArguments */:
                var exprWithTypeArgs = node;
                this.visit(exprWithTypeArgs.expression);
                this.maybeVisitTypeArguments(exprWithTypeArgs);
                break;
            case 205 /* EnumDeclaration */:
                var decl = node;
                // The only legal modifier for an enum decl is const.
                var isConst = decl.modifiers && (decl.modifiers.flags & 8192 /* Const */);
                if (isConst) {
                    this.reportError(node, 'const enums are not supported');
                }
                this.emit('enum');
                this.fc.visitTypeName(decl.name);
                this.emit('{');
                // Enums can be empty in TS ...
                if (decl.members.length === 0) {
                    // ... but not in Dart.
                    this.reportError(node, 'empty enums are not supported');
                }
                this.visitList(decl.members);
                this.emit('}');
                break;
            case 227 /* EnumMember */:
                var member = node;
                this.visit(member.name);
                if (member.initializer) {
                    this.reportError(node, 'enum initializers are not supported');
                }
                break;
            case 136 /* Constructor */:
                var ctorDecl = node;
                // Find containing class name.
                var className;
                for (var parent = ctorDecl.parent; parent; parent = parent.parent) {
                    if (parent.kind == 202 /* ClassDeclaration */) {
                        className = parent.name;
                        break;
                    }
                }
                if (!className)
                    this.reportError(ctorDecl, 'cannot find outer class node');
                this.visitDeclarationMetadata(ctorDecl);
                if (this.isConst(ctorDecl.parent)) {
                    this.emit('const');
                }
                this.visit(className);
                this.visitParameters(ctorDecl.parameters);
                this.visit(ctorDecl.body);
                break;
            case 133 /* PropertyDeclaration */:
                this.visitProperty(node);
                break;
            case 179 /* SemicolonClassElement */:
                // No-op, don't emit useless declarations.
                break;
            case 135 /* MethodDeclaration */:
                this.visitDeclarationMetadata(node);
                this.visitFunctionLike(node);
                break;
            case 137 /* GetAccessor */:
                this.visitDeclarationMetadata(node);
                this.visitFunctionLike(node, 'get');
                break;
            case 138 /* SetAccessor */:
                this.visitDeclarationMetadata(node);
                this.visitFunctionLike(node, 'set');
                break;
            case 201 /* FunctionDeclaration */:
                var funcDecl = node;
                this.visitDecorators(funcDecl.decorators);
                if (funcDecl.typeParameters)
                    this.reportError(node, 'generic functions are unsupported');
                this.visitFunctionLike(funcDecl);
                break;
            case 164 /* ArrowFunction */:
                var arrowFunc = node;
                // Dart only allows expressions following the fat arrow operator.
                // If the body is a block, we have to drop the fat arrow and emit an
                // anonymous function instead.
                if (arrowFunc.body.kind == 180 /* Block */) {
                    this.visitFunctionLike(arrowFunc);
                }
                else {
                    this.visitParameters(arrowFunc.parameters);
                    this.emit('=>');
                    this.visit(arrowFunc.body);
                }
                break;
            case 163 /* FunctionExpression */:
                var funcExpr = node;
                this.visitFunctionLike(funcExpr);
                break;
            case 132 /* PropertySignature */:
                var propSig = node;
                this.visitProperty(propSig);
                break;
            case 134 /* MethodSignature */:
                var methodSignatureDecl = node;
                this.visitEachIfPresent(methodSignatureDecl.modifiers);
                this.visitFunctionLike(methodSignatureDecl);
                break;
            case 130 /* Parameter */:
                var paramDecl = node;
                // Property parameters will have an explicit property declaration, so we just
                // need the dart assignment shorthand to reference the property.
                if (this.hasFlag(paramDecl.modifiers, 16 /* Public */) ||
                    this.hasFlag(paramDecl.modifiers, 32 /* Private */) ||
                    this.hasFlag(paramDecl.modifiers, 64 /* Protected */)) {
                    this.emit('this .');
                    this.visit(paramDecl.name);
                    if (paramDecl.initializer) {
                        this.emit('=');
                        this.visit(paramDecl.initializer);
                    }
                    break;
                }
                if (paramDecl.dotDotDotToken)
                    this.reportError(node, 'rest parameters are unsupported');
                if (paramDecl.name.kind === 151 /* ObjectBindingPattern */) {
                    this.visitNamedParameter(paramDecl);
                    break;
                }
                this.visitDecorators(paramDecl.decorators);
                if (paramDecl.type)
                    this.visit(paramDecl.type);
                this.visit(paramDecl.name);
                if (paramDecl.initializer) {
                    this.emit('=');
                    this.visit(paramDecl.initializer);
                }
                break;
            case 151 /* ObjectBindingPattern */:
                var bindingPattern = node;
                this.emit('{');
                this.visitList(bindingPattern.elements);
                this.emit('}');
                break;
            case 153 /* BindingElement */:
                var bindingElement = node;
                this.visit(bindingElement.name);
                if (bindingElement.initializer) {
                    this.emit(':');
                    this.visit(bindingElement.initializer);
                }
                break;
            case 109 /* StaticKeyword */:
                this.emit('static');
                break;
            case 106 /* PrivateKeyword */:
                // no-op, handled through '_' naming convention in Dart.
                break;
            case 107 /* ProtectedKeyword */:
                // Handled in `visitDeclarationMetadata` below.
                break;
            default:
                return false;
        }
        return true;
    };
    DeclarationTranspiler.prototype.visitVariableDeclarationType = function (varDecl) {
        /* Note: VariableDeclarationList can only occur as part of a for loop. This helper method
         * is meant for processing for-loop variable declaration types only.
         *
         * In Dart, all variables in a variable declaration list must have the same type. Since
         * we are doing syntax directed translation, we cannot reliably determine if distinct
         * variables are declared with the same type or not. Hence we support the following cases:
         *
         * - A variable declaration list with a single variable can be explicitly typed.
         * - When more than one variable is in the list, all must be implicitly typed.
         */
        var firstDecl = varDecl.parent.declarations[0];
        var msg = 'Variables in a declaration list of more than one variable cannot by typed';
        var isConst = this.hasFlag(varDecl.parent, 8192 /* Const */);
        if (firstDecl === varDecl) {
            if (isConst)
                this.emit('const');
            if (!varDecl.type) {
                if (!isConst)
                    this.emit('var');
            }
            else if (varDecl.parent.declarations.length > 1) {
                this.reportError(varDecl, msg);
            }
            else {
                this.visit(varDecl.type);
            }
        }
        else if (varDecl.type) {
            this.reportError(varDecl, msg);
        }
    };
    DeclarationTranspiler.prototype.visitFunctionLike = function (fn, accessor) {
        if (fn.type) {
            if (fn.kind === 164 /* ArrowFunction */) {
                // Type is silently dropped for arrow functions, not supported in Dart.
                this.emit('/*');
                this.visit(fn.type);
                this.emit('*/');
            }
            else {
                this.visit(fn.type);
            }
        }
        if (accessor)
            this.emit(accessor);
        if (fn.name)
            this.visit(fn.name);
        // Dart does not even allow the parens of an empty param list on getter
        if (accessor !== 'get') {
            this.visitParameters(fn.parameters);
        }
        else {
            if (fn.parameters && fn.parameters.length > 0) {
                this.reportError(fn, 'getter should not accept parameters');
            }
        }
        if (fn.body) {
            this.visit(fn.body);
        }
        else {
            this.emit(';');
        }
    };
    DeclarationTranspiler.prototype.visitParameters = function (parameters) {
        this.emit('(');
        var firstInitParamIdx = 0;
        for (; firstInitParamIdx < parameters.length; firstInitParamIdx++) {
            // ObjectBindingPatterns are handled within the parameter visit.
            var isOpt = parameters[firstInitParamIdx].initializer || parameters[firstInitParamIdx].questionToken;
            if (isOpt && parameters[firstInitParamIdx].name.kind !== 151 /* ObjectBindingPattern */) {
                break;
            }
        }
        if (firstInitParamIdx !== 0) {
            var requiredParams = parameters.slice(0, firstInitParamIdx);
            this.visitList(requiredParams);
        }
        if (firstInitParamIdx !== parameters.length) {
            if (firstInitParamIdx !== 0)
                this.emit(',');
            var positionalOptional = parameters.slice(firstInitParamIdx, parameters.length);
            this.emit('[');
            this.visitList(positionalOptional);
            this.emit(']');
        }
        this.emit(')');
    };
    /**
     * Visit a property declaration.
     * In the special case of property parameters in a constructor, we also allow a parameter to be
     * emitted as a property.
     */
    DeclarationTranspiler.prototype.visitProperty = function (decl, isParameter) {
        if (isParameter === void 0) { isParameter = false; }
        if (!isParameter)
            this.visitDeclarationMetadata(decl);
        var containingClass = (isParameter ? decl.parent.parent : decl.parent);
        var isConstField = this.hasAnnotation(decl.decorators, 'CONST');
        if (isConstField) {
            // const implies final
            this.emit('const');
        }
        else {
            var hasConstCtor = this.isConst(containingClass);
            if (hasConstCtor) {
                this.emit('final');
            }
        }
        if (decl.type) {
            this.visit(decl.type);
        }
        else if (!isConstField && !hasConstCtor) {
            this.emit('var');
        }
        this.visit(decl.name);
        if (decl.initializer && !isParameter) {
            this.emit('=');
            this.visit(decl.initializer);
        }
        this.emit(';');
    };
    DeclarationTranspiler.prototype.visitClassLike = function (keyword, decl) {
        var _this = this;
        this.visitDecorators(decl.decorators);
        this.emit(keyword);
        this.fc.visitTypeName(decl.name);
        if (decl.typeParameters) {
            this.emit('<');
            this.visitList(decl.typeParameters);
            this.emit('>');
        }
        this.visitEachIfPresent(decl.heritageClauses);
        // Check for @IMPLEMENTS interfaces to add.
        // TODO(martinprobst): Drop all special cases for @SOMETHING after migration to TypeScript.
        var implIfs = this.getImplementsDecorators(decl.decorators);
        if (implIfs.length > 0) {
            // Check if we have to emit an 'implements ' or a ', '
            if (decl.heritageClauses && decl.heritageClauses.length > 0 &&
                decl.heritageClauses.some(function (hc) { return hc.token === 102 /* ImplementsKeyword */; })) {
                // There was some implements clause.
                this.emit(',');
            }
            else {
                this.emit('implements');
            }
            this.emit(implIfs.join(' , '));
        }
        this.emit('{');
        // Synthesize explicit properties for ctor with 'property parameters'
        var synthesizePropertyParam = function (param) {
            if (_this.hasFlag(param.modifiers, 16 /* Public */) ||
                _this.hasFlag(param.modifiers, 32 /* Private */) ||
                _this.hasFlag(param.modifiers, 64 /* Protected */)) {
                // TODO: we should enforce the underscore prefix on privates
                _this.visitProperty(param, true);
            }
        };
        decl.members.filter(function (m) { return m.kind == 136 /* Constructor */; })
            .forEach(function (ctor) {
            return ctor.parameters.forEach(synthesizePropertyParam);
        });
        this.visitEachIfPresent(decl.members);
        // Generate a constructor to host the const modifier, if needed
        if (this.isConst(decl) && !decl.members.some(function (m) { return m.kind == 136 /* Constructor */; })) {
            this.emit("const");
            this.fc.visitTypeName(decl.name);
            this.emit("();");
        }
        this.emit('}');
    };
    /** Returns the parameters passed to @IMPLEMENTS as the identifier's string values. */
    DeclarationTranspiler.prototype.getImplementsDecorators = function (decorators) {
        var _this = this;
        var interfaces = [];
        if (!decorators)
            return interfaces;
        decorators.forEach(function (d) {
            if (d.expression.kind !== 158 /* CallExpression */)
                return;
            var funcExpr = d.expression;
            if (base.ident(funcExpr.expression) !== 'IMPLEMENTS')
                return;
            funcExpr.arguments.forEach(function (a) {
                var interf = base.ident(a);
                if (!interf)
                    _this.reportError(a, '@IMPLEMENTS only supports literal identifiers');
                interfaces.push(interf);
            });
        });
        return interfaces;
    };
    DeclarationTranspiler.prototype.visitDecorators = function (decorators) {
        var _this = this;
        if (!decorators)
            return;
        var isAbstract = false;
        decorators.forEach(function (d) {
            // Special case @CONST, @IMPLEMENTS, & @ABSTRACT
            var name = base.ident(d.expression);
            if (!name && d.expression.kind === 158 /* CallExpression */) {
                // Unwrap @CONST()
                var callExpr = d.expression;
                name = base.ident(callExpr.expression);
            }
            // Make sure these match IGNORED_ANNOTATIONS below.
            if (name === 'ABSTRACT') {
                isAbstract = true;
                return;
            }
            if (name === 'CONST' || name === 'IMPLEMENTS') {
                // Ignore @IMPLEMENTS and @CONST - they are handled above in visitClassLike.
                // TODO(martinprobst): @IMPLEMENTS should be removed as TS supports it natively.
                return;
            }
            _this.emit('@');
            _this.visit(d.expression);
        });
        if (isAbstract)
            this.emit('abstract');
    };
    DeclarationTranspiler.prototype.visitDeclarationMetadata = function (decl) {
        this.visitDecorators(decl.decorators);
        this.visitEachIfPresent(decl.modifiers);
        // Temporarily deactivated to make migration of Angular code base easier.
        return;
        if (this.hasFlag(decl.modifiers, 64 /* Protected */)) {
            this.reportError(decl, 'protected declarations are unsupported');
            return;
        }
        var name = base.ident(decl.name);
        if (!name)
            return;
        var isPrivate = this.hasFlag(decl.modifiers, 32 /* Private */);
        var matchesPrivate = !!name.match(/^_/);
        if (isPrivate && !matchesPrivate) {
            this.reportError(decl, 'private members must be prefixed with "_"');
        }
        if (!isPrivate && matchesPrivate) {
            this.reportError(decl, 'public members must not be prefixed with "_"');
        }
    };
    DeclarationTranspiler.prototype.visitNamedParameter = function (paramDecl) {
        this.visitDecorators(paramDecl.decorators);
        if (paramDecl.type) {
        }
        this.visit(paramDecl.name);
        if (paramDecl.initializer) {
            if (paramDecl.initializer.kind !== 155 /* ObjectLiteralExpression */ ||
                paramDecl.initializer.properties.length > 0) {
                this.reportError(paramDecl, 'initializers for named parameters must be empty object literals');
            }
        }
    };
    /**
     * Handles a function typedef-like interface, i.e. an interface that only declares a single
     * call signature, by translating to a Dart `typedef`.
     */
    DeclarationTranspiler.prototype.visitFunctionTypedefInterface = function (name, signature, typeParameters) {
        this.emit('typedef');
        if (signature.type) {
            this.visit(signature.type);
        }
        this.emit(name);
        if (typeParameters) {
            this.emit('<');
            this.visitList(typeParameters);
            this.emit('>');
        }
        this.visitParameters(signature.parameters);
        this.emit(';');
    };
    return DeclarationTranspiler;
})(base.TranspilerBase);
module.exports = DeclarationTranspiler;

//# sourceMappingURL=declaration.js.map