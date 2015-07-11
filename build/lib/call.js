var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var CallTranspiler = (function (_super) {
    __extends(CallTranspiler, _super);
    function CallTranspiler(tr, fc) {
        _super.call(this, tr);
        this.fc = fc;
    }
    CallTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 180 /* Block */:
                // This is a bit ugly: to separate Declarations from Calls, this code has to special case
                // blocks that are actually constructor bodies.
                if (node.parent && node.parent.kind === 136 /* Constructor */) {
                    return this.visitConstructorBody(node.parent);
                }
                return false;
            case 159 /* NewExpression */:
                if (this.hasAncestor(node, 131 /* Decorator */)) {
                    // Constructor calls in annotations must be const constructor calls.
                    this.emit('const');
                }
                else if (this.isInsideConstExpr(node)) {
                    this.emit('const');
                }
                else {
                    this.emit('new');
                }
                var newExpr = node;
                if (this.fc.maybeHandleCall(newExpr))
                    break;
                this.visitCall(newExpr);
                break;
            case 158 /* CallExpression */:
                var callExpr = node;
                if (this.fc.maybeHandleCall(callExpr))
                    break;
                if (this.maybeHandleSuperCall(callExpr))
                    break;
                this.visitCall(callExpr);
                break;
            case 91 /* SuperKeyword */:
                this.emit('super');
                break;
            default:
                return false;
        }
        return true;
    };
    CallTranspiler.prototype.visitCall = function (c) {
        this.visit(c.expression);
        if (c.typeArguments && c.kind !== 159 /* NewExpression */) {
            this.reportError(c, 'Type arguments are only supported on new calls.');
        }
        this.maybeVisitTypeArguments(c);
        this.emit('(');
        if (!this.handleNamedParamsCall(c)) {
            this.visitList(c.arguments);
        }
        this.emit(')');
    };
    CallTranspiler.prototype.isInsideConstExpr = function (node) {
        return this.isConstCall(this.getAncestor(node, 158 /* CallExpression */));
    };
    CallTranspiler.prototype.isConstCall = function (node) {
        // TODO: Align with facade_converter.ts
        return node && base.ident(node.expression) === 'CONST_EXPR';
    };
    CallTranspiler.prototype.handleNamedParamsCall = function (c) {
        // Preamble: This is all committed in the name of backwards compat with the traceur transpiler.
        // Terrible hack: transform foo(a, b, {c: d}) into foo(a, b, c: d), which is Dart's calling
        // syntax for named/optional parameters. An alternative would be to transform the method
        // declaration to take a plain object literal and destructure in the method, but then client
        // code written against Dart wouldn't get nice named parameters.
        if (c.arguments.length === 0)
            return false;
        var last = c.arguments[c.arguments.length - 1];
        if (last.kind !== 155 /* ObjectLiteralExpression */)
            return false;
        var objLit = last;
        if (objLit.properties.length === 0)
            return false;
        // Even worse: foo(a, b, {'c': d}) is considered to *not* be a named parameters call.
        var hasNonPropAssignments = objLit.properties.some(function (p) { return (p.kind != 225 /* PropertyAssignment */ ||
            p.name.kind !== 65 /* Identifier */); });
        if (hasNonPropAssignments)
            return false;
        var len = c.arguments.length - 1;
        this.visitList(c.arguments.slice(0, len));
        if (len)
            this.emit(',');
        var props = objLit.properties;
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            this.emit(base.ident(prop.name));
            this.emit(':');
            this.visit(prop.initializer);
            if (i < objLit.properties.length - 1)
                this.emit(',');
        }
        return true;
    };
    /**
     * Handles constructor initializer lists and bodies.
     *
     * <p>Dart's super() ctor calls have to be moved to the constructors initializer list, and `const`
     * constructors must be completely empty, only assigning into fields through the initializer list.
     * The code below finds super() calls and handles const constructors, marked with the special
     * `@CONST` annotation on the class.
     *
     * <p>Not emitting super() calls when traversing the ctor body is handled by maybeHandleSuperCall
     * below.
     */
    CallTranspiler.prototype.visitConstructorBody = function (ctor) {
        var _this = this;
        var body = ctor.body;
        if (!body)
            return false;
        var errorAssignmentsSuper = 'const constructors can only contain assignments and super calls';
        var errorThisAssignment = 'assignments in const constructors must assign into this.';
        var parent = ctor.parent;
        var parentIsConst = this.isConst(parent);
        var superCall;
        var expressions = [];
        // Find super() calls and (if in a const ctor) collect assignment expressions (not statements!)
        body.statements.forEach(function (stmt) {
            if (stmt.kind !== 183 /* ExpressionStatement */) {
                if (parentIsConst)
                    _this.reportError(stmt, errorAssignmentsSuper);
                return;
            }
            var nestedExpr = stmt.expression;
            // super() call?
            if (nestedExpr.kind === 158 /* CallExpression */) {
                var callExpr = nestedExpr;
                if (callExpr.expression.kind !== 91 /* SuperKeyword */) {
                    if (parentIsConst)
                        _this.reportError(stmt, errorAssignmentsSuper);
                    return;
                }
                superCall = callExpr;
                return;
            }
            // this.x assignment?
            if (parentIsConst) {
                // Check for assignment.
                if (nestedExpr.kind !== 170 /* BinaryExpression */) {
                    _this.reportError(nestedExpr, errorAssignmentsSuper);
                    return;
                }
                var binExpr = nestedExpr;
                if (binExpr.operatorToken.kind !== 53 /* EqualsToken */) {
                    _this.reportError(binExpr, errorAssignmentsSuper);
                    return;
                }
                // Check for 'this.'
                if (binExpr.left.kind !== 156 /* PropertyAccessExpression */) {
                    _this.reportError(binExpr, errorThisAssignment);
                    return;
                }
                var lhs = binExpr.left;
                if (lhs.expression.kind !== 93 /* ThisKeyword */) {
                    _this.reportError(binExpr, errorThisAssignment);
                    return;
                }
                var ident = lhs.name;
                binExpr.left = ident;
                expressions.push(nestedExpr);
            }
        });
        var hasInitializerExpr = expressions.length > 0;
        if (hasInitializerExpr) {
            // Write out the assignments.
            this.emit(':');
            this.visitList(expressions);
        }
        if (superCall) {
            this.emit(hasInitializerExpr ? ',' : ':');
            this.emit('super (');
            if (!this.handleNamedParamsCall(superCall)) {
                this.visitList(superCall.arguments);
            }
            this.emit(')');
        }
        if (parentIsConst) {
            // Const ctors don't have bodies.
            this.emit(';');
            return true; // completely handled.
        }
        else {
            return false;
        }
    };
    /**
     * Checks whether `callExpr` is a super() call that should be ignored because it was already
     * handled by `maybeEmitSuperInitializer` above.
     */
    CallTranspiler.prototype.maybeHandleSuperCall = function (callExpr) {
        if (callExpr.expression.kind !== 91 /* SuperKeyword */)
            return false;
        // Sanity check that there was indeed a ctor directly above this call.
        var exprStmt = callExpr.parent;
        var ctorBody = exprStmt.parent;
        var ctor = ctorBody.parent;
        if (ctor.kind !== 136 /* Constructor */) {
            this.reportError(callExpr, 'super calls must be immediate children of their constructors');
            return false;
        }
        this.emit('/* super call moved to initializer */');
        return true;
    };
    return CallTranspiler;
})(base.TranspilerBase);
module.exports = CallTranspiler;

//# sourceMappingURL=call.js.map