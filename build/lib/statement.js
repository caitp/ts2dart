var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />
var ts = require('typescript');
var base = require('./base');
var StatementTranspiler = (function (_super) {
    __extends(StatementTranspiler, _super);
    function StatementTranspiler(tr) {
        _super.call(this, tr);
    }
    StatementTranspiler.prototype.visitNode = function (node) {
        switch (node.kind) {
            case 182 /* EmptyStatement */:
                this.emit(';');
                break;
            case 192 /* ReturnStatement */:
                var retStmt = node;
                this.emit('return');
                if (retStmt.expression)
                    this.visit(retStmt.expression);
                this.emit(';');
                break;
            case 191 /* BreakStatement */:
            case 190 /* ContinueStatement */:
                var breakContinue = node;
                this.emit(breakContinue.kind == 191 /* BreakStatement */ ? 'break' : 'continue');
                if (breakContinue.label)
                    this.visit(breakContinue.label);
                this.emit(';');
                break;
            case 181 /* VariableStatement */:
                var variableStmt = node;
                this.visit(variableStmt.declarationList);
                this.emit(';');
                break;
            case 183 /* ExpressionStatement */:
                var expr = node;
                this.visit(expr.expression);
                this.emit(';');
                break;
            case 194 /* SwitchStatement */:
                var switchStmt = node;
                this.emit('switch (');
                this.visit(switchStmt.expression);
                this.emit(')');
                this.visit(switchStmt.caseBlock);
                break;
            case 208 /* CaseBlock */:
                this.emit('{');
                this.visitEach(node.clauses);
                this.emit('}');
                break;
            case 221 /* CaseClause */:
                var caseClause = node;
                this.emit('case');
                this.visit(caseClause.expression);
                this.emit(':');
                this.visitEach(caseClause.statements);
                break;
            case 222 /* DefaultClause */:
                this.emit('default :');
                this.visitEach(node.statements);
                break;
            case 184 /* IfStatement */:
                var ifStmt = node;
                this.emit('if (');
                this.visit(ifStmt.expression);
                this.emit(')');
                this.visit(ifStmt.thenStatement);
                if (ifStmt.elseStatement) {
                    this.emit('else');
                    this.visit(ifStmt.elseStatement);
                }
                break;
            case 187 /* ForStatement */:
                var forStmt = node;
                this.emit('for (');
                if (forStmt.initializer)
                    this.visit(forStmt.initializer);
                this.emit(';');
                if (forStmt.condition)
                    this.visit(forStmt.condition);
                this.emit(';');
                if (forStmt.incrementor)
                    this.visit(forStmt.incrementor);
                this.emit(')');
                this.visit(forStmt.statement);
                break;
            case 188 /* ForInStatement */:
                // TODO(martinprobst): Dart's for-in loops actually have different semantics, they are more
                // like for-of loops, iterating over collections.
                var forInStmt = node;
                this.emit('for (');
                if (forInStmt.initializer)
                    this.visit(forInStmt.initializer);
                this.emit('in');
                this.visit(forInStmt.expression);
                this.emit(')');
                this.visit(forInStmt.statement);
                break;
            case 186 /* WhileStatement */:
                var whileStmt = node;
                this.emit('while (');
                this.visit(whileStmt.expression);
                this.emit(')');
                this.visit(whileStmt.statement);
                break;
            case 185 /* DoStatement */:
                var doStmt = node;
                this.emit('do');
                this.visit(doStmt.statement);
                this.emit('while (');
                this.visit(doStmt.expression);
                this.emit(') ;');
                break;
            case 196 /* ThrowStatement */:
                var throwStmt = node;
                var surroundingCatchClause = this.getAncestor(throwStmt, 224 /* CatchClause */);
                if (surroundingCatchClause) {
                    var ref = surroundingCatchClause.variableDeclaration;
                    if (ref.getText() === throwStmt.expression.getText()) {
                        this.emit('rethrow');
                        this.emit(';');
                        break;
                    }
                }
                this.emit('throw');
                this.visit(throwStmt.expression);
                this.emit(';');
                break;
            case 197 /* TryStatement */:
                var tryStmt = node;
                this.emit('try');
                this.visit(tryStmt.tryBlock);
                if (tryStmt.catchClause) {
                    this.visit(tryStmt.catchClause);
                }
                if (tryStmt.finallyBlock) {
                    this.emit('finally');
                    this.visit(tryStmt.finallyBlock);
                }
                break;
            case 224 /* CatchClause */:
                var ctch = node;
                if (ctch.variableDeclaration.type) {
                    this.emit('on');
                    this.visit(ctch.variableDeclaration.type);
                }
                this.emit('catch');
                this.emit('(');
                this.visit(ctch.variableDeclaration.name);
                this.emit(',');
                this.visit(ctch.variableDeclaration.name);
                this.emitNoSpace('_stack');
                this.emit(')');
                this.visit(ctch.block);
                break;
            case 180 /* Block */:
                this.emit('{');
                this.visitEach(node.statements);
                this.emit('}');
                break;
            default:
                return false;
        }
        return true;
    };
    return StatementTranspiler;
})(base.TranspilerBase);
module.exports = StatementTranspiler;

//# sourceMappingURL=statement.js.map