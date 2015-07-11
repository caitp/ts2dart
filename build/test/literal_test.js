/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
describe('literals', function () {
    it('translates string literals', function () {
        test_support_1.expectTranslate("'hello\\' \"world'").to.equal(" \"hello' \\\"world\" ;");
        test_support_1.expectTranslate("\"hello\\\" 'world\"").to.equal(" \"hello\\\" 'world\" ;");
    });
    it('translates string templates', function () {
        test_support_1.expectTranslate("`hello \nworld`").to.equal(" '''hello \nworld''' ;");
        test_support_1.expectTranslate("`hello ${world}`").to.equal(" '''hello ${ world}''' ;");
        test_support_1.expectTranslate("`${a}$b${$c}`").to.equal(" '''${ a}\\$b${ $c}''' ;");
        test_support_1.expectTranslate("`'${a}'`").to.equal(" '''\\'${ a}\\'''' ;");
        test_support_1.expectTranslate("`'a'`").to.equal(" '''\\'a\\'''' ;");
        // https://github.com/angular/angular/issues/509
        test_support_1.expectTranslate('"${a}"').to.equal(' "\\${a}" ;');
        test_support_1.expectTranslate('"\\${a}"').to.equal(' "\\${a}" ;');
        test_support_1.expectTranslate("'\\${a}'").to.equal(' "\\${a}" ;');
        test_support_1.expectTranslate("'$a'").to.equal(' "\\$a" ;');
        test_support_1.expectTranslate("`$a`").to.equal(" '''\\$a''' ;");
        test_support_1.expectTranslate("`\\$a`").to.equal(" '''\\$a''' ;");
    });
    it('escapes escape sequences', function () { test_support_1.expectTranslate("`\\\\u1234`").to.equal(" '''\\\\u1234''' ;"); });
    it('translates boolean literals', function () {
        test_support_1.expectTranslate('true').to.equal(' true ;');
        test_support_1.expectTranslate('false').to.equal(' false ;');
        test_support_1.expectTranslate('var b:boolean = true;').to.equal(' bool b = true ;');
    });
    it('translates the null literal', function () { test_support_1.expectTranslate('null').to.equal(' null ;'); });
    it('translates number literals', function () {
        // Negative numbers are handled by unary minus expressions.
        test_support_1.expectTranslate('1234').to.equal(' 1234 ;');
        test_support_1.expectTranslate('12.34').to.equal(' 12.34 ;');
        test_support_1.expectTranslate('1.23e-4').to.equal(' 1.23e-4 ;');
    });
    it('translates regexp literals', function () {
        test_support_1.expectTranslate('/wo\\/t?/g').to.equal(' new RegExp ( r\'wo\\/t?\' ) ;');
        test_support_1.expectTranslate('/\'/g').to.equal(' new RegExp ( r\'\' + "\'" + r\'\' ) ;');
        test_support_1.expectTranslate('/\'o\'/g').to.equal(' new RegExp ( r\'\' + "\'" + r\'o\' + "\'" + r\'\' ) ;');
        test_support_1.expectTranslate('/abc/gmi')
            .to.equal(' new RegExp ( r\'abc\' , multiLine: true , caseSensitive: false ) ;');
        test_support_1.expectErroneousCode('/abc/').to.throw(/Regular Expressions must use the \/\/g flag/);
    });
    it('translates array literals', function () {
        test_support_1.expectTranslate('[1,2]').to.equal(' [ 1 , 2 ] ;');
        test_support_1.expectTranslate('[1,]').to.equal(' [ 1 ] ;');
        test_support_1.expectTranslate('[]').to.equal(' [ ] ;');
    });
    it('translates object literals', function () {
        test_support_1.expectTranslate('var x = {a: 1, b: 2}').to.equal(' var x = { "a" : 1 , "b" : 2 } ;');
        test_support_1.expectTranslate('var x = {a: 1, }').to.equal(' var x = { "a" : 1 } ;');
        test_support_1.expectTranslate('var x = {}').to.equal(' var x = { } ;');
        test_support_1.expectTranslate('var x = {y}').to.equal(' var x = { "y" : y } ;');
    });
});

