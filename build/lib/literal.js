var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var LiteralTranspiler = (function (_super) {
    __extends(LiteralTranspiler, _super);
    function LiteralTranspiler(tr, fc) {
        _super.call(this, tr);
        this.fc = fc;
    }
    LiteralTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            // Literals.
            case 7 /* NumericLiteral */:
                var sLit = node;
                this.emit(sLit.getText());
                break;
            case 8 /* StringLiteral */:
                var sLit = node;
                var text = JSON.stringify(sLit.text);
                // Escape dollar sign since dart will interpolate in double quoted literal
                var text = text.replace(/\$/, '\\$');
                this.emit(text);
                break;
            case 10 /* NoSubstitutionTemplateLiteral */:
                this.emit("'''" + this.escapeTextForTemplateString(node) + "'''");
                break;
            case 12 /* TemplateMiddle */:
                this.emitNoSpace(this.escapeTextForTemplateString(node));
                break;
            case 172 /* TemplateExpression */:
                var tmpl = node;
                if (tmpl.head)
                    this.visit(tmpl.head);
                if (tmpl.templateSpans)
                    this.visitEach(tmpl.templateSpans);
                break;
            case 11 /* TemplateHead */:
                this.emit("'''" + this.escapeTextForTemplateString(node)); // highlighting bug:'
                break;
            case 13 /* TemplateTail */:
                this.emitNoSpace(this.escapeTextForTemplateString(node));
                this.emitNoSpace("'''");
                break;
            case 178 /* TemplateSpan */:
                var span = node;
                if (span.expression) {
                    // Do not emit extra whitespace inside the string template
                    this.emitNoSpace('${');
                    this.visit(span.expression);
                    this.emitNoSpace('}');
                }
                if (span.literal)
                    this.visit(span.literal);
                break;
            case 154 /* ArrayLiteralExpression */:
                if (this.shouldBeConst(node))
                    this.emit('const');
                this.emit('[');
                this.visitList(node.elements);
                this.emit(']');
                break;
            case 155 /* ObjectLiteralExpression */:
                if (this.shouldBeConst(node))
                    this.emit('const');
                this.emit('{');
                this.visitList(node.properties);
                this.emit('}');
                break;
            case 225 /* PropertyAssignment */:
                var propAssign = node;
                if (propAssign.name.kind === 65 /* Identifier */) {
                    // Dart identifiers in Map literals need quoting.
                    this.emitNoSpace(' "');
                    this.emitNoSpace(propAssign.name.text);
                    this.emitNoSpace('"');
                }
                else {
                    this.visit(propAssign.name);
                }
                this.emit(':');
                this.visit(propAssign.initializer);
                break;
            case 226 /* ShorthandPropertyAssignment */:
                var shorthand = node;
                this.emitNoSpace(' "');
                this.emitNoSpace(shorthand.name.text);
                this.emitNoSpace('"');
                this.emit(':');
                this.visit(shorthand.name);
                break;
            case 95 /* TrueKeyword */:
                this.emit('true');
                break;
            case 80 /* FalseKeyword */:
                this.emit('false');
                break;
            case 89 /* NullKeyword */:
                this.emit('null');
                break;
            case 9 /* RegularExpressionLiteral */:
                this.emit('new RegExp (');
                this.emit('r\'');
                var regExp = node.text;
                var slashIdx = regExp.lastIndexOf('/');
                var flags = regExp.substring(slashIdx + 1);
                regExp = regExp.substring(1, slashIdx); // cut off /.../ chars.
                regExp = regExp.replace(/'/g, '\' + "\'" + r\''); // handle nested quotes by concatenation.
                this.emitNoSpace(regExp);
                this.emitNoSpace('\'');
                if (flags.indexOf('g') === -1) {
                    // Dart RegExps are always global, so JS regexps must use 'g' so that semantics match.
                    this.reportError(node, 'Regular Expressions must use the //g flag');
                }
                if (flags.indexOf('m') !== -1) {
                    this.emit(', multiLine: true');
                }
                if (flags.indexOf('i') !== -1) {
                    this.emit(', caseSensitive: false');
                }
                this.emit(')');
                break;
            case 93 /* ThisKeyword */:
                this.emit('this');
                break;
            default:
                return false;
        }
        return true;
    };
    LiteralTranspiler.prototype.shouldBeConst = function (n) {
        return this.hasAncestor(n, 131 /* Decorator */) || this.fc.isInsideConstExpr(n);
    };
    LiteralTranspiler.prototype.escapeTextForTemplateString = function (n) {
        return n.text.replace(/\\/g, '\\\\').replace(/([$'])/g, '\\$1');
    };
    return LiteralTranspiler;
})(base.TranspilerBase);
module.exports = LiteralTranspiler;

//# sourceMappingURL=literal.js.map