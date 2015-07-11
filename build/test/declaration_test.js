/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
describe('variables', function () {
    it('should print variable declaration with initializer', function () { test_support_1.expectTranslate('var a:number = 1;').to.equal(' num a = 1 ;'); });
    it('should print variable declaration', function () {
        test_support_1.expectTranslate('var a:number;').to.equal(' num a ;');
        test_support_1.expectTranslate('var a;').to.equal(' var a ;');
        test_support_1.expectTranslate('var a:any;').to.equal(' dynamic a ;');
    });
    it('should transpile variable declaration lists', function () {
        test_support_1.expectTranslate('var a: A;').to.equal(' A a ;');
        test_support_1.expectTranslate('var a, b;').to.equal(' var a , b ;');
    });
    it('should transpile variable declaration lists with initializers', function () {
        test_support_1.expectTranslate('var a = 0;').to.equal(' var a = 0 ;');
        test_support_1.expectTranslate('var a, b = 0;').to.equal(' var a , b = 0 ;');
        test_support_1.expectTranslate('var a = 1, b = 0;').to.equal(' var a = 1 , b = 0 ;');
    });
    it('does not support vardecls containing more than one type (implicit or explicit)', function () {
        var msg = 'Variables in a declaration list of more than one variable cannot by typed';
        test_support_1.expectErroneousCode('var a: A, untyped;').to.throw(msg);
        test_support_1.expectErroneousCode('var untyped, b: B;').to.throw(msg);
        test_support_1.expectErroneousCode('var n: number, s: string;').to.throw(msg);
        test_support_1.expectErroneousCode('var untyped, n: number, s: string;').to.throw(msg);
    });
    it('supports const', function () {
        test_support_1.expectTranslate('const A = 1, B = 2;').to.equal(' const A = 1 , B = 2 ;');
        test_support_1.expectTranslate('const A: number = 1;').to.equal(' const num A = 1 ;');
    });
});
describe('classes', function () {
    it('should translate classes', function () { test_support_1.expectTranslate('class X {}').to.equal(' class X { }'); });
    it('should support extends', function () { test_support_1.expectTranslate('class X extends Y {}').to.equal(' class X extends Y { }'); });
    it('should support implements', function () {
        test_support_1.expectTranslate('class X implements Y, Z {}').to.equal(' class X implements Y , Z { }');
    });
    it('should support implements', function () {
        test_support_1.expectTranslate('class X extends Y implements Z {}')
            .to.equal(' class X extends Y implements Z { }');
    });
    describe('members', function () {
        it('supports empty declarations', function () { test_support_1.expectTranslate('class X { ; }').to.equal(' class X { }'); });
        it('supports fields', function () {
            test_support_1.expectTranslate('class X { x: number; y: string; }')
                .to.equal(' class X { num x ; String y ; }');
            test_support_1.expectTranslate('class X { x; }').to.equal(' class X { var x ; }');
        });
        it('supports field initializers', function () {
            test_support_1.expectTranslate('class X { x: number = 42; }').to.equal(' class X { num x = 42 ; }');
        });
        // TODO(martinprobst): Re-enable once Angular is migrated to TS.
        it.skip('supports visibility modifiers', function () {
            test_support_1.expectTranslate('class X { private _x; x; }').to.equal(' class X { var _x ; var x ; }');
            test_support_1.expectErroneousCode('class X { private x; }')
                .to.throw('private members must be prefixed with "_"');
            test_support_1.expectErroneousCode('class X { _x; }')
                .to.throw('public members must not be prefixed with "_"');
        });
        it.skip('does not support protected', function () {
            test_support_1.expectErroneousCode('class X { protected x; }')
                .to.throw('protected declarations are unsupported');
        });
        it('supports static fields', function () {
            test_support_1.expectTranslate('class X { static x: number = 42; }')
                .to.equal(' class X { static num x = 42 ; }');
        });
        it('supports methods', function () {
            test_support_1.expectTranslate('class X { x() { return 42; } }')
                .to.equal(' class X { x ( ) { return 42 ; } }');
        });
        it('supports method return types', function () {
            test_support_1.expectTranslate('class X { x(): number { return 42; } }')
                .to.equal(' class X { num x ( ) { return 42 ; } }');
        });
        it('supports method params', function () {
            test_support_1.expectTranslate('class X { x(a, b) { return 42; } }')
                .to.equal(' class X { x ( a , b ) { return 42 ; } }');
        });
        it('supports method return types', function () {
            test_support_1.expectTranslate('class X { x( a : number, b : string ) { return 42; } }')
                .to.equal(' class X { x ( num a , String b ) { return 42 ; } }');
        });
        it('supports get methods', function () {
            test_support_1.expectTranslate('class X { get y(): number {} }').to.equal(' class X { num get y { } }');
            test_support_1.expectTranslate('class X { static get Y(): number {} }')
                .to.equal(' class X { static num get Y { } }');
        });
        it('supports set methods', function () {
            test_support_1.expectTranslate('class X { set y(n: number) {} }')
                .to.equal(' class X { set y ( num n ) { } }');
            test_support_1.expectTranslate('class X { static get Y(): number {} }')
                .to.equal(' class X { static num get Y { } }');
        });
        it('supports constructors', function () {
            test_support_1.expectTranslate('class X { constructor() { } }').to.equal(' class X { X ( ) { } }');
        });
        it('supports parameter properties', function () {
            test_support_1.expectTranslate('class X { c: number; constructor(private bar: B, public foo: string = "hello", protected goggles: boolean = true) {} }')
                .to.equal(' class X { B bar ; String foo ; bool goggles ; num c ; X ( this . bar , [ this . foo = \"hello\" , this . goggles = true ] ) { } }');
            test_support_1.expectTranslate('@CONST class X { constructor(public foo: string, b: number, protected marbles: boolean = true) {} }')
                .to.equal(' class X { final String foo ; final bool marbles ; const X ( this . foo , num b , [ this . marbles = true ] ) ; }');
        });
    });
});
describe('interfaces', function () {
    it('should translate interfaces', function () { test_support_1.expectTranslate('interface X {}').to.equal(' abstract class X { }'); });
    it('should support extends', function () {
        test_support_1.expectTranslate('interface X extends Y, Z {}').to.equal(' abstract class X extends Y , Z { }');
    });
    it('should support implements', function () {
        test_support_1.expectTranslate('class X implements Y, Z {}').to.equal(' class X implements Y , Z { }');
    });
    it('should support implements', function () {
        test_support_1.expectTranslate('class X extends Y implements Z {}')
            .to.equal(' class X extends Y implements Z { }');
    });
    it('supports abstract methods', function () { test_support_1.expectTranslate('interface X { x(); }').to.equal(' abstract class X { x ( ) ; }'); });
    it('supports interface properties', function () {
        test_support_1.expectTranslate('interface X { x: string; y; }')
            .to.equal(' abstract class X { String x ; var y ; }');
    });
});
describe('single call signature interfaces', function () {
    it('should support declaration', function () {
        test_support_1.expectTranslate('interface F { (n: number): boolean; }')
            .to.equal(' typedef bool F ( num n ) ;');
    });
    it('should support generics', function () {
        test_support_1.expectTranslate('interface F<A, B> { (a: A): B; }')
            .to.equal(' typedef B F < A , B > ( A a ) ;');
    });
});
describe('enums', function () {
    it('should support basic enum declaration', function () {
        test_support_1.expectTranslate('enum Color { Red, Green, Blue }')
            .to.equal(' enum Color { Red , Green , Blue }');
    });
    it('does not support empty enum', function () { test_support_1.expectErroneousCode('enum Empty { }').to.throw('empty enums are not supported'); });
    it('does not support enum with initializer', function () {
        test_support_1.expectErroneousCode('enum Color { Red = 1, Green, Blue = 4 }')
            .to.throw('enum initializers are not supported');
    });
    it('should support switch over enum', function () {
        test_support_1.expectTranslate('switch(c) { case Color.Red: break; default: break; }')
            .to.equal(' switch ( c ) { case Color . Red : break ; default : break ; }');
    });
    it('does not support const enum', function () {
        test_support_1.expectErroneousCode('const enum Color { Red }').to.throw('const enums are not supported');
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZGVjbGFyYXRpb25fdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtREFBbUQ7QUFDbkQsNkJBQW1ELGdCQUFnQixDQUFDLENBQUE7QUFFcEUsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixFQUFFLENBQUMsb0RBQW9ELEVBQ3BELGNBQVEsOEJBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RSxFQUFFLENBQUMsbUNBQW1DLEVBQUU7UUFDdEMsOEJBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELDhCQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyw4QkFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7UUFDaEQsOEJBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELDhCQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtRQUNsRSw4QkFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsOEJBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUQsOEJBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxL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QUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsNkJBQTZCLEVBQzdCLGNBQVEsa0NBQW1CLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDM0Msa0NBQW1CLENBQUMseUNBQXlDLENBQUM7YUFDekQsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLDhCQUFlLENBQUMsc0RBQXNELENBQUM7YUFDbEUsRUFBRSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBQ2hDLGtDQUFtQixDQUFDLDBCQUEwQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQzVGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9kZWNsYXJhdGlvbl90ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbW9jaGEvbW9jaGEuZC50c1wiLz5cbmltcG9ydCB7ZXhwZWN0VHJhbnNsYXRlLCBleHBlY3RFcnJvbmVvdXNDb2RlfSBmcm9tICcuL3Rlc3Rfc3VwcG9ydCc7XG5cbmRlc2NyaWJlKCd2YXJpYWJsZXMnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcHJpbnQgdmFyaWFibGUgZGVjbGFyYXRpb24gd2l0aCBpbml0aWFsaXplcicsXG4gICAgICgpID0+IHsgZXhwZWN0VHJhbnNsYXRlKCd2YXIgYTpudW1iZXIgPSAxOycpLnRvLmVxdWFsKCcgbnVtIGEgPSAxIDsnKTsgfSk7XG4gIGl0KCdzaG91bGQgcHJpbnQgdmFyaWFibGUgZGVjbGFyYXRpb24nLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd2YXIgYTpudW1iZXI7JykudG8uZXF1YWwoJyBudW0gYSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd2YXIgYTsnKS50by5lcXVhbCgnIHZhciBhIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3ZhciBhOmFueTsnKS50by5lcXVhbCgnIGR5bmFtaWMgYSA7Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHRyYW5zcGlsZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBsaXN0cycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3ZhciBhOiBBOycpLnRvLmVxdWFsKCcgQSBhIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3ZhciBhLCBiOycpLnRvLmVxdWFsKCcgdmFyIGEgLCBiIDsnKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgdHJhbnNwaWxlIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGxpc3RzIHdpdGggaW5pdGlhbGl6ZXJzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIGEgPSAwOycpLnRvLmVxdWFsKCcgdmFyIGEgPSAwIDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3ZhciBhLCBiID0gMDsnKS50by5lcXVhbCgnIHZhciBhICwgYiA9IDAgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIGEgPSAxLCBiID0gMDsnKS50by5lcXVhbCgnIHZhciBhID0gMSAsIGIgPSAwIDsnKTtcbiAgfSk7XG4gIGl0KCdkb2VzIG5vdCBzdXBwb3J0IHZhcmRlY2xzIGNvbnRhaW5pbmcgbW9yZSB0aGFuIG9uZSB0eXBlIChpbXBsaWNpdCBvciBleHBsaWNpdCknLCAoKSA9PiB7XG4gICAgdmFyIG1zZyA9ICdWYXJpYWJsZXMgaW4gYSBkZWNsYXJhdGlvbiBsaXN0IG9mIG1vcmUgdGhhbiBvbmUgdmFyaWFibGUgY2Fubm90IGJ5IHR5cGVkJztcbiAgICBleHBlY3RFcnJvbmVvdXNDb2RlKCd2YXIgYTogQSwgdW50eXBlZDsnKS50by50aHJvdyhtc2cpO1xuICAgIGV4cGVjdEVycm9uZW91c0NvZGUoJ3ZhciB1bnR5cGVkLCBiOiBCOycpLnRvLnRocm93KG1zZyk7XG4gICAgZXhwZWN0RXJyb25lb3VzQ29kZSgndmFyIG46IG51bWJlciwgczogc3RyaW5nOycpLnRvLnRocm93KG1zZyk7XG4gICAgZXhwZWN0RXJyb25lb3VzQ29kZSgndmFyIHVudHlwZWQsIG46IG51bWJlciwgczogc3RyaW5nOycpLnRvLnRocm93KG1zZyk7XG4gIH0pO1xuXG4gIGl0KCdzdXBwb3J0cyBjb25zdCcsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2NvbnN0IEEgPSAxLCBCID0gMjsnKS50by5lcXVhbCgnIGNvbnN0IEEgPSAxICwgQiA9IDIgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY29uc3QgQTogbnVtYmVyID0gMTsnKS50by5lcXVhbCgnIGNvbnN0IG51bSBBID0gMSA7Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjbGFzc2VzJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHRyYW5zbGF0ZSBjbGFzc2VzJywgKCkgPT4geyBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFgge30nKS50by5lcXVhbCgnIGNsYXNzIFggeyB9Jyk7IH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgZXh0ZW5kcycsXG4gICAgICgpID0+IHsgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYIGV4dGVuZHMgWSB7fScpLnRvLmVxdWFsKCcgY2xhc3MgWCBleHRlbmRzIFkgeyB9Jyk7IH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgaW1wbGVtZW50cycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggaW1wbGVtZW50cyBZLCBaIHt9JykudG8uZXF1YWwoJyBjbGFzcyBYIGltcGxlbWVudHMgWSAsIFogeyB9Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgaW1wbGVtZW50cycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggZXh0ZW5kcyBZIGltcGxlbWVudHMgWiB7fScpXG4gICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggZXh0ZW5kcyBZIGltcGxlbWVudHMgWiB7IH0nKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ21lbWJlcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3N1cHBvcnRzIGVtcHR5IGRlY2xhcmF0aW9ucycsXG4gICAgICAgKCkgPT4geyBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyA7IH0nKS50by5lcXVhbCgnIGNsYXNzIFggeyB9Jyk7IH0pO1xuICAgIGl0KCdzdXBwb3J0cyBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyB4OiBudW1iZXI7IHk6IHN0cmluZzsgfScpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgY2xhc3MgWCB7IG51bSB4IDsgU3RyaW5nIHkgOyB9Jyk7XG4gICAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyB4OyB9JykudG8uZXF1YWwoJyBjbGFzcyBYIHsgdmFyIHggOyB9Jyk7XG4gICAgfSk7XG4gICAgaXQoJ3N1cHBvcnRzIGZpZWxkIGluaXRpYWxpemVycycsICgpID0+IHtcbiAgICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IHg6IG51bWJlciA9IDQyOyB9JykudG8uZXF1YWwoJyBjbGFzcyBYIHsgbnVtIHggPSA0MiA7IH0nKTtcbiAgICB9KTtcbiAgICAvLyBUT0RPKG1hcnRpbnByb2JzdCk6IFJlLWVuYWJsZSBvbmNlIEFuZ3VsYXIgaXMgbWlncmF0ZWQgdG8gVFMuXG4gICAgaXQuc2tpcCgnc3VwcG9ydHMgdmlzaWJpbGl0eSBtb2RpZmllcnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyBwcml2YXRlIF94OyB4OyB9JykudG8uZXF1YWwoJyBjbGFzcyBYIHsgdmFyIF94IDsgdmFyIHggOyB9Jyk7XG4gICAgICBleHBlY3RFcnJvbmVvdXNDb2RlKCdjbGFzcyBYIHsgcHJpdmF0ZSB4OyB9JylcbiAgICAgICAgICAudG8udGhyb3coJ3ByaXZhdGUgbWVtYmVycyBtdXN0IGJlIHByZWZpeGVkIHdpdGggXCJfXCInKTtcbiAgICAgIGV4cGVjdEVycm9uZW91c0NvZGUoJ2NsYXNzIFggeyBfeDsgfScpXG4gICAgICAgICAgLnRvLnRocm93KCdwdWJsaWMgbWVtYmVycyBtdXN0IG5vdCBiZSBwcmVmaXhlZCB3aXRoIFwiX1wiJyk7XG4gICAgfSk7XG4gICAgaXQuc2tpcCgnZG9lcyBub3Qgc3VwcG9ydCBwcm90ZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3RFcnJvbmVvdXNDb2RlKCdjbGFzcyBYIHsgcHJvdGVjdGVkIHg7IH0nKVxuICAgICAgICAgIC50by50aHJvdygncHJvdGVjdGVkIGRlY2xhcmF0aW9ucyBhcmUgdW5zdXBwb3J0ZWQnKTtcbiAgICB9KTtcbiAgICBpdCgnc3VwcG9ydHMgc3RhdGljIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IHN0YXRpYyB4OiBudW1iZXIgPSA0MjsgfScpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgY2xhc3MgWCB7IHN0YXRpYyBudW0geCA9IDQyIDsgfScpO1xuICAgIH0pO1xuICAgIGl0KCdzdXBwb3J0cyBtZXRob2RzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYIHsgeCgpIHsgcmV0dXJuIDQyOyB9IH0nKVxuICAgICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggeyB4ICggKSB7IHJldHVybiA0MiA7IH0gfScpO1xuICAgIH0pO1xuICAgIGl0KCdzdXBwb3J0cyBtZXRob2QgcmV0dXJuIHR5cGVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYIHsgeCgpOiBudW1iZXIgeyByZXR1cm4gNDI7IH0gfScpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgY2xhc3MgWCB7IG51bSB4ICggKSB7IHJldHVybiA0MiA7IH0gfScpO1xuICAgIH0pO1xuICAgIGl0KCdzdXBwb3J0cyBtZXRob2QgcGFyYW1zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYIHsgeChhLCBiKSB7IHJldHVybiA0MjsgfSB9JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBjbGFzcyBYIHsgeCAoIGEgLCBiICkgeyByZXR1cm4gNDIgOyB9IH0nKTtcbiAgICB9KTtcbiAgICBpdCgnc3VwcG9ydHMgbWV0aG9kIHJldHVybiB0eXBlcycsICgpID0+IHtcbiAgICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IHgoIGEgOiBudW1iZXIsIGIgOiBzdHJpbmcgKSB7IHJldHVybiA0MjsgfSB9JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBjbGFzcyBYIHsgeCAoIG51bSBhICwgU3RyaW5nIGIgKSB7IHJldHVybiA0MiA7IH0gfScpO1xuICAgIH0pO1xuICAgIGl0KCdzdXBwb3J0cyBnZXQgbWV0aG9kcycsICgpID0+IHtcbiAgICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IGdldCB5KCk6IG51bWJlciB7fSB9JykudG8uZXF1YWwoJyBjbGFzcyBYIHsgbnVtIGdldCB5IHsgfSB9Jyk7XG4gICAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyBzdGF0aWMgZ2V0IFkoKTogbnVtYmVyIHt9IH0nKVxuICAgICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggeyBzdGF0aWMgbnVtIGdldCBZIHsgfSB9Jyk7XG4gICAgfSk7XG4gICAgaXQoJ3N1cHBvcnRzIHNldCBtZXRob2RzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYIHsgc2V0IHkobjogbnVtYmVyKSB7fSB9JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBjbGFzcyBYIHsgc2V0IHkgKCBudW0gbiApIHsgfSB9Jyk7XG4gICAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggeyBzdGF0aWMgZ2V0IFkoKTogbnVtYmVyIHt9IH0nKVxuICAgICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFggeyBzdGF0aWMgbnVtIGdldCBZIHsgfSB9Jyk7XG4gICAgfSk7XG4gICAgaXQoJ3N1cHBvcnRzIGNvbnN0cnVjdG9ycycsICgpID0+IHtcbiAgICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCB7IGNvbnN0cnVjdG9yKCkgeyB9IH0nKS50by5lcXVhbCgnIGNsYXNzIFggeyBYICggKSB7IH0gfScpO1xuICAgIH0pO1xuICAgIGl0KCdzdXBwb3J0cyBwYXJhbWV0ZXIgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGV4cGVjdFRyYW5zbGF0ZShcbiAgICAgICAgICAnY2xhc3MgWCB7IGM6IG51bWJlcjsgY29uc3RydWN0b3IocHJpdmF0ZSBiYXI6IEIsIHB1YmxpYyBmb286IHN0cmluZyA9IFwiaGVsbG9cIiwgcHJvdGVjdGVkIGdvZ2dsZXM6IGJvb2xlYW4gPSB0cnVlKSB7fSB9JylcbiAgICAgICAgICAudG8uZXF1YWwoXG4gICAgICAgICAgICAgICcgY2xhc3MgWCB7IEIgYmFyIDsgU3RyaW5nIGZvbyA7IGJvb2wgZ29nZ2xlcyA7IG51bSBjIDsgWCAoIHRoaXMgLiBiYXIgLCBbIHRoaXMgLiBmb28gPSBcXFwiaGVsbG9cXFwiICwgdGhpcyAuIGdvZ2dsZXMgPSB0cnVlIF0gKSB7IH0gfScpO1xuICAgICAgZXhwZWN0VHJhbnNsYXRlKFxuICAgICAgICAgICdAQ09OU1QgY2xhc3MgWCB7IGNvbnN0cnVjdG9yKHB1YmxpYyBmb286IHN0cmluZywgYjogbnVtYmVyLCBwcm90ZWN0ZWQgbWFyYmxlczogYm9vbGVhbiA9IHRydWUpIHt9IH0nKVxuICAgICAgICAgIC50by5lcXVhbChcbiAgICAgICAgICAgICAgJyBjbGFzcyBYIHsgZmluYWwgU3RyaW5nIGZvbyA7IGZpbmFsIGJvb2wgbWFyYmxlcyA7IGNvbnN0IFggKCB0aGlzIC4gZm9vICwgbnVtIGIgLCBbIHRoaXMgLiBtYXJibGVzID0gdHJ1ZSBdICkgOyB9Jyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdpbnRlcmZhY2VzJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHRyYW5zbGF0ZSBpbnRlcmZhY2VzJyxcbiAgICAgKCkgPT4geyBleHBlY3RUcmFuc2xhdGUoJ2ludGVyZmFjZSBYIHt9JykudG8uZXF1YWwoJyBhYnN0cmFjdCBjbGFzcyBYIHsgfScpOyB9KTtcbiAgaXQoJ3Nob3VsZCBzdXBwb3J0IGV4dGVuZHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdpbnRlcmZhY2UgWCBleHRlbmRzIFksIFoge30nKS50by5lcXVhbCgnIGFic3RyYWN0IGNsYXNzIFggZXh0ZW5kcyBZICwgWiB7IH0nKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc3VwcG9ydCBpbXBsZW1lbnRzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCBpbXBsZW1lbnRzIFksIFoge30nKS50by5lcXVhbCgnIGNsYXNzIFggaW1wbGVtZW50cyBZICwgWiB7IH0nKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc3VwcG9ydCBpbXBsZW1lbnRzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWCBleHRlbmRzIFkgaW1wbGVtZW50cyBaIHt9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgY2xhc3MgWCBleHRlbmRzIFkgaW1wbGVtZW50cyBaIHsgfScpO1xuICB9KTtcbiAgaXQoJ3N1cHBvcnRzIGFic3RyYWN0IG1ldGhvZHMnLFxuICAgICAoKSA9PiB7IGV4cGVjdFRyYW5zbGF0ZSgnaW50ZXJmYWNlIFggeyB4KCk7IH0nKS50by5lcXVhbCgnIGFic3RyYWN0IGNsYXNzIFggeyB4ICggKSA7IH0nKTsgfSk7XG4gIGl0KCdzdXBwb3J0cyBpbnRlcmZhY2UgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2ludGVyZmFjZSBYIHsgeDogc3RyaW5nOyB5OyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgYWJzdHJhY3QgY2xhc3MgWCB7IFN0cmluZyB4IDsgdmFyIHkgOyB9Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzaW5nbGUgY2FsbCBzaWduYXR1cmUgaW50ZXJmYWNlcycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBzdXBwb3J0IGRlY2xhcmF0aW9uJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnaW50ZXJmYWNlIEYgeyAobjogbnVtYmVyKTogYm9vbGVhbjsgfScpXG4gICAgICAgIC50by5lcXVhbCgnIHR5cGVkZWYgYm9vbCBGICggbnVtIG4gKSA7Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgZ2VuZXJpY3MnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdpbnRlcmZhY2UgRjxBLCBCPiB7IChhOiBBKTogQjsgfScpXG4gICAgICAgIC50by5lcXVhbCgnIHR5cGVkZWYgQiBGIDwgQSAsIEIgPiAoIEEgYSApIDsnKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2VudW1zJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgYmFzaWMgZW51bSBkZWNsYXJhdGlvbicsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2VudW0gQ29sb3IgeyBSZWQsIEdyZWVuLCBCbHVlIH0nKVxuICAgICAgICAudG8uZXF1YWwoJyBlbnVtIENvbG9yIHsgUmVkICwgR3JlZW4gLCBCbHVlIH0nKTtcbiAgfSk7XG4gIGl0KCdkb2VzIG5vdCBzdXBwb3J0IGVtcHR5IGVudW0nLFxuICAgICAoKSA9PiB7IGV4cGVjdEVycm9uZW91c0NvZGUoJ2VudW0gRW1wdHkgeyB9JykudG8udGhyb3coJ2VtcHR5IGVudW1zIGFyZSBub3Qgc3VwcG9ydGVkJyk7IH0pO1xuICBpdCgnZG9lcyBub3Qgc3VwcG9ydCBlbnVtIHdpdGggaW5pdGlhbGl6ZXInLCAoKSA9PiB7XG4gICAgZXhwZWN0RXJyb25lb3VzQ29kZSgnZW51bSBDb2xvciB7IFJlZCA9IDEsIEdyZWVuLCBCbHVlID0gNCB9JylcbiAgICAgICAgLnRvLnRocm93KCdlbnVtIGluaXRpYWxpemVycyBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBzdXBwb3J0IHN3aXRjaCBvdmVyIGVudW0nLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdzd2l0Y2goYykgeyBjYXNlIENvbG9yLlJlZDogYnJlYWs7IGRlZmF1bHQ6IGJyZWFrOyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgc3dpdGNoICggYyApIHsgY2FzZSBDb2xvciAuIFJlZCA6IGJyZWFrIDsgZGVmYXVsdCA6IGJyZWFrIDsgfScpO1xuICB9KTtcbiAgaXQoJ2RvZXMgbm90IHN1cHBvcnQgY29uc3QgZW51bScsICgpID0+IHtcbiAgICBleHBlY3RFcnJvbmVvdXNDb2RlKCdjb25zdCBlbnVtIENvbG9yIHsgUmVkIH0nKS50by50aHJvdygnY29uc3QgZW51bXMgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==