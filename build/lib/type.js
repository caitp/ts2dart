var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var TypeTranspiler = (function (_super) {
    __extends(TypeTranspiler, _super);
    function TypeTranspiler(tr, fc) {
        _super.call(this, tr);
        this.fc = fc;
    }
    TypeTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 146 /* TypeLiteral */:
                // Dart doesn't support type literals.
                this.emit('dynamic');
                break;
            case 149 /* UnionType */:
                this.emit('dynamic /*');
                this.visitList(node.types, "|");
                this.emit('*/');
                break;
            case 142 /* TypeReference */:
                var typeRef = node;
                this.fc.visitTypeName(typeRef.typeName);
                this.maybeVisitTypeArguments(typeRef);
                break;
            case 161 /* TypeAssertionExpression */:
                var typeAssertExpr = node;
                this.emit('(');
                this.visit(typeAssertExpr.expression);
                this.emit('as');
                this.visit(typeAssertExpr.type);
                this.emit(')');
                break;
            case 129 /* TypeParameter */:
                var typeParam = node;
                this.visit(typeParam.name);
                if (typeParam.constraint) {
                    this.emit('extends');
                    this.visit(typeParam.constraint);
                }
                break;
            case 147 /* ArrayType */:
                this.emit('List');
                this.emit('<');
                this.visit(node.elementType);
                this.emit('>');
                break;
            case 143 /* FunctionType */:
                this.emit('dynamic /*');
                this.emit(node.getText());
                this.emit('*/');
                break;
            case 127 /* QualifiedName */:
                var first = node;
                this.visit(first.left);
                this.emit('.');
                this.visit(first.right);
                break;
            case 65 /* Identifier */:
                var ident = node;
                this.emit(ident.text);
                break;
            case 120 /* NumberKeyword */:
                this.emit('num');
                break;
            case 122 /* StringKeyword */:
                this.emit('String');
                break;
            case 99 /* VoidKeyword */:
                this.emit('void');
                break;
            case 113 /* BooleanKeyword */:
                this.emit('bool');
                break;
            case 112 /* AnyKeyword */:
                this.emit('dynamic');
                break;
            default:
                return false;
        }
        return true;
    };
    return TypeTranspiler;
})(base.TranspilerBase);
module.exports = TypeTranspiler;

//# sourceMappingURL=type.js.map