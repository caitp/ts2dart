var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var ExpressionTranspiler = (function (_super) {
    __extends(ExpressionTranspiler, _super);
    function ExpressionTranspiler(tr, fc) {
        _super.call(this, tr);
        this.fc = fc;
    }
    ExpressionTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 170 /* BinaryExpression */:
                var binExpr = node;
                var operatorKind = binExpr.operatorToken.kind;
                if (operatorKind === 30 /* EqualsEqualsEqualsToken */ ||
                    operatorKind === 31 /* ExclamationEqualsEqualsToken */) {
                    if (operatorKind === 31 /* ExclamationEqualsEqualsToken */)
                        this.emit('!');
                    this.emit('identical (');
                    this.visit(binExpr.left);
                    this.emit(',');
                    this.visit(binExpr.right);
                    this.emit(')');
                }
                else {
                    this.visit(binExpr.left);
                    if (operatorKind === 87 /* InstanceOfKeyword */) {
                        this.emit('is');
                        this.fc.visitTypeName(binExpr.right);
                    }
                    else {
                        this.emit(ts.tokenToString(binExpr.operatorToken.kind));
                        this.visit(binExpr.right);
                    }
                }
                break;
            case 168 /* PrefixUnaryExpression */:
                var prefixUnary = node;
                this.emit(ts.tokenToString(prefixUnary.operator));
                this.visit(prefixUnary.operand);
                break;
            case 169 /* PostfixUnaryExpression */:
                var postfixUnary = node;
                this.visit(postfixUnary.operand);
                this.emit(ts.tokenToString(postfixUnary.operator));
                break;
            case 171 /* ConditionalExpression */:
                var conditional = node;
                this.visit(conditional.condition);
                this.emit('?');
                this.visit(conditional.whenTrue);
                this.emit(':');
                this.visit(conditional.whenFalse);
                break;
            case 165 /* DeleteExpression */:
                this.reportError(node, 'delete operator is unsupported');
                break;
            case 167 /* VoidExpression */:
                this.reportError(node, 'void operator is unsupported');
                break;
            case 166 /* TypeOfExpression */:
                this.reportError(node, 'typeof operator is unsupported');
                break;
            case 162 /* ParenthesizedExpression */:
                var parenExpr = node;
                this.emit('(');
                this.visit(parenExpr.expression);
                this.emit(')');
                break;
            case 156 /* PropertyAccessExpression */:
                var propAccess = node;
                if (propAccess.name.text === 'stack' &&
                    this.hasAncestor(propAccess, 224 /* CatchClause */)) {
                    // Handle `e.stack` accesses in catch clauses by mangling to `e_stack`.
                    // FIXME: Use type checker/FacadeConverter to make sure this is actually Error.stack.
                    this.visit(propAccess.expression);
                    this.emitNoSpace('_stack');
                }
                else {
                    if (this.fc.handlePropertyAccess(propAccess))
                        break;
                    this.visit(propAccess.expression);
                    this.emit('.');
                    this.visit(propAccess.name);
                }
                break;
            case 157 /* ElementAccessExpression */:
                var elemAccess = node;
                this.visit(elemAccess.expression);
                this.emit('[');
                this.visit(elemAccess.argumentExpression);
                this.emit(']');
                break;
            default:
                return false;
        }
        return true;
    };
    return ExpressionTranspiler;
})(base.TranspilerBase);
module.exports = ExpressionTranspiler;

//# sourceMappingURL=expression.js.map