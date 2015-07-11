/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
describe('calls', function () {
    it('translates destructuring parameters', function () {
        test_support_1.expectTranslate('function x({p = null, d = false} = {}) {}')
            .to.equal(' x ( { p : null , d : false } ) { }');
        test_support_1.expectErroneousCode('function x({a=false}={a:true})')
            .to.throw('initializers for named parameters must be empty object literals');
        test_support_1.expectErroneousCode('function x({a=false}=true)')
            .to.throw('initializers for named parameters must be empty object literals');
        test_support_1.expectTranslate('class X { constructor() { super({p: 1}); } }')
            .to.equal(' class X { X ( ) : super ( p : 1 ) {' +
            ' /* super call moved to initializer */ ; } }');
    });
    it('hacks last object literal parameters into named parameter', function () {
        test_support_1.expectTranslate('f(x, {a: 12, b: 4});').to.equal(' f ( x , a : 12 , b : 4 ) ;');
        test_support_1.expectTranslate('f({a: 12});').to.equal(' f ( a : 12 ) ;');
        test_support_1.expectTranslate('f({"a": 12});').to.equal(' f ( { "a" : 12 } ) ;');
        test_support_1.expectTranslate('new X(x, {a: 12, b: 4});').to.equal(' new X ( x , a : 12 , b : 4 ) ;');
        test_support_1.expectTranslate('f(x, {});').to.equal(' f ( x , { } ) ;');
    });
    it('translates calls', function () {
        test_support_1.expectTranslate('foo();').to.equal(' foo ( ) ;');
        test_support_1.expectTranslate('foo(1, 2);').to.equal(' foo ( 1 , 2 ) ;');
    });
    it('translates new calls', function () {
        test_support_1.expectTranslate('new Foo();').to.equal(' new Foo ( ) ;');
        test_support_1.expectTranslate('new Foo(1, 2);').to.equal(' new Foo ( 1 , 2 ) ;');
        test_support_1.expectTranslate('new Foo<number, string>(1, 2);')
            .to.equal(' new Foo < num , String > ( 1 , 2 ) ;');
    });
    it('translates "super()" constructor calls', function () {
        test_support_1.expectTranslate('class X { constructor() { super(1); } }')
            .to.equal(' class X { X ( ) : super ( 1 ) { /* super call moved to initializer */ ; } }');
        test_support_1.expectErroneousCode('class X { constructor() { if (y) super(1, 2); } }')
            .to.throw('super calls must be immediate children of their constructors');
        test_support_1.expectTranslate('class X { constructor() { a(); super(1); b(); } }')
            .to.equal(' class X { X ( ) : super ( 1 ) {' +
            ' a ( ) ; /* super call moved to initializer */ ; b ( ) ;' +
            ' } }');
    });
    it('translates "super.x()" super method calls', function () {
        test_support_1.expectTranslate('class X { y() { super.z(1); } }')
            .to.equal(' class X { y ( ) { super . z ( 1 ) ; } }');
    });
});