//# sourceMappingURL=data:application/json;base64,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O1FBQ3ZFLDhCQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pELDhCQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9saXRlcmFsX3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tb2NoYS9tb2NoYS5kLnRzXCIvPlxuaW1wb3J0IHtleHBlY3RUcmFuc2xhdGUsIGV4cGVjdEVycm9uZW91c0NvZGV9IGZyb20gJy4vdGVzdF9zdXBwb3J0JztcblxuZGVzY3JpYmUoJ2xpdGVyYWxzJywgKCkgPT4ge1xuICBpdCgndHJhbnNsYXRlcyBzdHJpbmcgbGl0ZXJhbHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKGAnaGVsbG9cXFxcJyBcIndvcmxkJ2ApLnRvLmVxdWFsKGAgXCJoZWxsbycgXFxcXFwid29ybGRcIiA7YCk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKGBcImhlbGxvXFxcXFwiICd3b3JsZFwiYCkudG8uZXF1YWwoYCBcImhlbGxvXFxcXFwiICd3b3JsZFwiIDtgKTtcbiAgfSk7XG5cbiAgaXQoJ3RyYW5zbGF0ZXMgc3RyaW5nIHRlbXBsYXRlcycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoXCJgaGVsbG8gXFxud29ybGRgXCIpLnRvLmVxdWFsKFwiICcnJ2hlbGxvIFxcbndvcmxkJycnIDtcIik7XG4gICAgZXhwZWN0VHJhbnNsYXRlKFwiYGhlbGxvICR7d29ybGR9YFwiKS50by5lcXVhbChcIiAnJydoZWxsbyAkeyB3b3JsZH0nJycgO1wiKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoXCJgJHthfSRiJHskY31gXCIpLnRvLmVxdWFsKFwiICcnJyR7IGF9XFxcXCRiJHsgJGN9JycnIDtcIik7XG4gICAgZXhwZWN0VHJhbnNsYXRlKFwiYCcke2F9J2BcIikudG8uZXF1YWwoXCIgJycnXFxcXCckeyBhfVxcXFwnJycnIDtcIik7XG4gICAgZXhwZWN0VHJhbnNsYXRlKFwiYCdhJ2BcIikudG8uZXF1YWwoXCIgJycnXFxcXCdhXFxcXCcnJycgO1wiKTtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy81MDlcbiAgICBleHBlY3RUcmFuc2xhdGUoJ1wiJHthfVwiJykudG8uZXF1YWwoJyBcIlxcXFwke2F9XCIgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnXCJcXFxcJHthfVwiJykudG8uZXF1YWwoJyBcIlxcXFwke2F9XCIgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZShcIidcXFxcJHthfSdcIikudG8uZXF1YWwoJyBcIlxcXFwke2F9XCIgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZShcIickYSdcIikudG8uZXF1YWwoJyBcIlxcXFwkYVwiIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoXCJgJGFgXCIpLnRvLmVxdWFsKFwiICcnJ1xcXFwkYScnJyA7XCIpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZShcImBcXFxcJGFgXCIpLnRvLmVxdWFsKFwiICcnJ1xcXFwkYScnJyA7XCIpO1xuICB9KTtcblxuICBpdCgnZXNjYXBlcyBlc2NhcGUgc2VxdWVuY2VzJyxcbiAgICAgKCkgPT4geyBleHBlY3RUcmFuc2xhdGUoXCJgXFxcXFxcXFx1MTIzNGBcIikudG8uZXF1YWwoXCIgJycnXFxcXFxcXFx1MTIzNCcnJyA7XCIpOyB9KTtcblxuICBpdCgndHJhbnNsYXRlcyBib29sZWFuIGxpdGVyYWxzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndHJ1ZScpLnRvLmVxdWFsKCcgdHJ1ZSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmYWxzZScpLnRvLmVxdWFsKCcgZmFsc2UgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIGI6Ym9vbGVhbiA9IHRydWU7JykudG8uZXF1YWwoJyBib29sIGIgPSB0cnVlIDsnKTtcbiAgfSk7XG5cbiAgaXQoJ3RyYW5zbGF0ZXMgdGhlIG51bGwgbGl0ZXJhbCcsICgpID0+IHsgZXhwZWN0VHJhbnNsYXRlKCdudWxsJykudG8uZXF1YWwoJyBudWxsIDsnKTsgfSk7XG5cbiAgaXQoJ3RyYW5zbGF0ZXMgbnVtYmVyIGxpdGVyYWxzJywgKCkgPT4ge1xuICAgIC8vIE5lZ2F0aXZlIG51bWJlcnMgYXJlIGhhbmRsZWQgYnkgdW5hcnkgbWludXMgZXhwcmVzc2lvbnMuXG4gICAgZXhwZWN0VHJhbnNsYXRlKCcxMjM0JykudG8uZXF1YWwoJyAxMjM0IDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJzEyLjM0JykudG8uZXF1YWwoJyAxMi4zNCA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCcxLjIzZS00JykudG8uZXF1YWwoJyAxLjIzZS00IDsnKTtcbiAgfSk7XG5cbiAgaXQoJ3RyYW5zbGF0ZXMgcmVnZXhwIGxpdGVyYWxzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnL3dvXFxcXC90Py9nJykudG8uZXF1YWwoJyBuZXcgUmVnRXhwICggclxcJ3dvXFxcXC90P1xcJyApIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJy9cXCcvZycpLnRvLmVxdWFsKCcgbmV3IFJlZ0V4cCAoIHJcXCdcXCcgKyBcIlxcJ1wiICsgclxcJ1xcJyApIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJy9cXCdvXFwnL2cnKS50by5lcXVhbCgnIG5ldyBSZWdFeHAgKCByXFwnXFwnICsgXCJcXCdcIiArIHJcXCdvXFwnICsgXCJcXCdcIiArIHJcXCdcXCcgKSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCcvYWJjL2dtaScpXG4gICAgICAgIC50by5lcXVhbCgnIG5ldyBSZWdFeHAgKCByXFwnYWJjXFwnICwgbXVsdGlMaW5lOiB0cnVlICwgY2FzZVNlbnNpdGl2ZTogZmFsc2UgKSA7Jyk7XG4gICAgZXhwZWN0RXJyb25lb3VzQ29kZSgnL2FiYy8nKS50by50aHJvdygvUmVndWxhciBFeHByZXNzaW9ucyBtdXN0IHVzZSB0aGUgXFwvXFwvZyBmbGFnLyk7XG4gIH0pO1xuXG4gIGl0KCd0cmFuc2xhdGVzIGFycmF5IGxpdGVyYWxzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnWzEsMl0nKS50by5lcXVhbCgnIFsgMSAsIDIgXSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdbMSxdJykudG8uZXF1YWwoJyBbIDEgXSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdbXScpLnRvLmVxdWFsKCcgWyBdIDsnKTtcbiAgfSk7XG5cbiAgaXQoJ3RyYW5zbGF0ZXMgb2JqZWN0IGxpdGVyYWxzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIHggPSB7YTogMSwgYjogMn0nKS50by5lcXVhbCgnIHZhciB4ID0geyBcImFcIiA6IDEgLCBcImJcIiA6IDIgfSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd2YXIgeCA9IHthOiAxLCB9JykudG8uZXF1YWwoJyB2YXIgeCA9IHsgXCJhXCIgOiAxIH0gOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIHggPSB7fScpLnRvLmVxdWFsKCcgdmFyIHggPSB7IH0gOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIHggPSB7eX0nKS50by5lcXVhbCgnIHZhciB4ID0geyBcInlcIiA6IHkgfSA7Jyk7XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=