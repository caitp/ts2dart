/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
function ident(n) {
    if (n.kind === 65 /* Identifier */)
        return n.text;
    if (n.kind === 127 /* QualifiedName */) {
        var qname = n;
        var leftName = ident(qname.left);
        if (leftName)
            return leftName + '.' + ident(qname.right);
    }
    return null;
}
exports.ident = ident;
var TranspilerBase = (function () {
    function TranspilerBase(transpiler) {
        this.transpiler = transpiler;
    }
    TranspilerBase.prototype.visit = function (n) { this.transpiler.visit(n); };
    TranspilerBase.prototype.emit = function (s) { this.transpiler.emit(s); };
    TranspilerBase.prototype.emitNoSpace = function (s) { this.transpiler.emitNoSpace(s); };
    TranspilerBase.prototype.reportError = function (n, message) { this.transpiler.reportError(n, message); };
    TranspilerBase.prototype.visitNode = function (n) { throw new Error('not implemented'); };
    TranspilerBase.prototype.visitEach = function (nodes) {
        var _this = this;
        nodes.forEach(function (n) { return _this.visit(n); });
    };
    TranspilerBase.prototype.visitEachIfPresent = function (nodes) {
        if (nodes)
            this.visitEach(nodes);
    };
    TranspilerBase.prototype.visitList = function (nodes, separator) {
        if (separator === void 0) { separator = ','; }
        for (var i = 0; i < nodes.length; i++) {
            this.visit(nodes[i]);
            if (i < nodes.length - 1)
                this.emit(separator);
        }
    };
    TranspilerBase.prototype.getAncestor = function (n, kind) {
        for (var parent = n; parent; parent = parent.parent) {
            if (parent.kind === kind)
                return parent;
        }
        return null;
    };
    TranspilerBase.prototype.hasAncestor = function (n, kind) { return !!this.getAncestor(n, kind); };
    TranspilerBase.prototype.hasAnnotation = function (decorators, name) {
        if (!decorators)
            return false;
        return decorators.some(function (d) {
            var decName = ident(d.expression);
            if (decName === name)
                return true;
            if (d.expression.kind !== 158 /* CallExpression */)
                return false;
            var callExpr = d.expression;
            decName = ident(callExpr.expression);
            return decName === name;
        });
    };
    TranspilerBase.prototype.hasFlag = function (n, flag) {
        return n && (n.flags & flag) !== 0 || false;
    };
    TranspilerBase.prototype.isConst = function (decl) {
        var _this = this;
        return this.hasAnnotation(decl.decorators, 'CONST') ||
            decl.members.some(function (m) {
                if (m.kind !== 136 /* Constructor */)
                    return false;
                return _this.hasAnnotation(m.decorators, 'CONST');
            });
    };
    TranspilerBase.prototype.getRelativeFileName = function (fileName) {
        return this.transpiler.getRelativeFileName(fileName);
    };
    TranspilerBase.prototype.maybeVisitTypeArguments = function (n) {
        if (n.typeArguments) {
            this.emit('<');
            this.visitList(n.typeArguments);
            this.emit('>');
        }
    };
    return TranspilerBase;
})();
exports.TranspilerBase = TranspilerBase;

//# sourceMappingURL=base.js.map