//# sourceMappingURL=data:application/json;base64,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dCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tb2NoYS9tb2NoYS5kLnRzXCIvPlxuaW1wb3J0IHtleHBlY3RUcmFuc2xhdGUsIGV4cGVjdEVycm9uZW91c0NvZGV9IGZyb20gJy4vdGVzdF9zdXBwb3J0JztcblxuZGVzY3JpYmUoJ2NhbGxzJywgKCkgPT4ge1xuICBpdCgndHJhbnNsYXRlcyBkZXN0cnVjdHVyaW5nIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmdW5jdGlvbiB4KHtwID0gbnVsbCwgZCA9IGZhbHNlfSA9IHt9KSB7fScpXG4gICAgICAgIC50by5lcXVhbCgnIHggKCB7IHAgOiBudWxsICwgZCA6IGZhbHNlIH0gKSB7IH0nKTtcbiAgICBleHBlY3RFcnJvbmVvdXNDb2RlKCdmdW5jdGlvbiB4KHthPWZhbHNlfT17YTp0cnVlfSknKVxuICAgICAgICAudG8udGhyb3coJ2luaXRpYWxpemVycyBmb3IgbmFtZWQgcGFyYW1ldGVycyBtdXN0IGJlIGVtcHR5IG9iamVjdCBsaXRlcmFscycpO1xuICAgIGV4cGVjdEVycm9uZW91c0NvZGUoJ2Z1bmN0aW9uIHgoe2E9ZmFsc2V9PXRydWUpJylcbiAgICAgICAgLnRvLnRocm93KCdpbml0aWFsaXplcnMgZm9yIG5hbWVkIHBhcmFtZXRlcnMgbXVzdCBiZSBlbXB0eSBvYmplY3QgbGl0ZXJhbHMnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoe3A6IDF9KTsgfSB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgY2xhc3MgWCB7IFggKCApIDogc3VwZXIgKCBwIDogMSApIHsnICtcbiAgICAgICAgICAgICAgICAgICcgLyogc3VwZXIgY2FsbCBtb3ZlZCB0byBpbml0aWFsaXplciAqLyA7IH0gfScpO1xuICB9KTtcbiAgaXQoJ2hhY2tzIGxhc3Qgb2JqZWN0IGxpdGVyYWwgcGFyYW1ldGVycyBpbnRvIG5hbWVkIHBhcmFtZXRlcicsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2YoeCwge2E6IDEyLCBiOiA0fSk7JykudG8uZXF1YWwoJyBmICggeCAsIGEgOiAxMiAsIGIgOiA0ICkgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnZih7YTogMTJ9KTsnKS50by5lcXVhbCgnIGYgKCBhIDogMTIgKSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmKHtcImFcIjogMTJ9KTsnKS50by5lcXVhbCgnIGYgKCB7IFwiYVwiIDogMTIgfSApIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ25ldyBYKHgsIHthOiAxMiwgYjogNH0pOycpLnRvLmVxdWFsKCcgbmV3IFggKCB4ICwgYSA6IDEyICwgYiA6IDQgKSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmKHgsIHt9KTsnKS50by5lcXVhbCgnIGYgKCB4ICwgeyB9ICkgOycpO1xuICB9KTtcbiAgaXQoJ3RyYW5zbGF0ZXMgY2FsbHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmb28oKTsnKS50by5lcXVhbCgnIGZvbyAoICkgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnZm9vKDEsIDIpOycpLnRvLmVxdWFsKCcgZm9vICggMSAsIDIgKSA7Jyk7XG4gIH0pO1xuICBpdCgndHJhbnNsYXRlcyBuZXcgY2FsbHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCduZXcgRm9vKCk7JykudG8uZXF1YWwoJyBuZXcgRm9vICggKSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCduZXcgRm9vKDEsIDIpOycpLnRvLmVxdWFsKCcgbmV3IEZvbyAoIDEgLCAyICkgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnbmV3IEZvbzxudW1iZXIsIHN0cmluZz4oMSwgMik7JylcbiAgICAgICAgLnRvLmVxdWFsKCcgbmV3IEZvbyA8IG51bSAsIFN0cmluZyA+ICggMSAsIDIgKSA7Jyk7XG4gIH0pO1xuICBpdCgndHJhbnNsYXRlcyBcInN1cGVyKClcIiBjb25zdHJ1Y3RvciBjYWxscycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoMSk7IH0gfScpXG4gICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggeyBYICggKSA6IHN1cGVyICggMSApIHsgLyogc3VwZXIgY2FsbCBtb3ZlZCB0byBpbml0aWFsaXplciAqLyA7IH0gfScpO1xuICAgIGV4cGVjdEVycm9uZW91c0NvZGUoJ2NsYXNzIFggeyBjb25zdHJ1Y3RvcigpIHsgaWYgKHkpIHN1cGVyKDEsIDIpOyB9IH0nKVxuICAgICAgICAudG8udGhyb3coJ3N1cGVyIGNhbGxzIG11c3QgYmUgaW1tZWRpYXRlIGNoaWxkcmVuIG9mIHRoZWlyIGNvbnN0cnVjdG9ycycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IGNvbnN0cnVjdG9yKCkgeyBhKCk7IHN1cGVyKDEpOyBiKCk7IH0gfScpXG4gICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggeyBYICggKSA6IHN1cGVyICggMSApIHsnICtcbiAgICAgICAgICAgICAgICAgICcgYSAoICkgOyAvKiBzdXBlciBjYWxsIG1vdmVkIHRvIGluaXRpYWxpemVyICovIDsgYiAoICkgOycgK1xuICAgICAgICAgICAgICAgICAgJyB9IH0nKTtcbiAgfSk7XG4gIGl0KCd0cmFuc2xhdGVzIFwic3VwZXIueCgpXCIgc3VwZXIgbWV0aG9kIGNhbGxzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IHkoKSB7IHN1cGVyLnooMSk7IH0gfScpXG4gICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggeyB5ICggKSB7IHN1cGVyIC4geiAoIDEgKSA7IH0gfScpO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9