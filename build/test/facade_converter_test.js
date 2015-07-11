/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
var chai = require('chai');
var traceurRuntimeDeclarations = "\n    interface Iterable<T> {}\n    interface Symbol {}\n    interface Map<K, V> {\n      get(key: K): V;\n      has(key: K): boolean;\n      set(key: K, value: V): Map<K, V>;\n      size: number;\n      delete(key: K): boolean;\n    }\n    declare var Map: {\n      new<K, V>(): Map<any, any>;\n      prototype: Map<any, any>;\n    };\n    declare var Symbol;\n    ";
function getSources(str) {
    var srcs = {
        'angular2/traceur-runtime.d.ts': traceurRuntimeDeclarations,
        'angular2/src/di/forward_ref.d.ts': "\n        export declare function forwardRef<T>(x: T): T;",
        'angular2/src/facade/async.d.ts': "\n        export declare var Promise = (<any>global).Promise;\n        export declare class Observable {};",
        'angular2/src/facade/collection.d.ts': "\n        export declare var Map: typeof Map;",
        'angular2/src/facade/lang.d.ts': "\n        interface List<T> extends Array<T> {}\n        export declare function CONST_EXPR<T>(x: T): T;",
        'other/file.ts': "\n        export class X {\n          map(x: number): string { return String(x); }\n          static get(m: any, k: string): number { return m[k]; }\n        }\n        export declare var Promise = (<any>global).Promise;"
    };
    srcs['main.ts'] = str;
    return srcs;
}
var COMPILE_OPTS = {
    translateBuiltins: true,
    failFast: true
};
function expectWithTypes(str) {
    return test_support_1.expectTranslate(getSources(str), COMPILE_OPTS);
}
function expectErroneousWithType(str) {
    return chai.expect(function () { return test_support_1.translateSource(getSources(str), COMPILE_OPTS); });
}
describe('type based translation', function () {
    describe('Dart type substitution', function () {
        it('finds registered substitutions', function () {
            expectWithTypes('import {Promise, Observable} from "angular2/src/facade/async"; var p: Promise<Date>;')
                .to.equal(' import "package:angular2/src/facade/async.dart" show Future , Stream ; Future < DateTime > p ;');
            expectWithTypes('import {Promise} from "angular2/src/facade/async"; x instanceof Promise;')
                .to.equal(' import "package:angular2/src/facade/async.dart" show Future ; x is Future ;');
            expectWithTypes('var n: Node;').to.equal(' dynamic n ;');
        });
        it('allows undeclared types', function () { expectWithTypes('var t: Thing;').to.equal(' Thing t ;'); });
        it('does not substitute matching name from different file', function () {
            expectWithTypes('import {Promise} from "other/file"; x instanceof Promise;')
                .to.equal(' import "package:other/file.dart" show Promise ; x is Promise ;');
        });
    });
    describe('collection façade', function () {
        it('translates array operations to dartisms', function () {
            expectWithTypes('var x: Array<number> = []; x.push(1); x.pop();')
                .to.equal(' List < num > x = [ ] ; x . add ( 1 ) ; x . removeLast ( ) ;');
            expectWithTypes('var x: Array<number> = []; x.map((e) => e);')
                .to.equal(' List < num > x = [ ] ; x . map ( ( e ) => e ) . toList ( ) ;');
            expectWithTypes('var x: Array<number> = []; x.unshift(1, 2, 3); x.shift();')
                .to.equal(' List < num > x = [ ] ; ( x .. insertAll ' +
                '( 0, [ 1 , 2 , 3 ]) ) . length ; x . removeAt ( 0 ) ;');
            expectWithTypes('var x: Array<number> = []; x.unshift(1);')
                .to.equal(' List < num > x = [ ] ; ( x .. insert ( 0, 1 ) ) . length ;');
            expectWithTypes('var x: Array<number> = []; x.concat([1], x);')
                .to.equal(' List < num > x = [ ] ; new List . from ( x ) .. addAll ( [ 1 ] ) .. addAll ( x ) ;');
        });
        it('translates map operations to dartisms', function () {
            expectWithTypes('var x = new Map<string, string>(); x.set("k", "v");')
                .to.equal(' var x = new Map < String , String > ( ) ; x [ "k" ] = "v" ;');
            expectWithTypes('var x = new Map<string, string>(); x.get("k");')
                .to.equal(' var x = new Map < String , String > ( ) ; x [ "k" ] ;');
            expectWithTypes('var x = new Map<string, string>(); x.has("k");')
                .to.equal(' var x = new Map < String , String > ( ) ; x . containsKey ( "k" ) ;');
            expectWithTypes('var x = new Map<string, string>(); x.delete("k");')
                .to.equal(' var x = new Map < String , String > ( ) ; ' +
                '( x . containsKey ( "k" ) && ( x . remove ( "k" ) != null || true ) ) ;');
        });
        it('translates map properties to dartisms', function () {
            expectWithTypes('var x = new Map<string, string>(); x.size;')
                .to.equal(' var x = new Map < String , String > ( ) ; x . length ;');
        });
    });
    describe('regexp', function () {
        expectWithTypes('var x = /a/g; x.test("a");')
            .to.equal(' var x = new RegExp ( r\'a\' ) ; x . hasMatch ( "a" ) ;');
    });
    describe('builtin functions', function () {
        it('translates CONST_EXPR(...) to const (...)', function () {
            expectWithTypes('import {CONST_EXPR} from "angular2/src/facade/lang";\n' +
                'const x = CONST_EXPR([]);')
                .to.equal(' const x = const [ ] ;');
            expectWithTypes('import {CONST_EXPR} from "angular2/src/facade/lang";\n' +
                'class Person {}' +
                'const x = CONST_EXPR(new Person());')
                .to.equal(' class Person { } const x = const Person ( ) ;');
            expectWithTypes('import {CONST_EXPR} from "angular2/src/facade/lang";\n' +
                'const x = CONST_EXPR({"one":1});')
                .to.equal(' const x = const { "one" : 1 } ;');
            expectWithTypes('import {CONST_EXPR} from "angular2/src/facade/lang";\n' +
                'import {Map} from "angular2/src/facade/collection";\n' +
                'const x = CONST_EXPR(new Map());')
                .to.equal(' import "package:angular2/src/facade/collection.dart" show Map ;' +
                ' const x = const { } ;');
            expectWithTypes('import {CONST_EXPR} from "angular2/src/facade/lang";\n' +
                'import {Map} from "angular2/src/facade/collection";\n' +
                'const x = CONST_EXPR(new Map<number, string>());')
                .to.equal(' import "package:angular2/src/facade/collection.dart" show Map ;' +
                ' const x = const < num , String > { } ;');
        });
        it('translates forwardRef(() => T) to T', function () {
            expectWithTypes('import {forwardRef} from "angular2/src/di/forward_ref";\n' +
                'var SomeType = 1;\n' +
                'var x = forwardRef(() => SomeType);')
                .to.equal(' var SomeType = 1 ; var x = SomeType ;');
            expectErroneousWithType('import {forwardRef} from "angular2/src/di/forward_ref";\n' +
                'forwardRef(1)')
                .to.throw(/only arrow functions/);
        });
    });
    it('translates array façades', function () {
        expectWithTypes('var x = []; Array.isArray(x);').to.equal(' var x = [ ] ; ( ( x ) is List ) ;');
    });
    describe('error detection', function () {
        describe('Array', function () {
            it('.concat() should report an error if any arg is not an Array', function () {
                expectErroneousWithType('var x: Array<number> = []; x.concat(1);')
                    .to.throw('Array.concat only takes Array arguments');
            });
        });
        it('for untyped symbols matching special cased fns', function () {
            expectErroneousWithType('forwardRef(1)').to.throw(/Untyped property access to "forwardRef"/);
        });
        it('for untyped symbols matching special cased methods', function () {
            expectErroneousWithType('x.push(1)').to.throw(/Untyped property access to "push"/);
        });
        it('allows unrelated methods', function () {
            expectWithTypes('import {X} from "other/file";\n' +
                'new X().map(1)')
                .to.equal(' import "package:other/file.dart" show X ; new X ( ) . map ( 1 ) ;');
            expectWithTypes('import {X} from "other/file";\n' +
                'X.get({"a": 1}, "a");')
                .to.equal(' import "package:other/file.dart" show X ; X . get ( { "a" : 1 } , "a" ) ;');
            expectWithTypes('["a", "b"].map((x) => x);')
                .to.equal(' [ "a" , "b" ] . map ( ( x ) => x ) . toList ( ) ;');
        });
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZmFjYWRlX2NvbnZlcnRlcl90ZXN0LnRzIl0sIm5hbWVzIjpbImdldFNvdXJjZXMiLCJleHBlY3RXaXRoVHlwZXMiLCJleHBlY3RFcnJvbmVvdXNXaXRoVHlwZSJdLCJtYXBwaW5ncyI6IkFBQUEsbURBQW1EO0FBQ25ELDZCQUFnRixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2pHLElBQU8sSUFBSSxXQUFXLE1BQU0sQ0FBQyxDQUFDO0FBRTlCLElBQUksMEJBQTBCLEdBQUcsZ1hBZTVCLENBQUM7QUFHTixvQkFBb0IsR0FBVztJQUM3QkEsSUFBSUEsSUFBSUEsR0FBMEJBO1FBQ2hDQSwrQkFBK0JBLEVBQUVBLDBCQUEwQkE7UUFDM0RBLGtDQUFrQ0EsRUFBRUEsMkRBQ2dCQTtRQUNwREEsZ0NBQWdDQSxFQUFFQSw0R0FFTUE7UUFDeENBLHFDQUFxQ0EsRUFBRUEsK0NBQ0NBO1FBQ3hDQSwrQkFBK0JBLEVBQUVBLDBHQUVtQkE7UUFDcERBLGVBQWVBLEVBQUVBLDhOQUt1Q0E7S0FDekRBLENBQUNBO0lBQ0ZBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO0lBQ3RCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtBQUNkQSxDQUFDQTtBQUVELElBQU0sWUFBWSxHQUFHO0lBQ25CLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFDO0FBRUYseUJBQXlCLEdBQVc7SUFDbENDLE1BQU1BLENBQUNBLDhCQUFlQSxDQUFDQSxVQUFVQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxZQUFZQSxDQUFDQSxDQUFDQTtBQUN4REEsQ0FBQ0E7QUFFRCxpQ0FBaUMsR0FBVztJQUMxQ0MsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsY0FBTUEsT0FBQUEsOEJBQWVBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLFlBQVlBLENBQUNBLEVBQTlDQSxDQUE4Q0EsQ0FBQ0EsQ0FBQ0E7QUFDM0VBLENBQUNBO0FBRUQsUUFBUSxDQUFDLHdCQUF3QixFQUFFO0lBQ2pDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtRQUNqQyxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsZUFBZSxDQUNYLHNGQUFzRixDQUFDO2lCQUN0RixFQUFFLENBQUMsS0FBSyxDQUNMLGlHQUFpRyxDQUFDLENBQUM7WUFDM0csZUFBZSxDQUFDLDBFQUEwRSxDQUFDO2lCQUN0RixFQUFFLENBQUMsS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7WUFDOUYsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQ3pCLGNBQVEsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RSxFQUFFLENBQUMsdURBQXVELEVBQUU7WUFDMUQsZUFBZSxDQUFDLDJEQUEyRCxDQUFDO2lCQUN2RSxFQUFFLENBQUMsS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsZUFBZSxDQUFDLGdEQUFnRCxDQUFDO2lCQUM1RCxFQUFFLENBQUMsS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7WUFDOUUsZUFBZSxDQUFDLDZDQUE2QyxDQUFDO2lCQUN6RCxFQUFFLENBQUMsS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7WUFDL0UsZUFBZSxDQUFDLDJEQUEyRCxDQUFDO2lCQUN2RSxFQUFFLENBQUMsS0FBSyxDQUFDLDJDQUEyQztnQkFDM0MsdURBQXVELENBQUMsQ0FBQztZQUN2RSxlQUFlLENBQUMsMENBQTBDLENBQUM7aUJBQ3RELEVBQUUsQ0FBQyxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztZQUM3RSxlQUFlLENBQUMsOENBQThDLENBQUM7aUJBQzFELEVBQUUsQ0FBQyxLQUFLLENBQ0wscUZBQXFGLENBQUMsQ0FBQztRQUNqRyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxlQUFlLENBQUMscURBQXFELENBQUM7aUJBQ2pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztZQUM5RSxlQUFlLENBQUMsZ0RBQWdELENBQUM7aUJBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztZQUN4RSxlQUFlLENBQUMsZ0RBQWdELENBQUM7aUJBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztZQUN0RixlQUFlLENBQUMsbURBQW1ELENBQUM7aUJBQy9ELEVBQUUsQ0FBQyxLQUFLLENBQUMsNkNBQTZDO2dCQUM3Qyx5RUFBeUUsQ0FBQyxDQUFDO1FBQzNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLGVBQWUsQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDeEQsRUFBRSxDQUFDLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQzthQUN4QyxFQUFFLENBQUMsS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLGVBQWUsQ0FBQyx3REFBd0Q7Z0JBQ3hELDJCQUEyQixDQUFDO2lCQUN2QyxFQUFFLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDeEMsZUFBZSxDQUFDLHdEQUF3RDtnQkFDeEQsaUJBQWlCO2dCQUNqQixxQ0FBcUMsQ0FBQztpQkFDakQsRUFBRSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBQ2hFLGVBQWUsQ0FBQyx3REFBd0Q7Z0JBQ3hELGtDQUFrQyxDQUFDO2lCQUM5QyxFQUFFLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDbEQsZUFBZSxDQUFDLHdEQUF3RDtnQkFDeEQsdURBQXVEO2dCQUN2RCxrQ0FBa0MsQ0FBQztpQkFDOUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrRUFBa0U7Z0JBQ2xFLHdCQUF3QixDQUFDLENBQUM7WUFDeEMsZUFBZSxDQUFDLHdEQUF3RDtnQkFDeEQsdURBQXVEO2dCQUN2RCxrREFBa0QsQ0FBQztpQkFDOUQsRUFBRSxDQUFDLEtBQUssQ0FBQyxrRUFBa0U7Z0JBQ2xFLHlDQUF5QyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsZUFBZSxDQUFDLDJEQUEyRDtnQkFDM0QscUJBQXFCO2dCQUNyQixxQ0FBcUMsQ0FBQztpQkFDakQsRUFBRSxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3hELHVCQUF1QixDQUFDLDJEQUEyRDtnQkFDM0QsZUFBZSxDQUFDO2lCQUNuQyxFQUFFLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtRQUM3QixlQUFlLENBQUMsK0JBQStCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDbEcsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUNoQixFQUFFLENBQUMsNkRBQTZELEVBQUU7Z0JBQ2hFLHVCQUF1QixDQUFDLHlDQUF5QyxDQUFDO3FCQUM3RCxFQUFFLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDL0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzdCLGVBQWUsQ0FBQyxpQ0FBaUM7Z0JBQ2pDLGdCQUFnQixDQUFDO2lCQUM1QixFQUFFLENBQUMsS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7WUFDcEYsZUFBZSxDQUFDLGlDQUFpQztnQkFDakMsdUJBQXVCLENBQUM7aUJBQ25DLEVBQUUsQ0FBQyxLQUFLLENBQUMsNEVBQTRFLENBQUMsQ0FBQztZQUM1RixlQUFlLENBQUMsMkJBQTJCLENBQUM7aUJBQ3ZDLEVBQUUsQ0FBQyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9mYWNhZGVfY29udmVydGVyX3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tb2NoYS9tb2NoYS5kLnRzXCIvPlxuaW1wb3J0IHtwYXJzZUZpbGVzLCBleHBlY3RUcmFuc2xhdGUsIGV4cGVjdEVycm9uZW91c0NvZGUsIHRyYW5zbGF0ZVNvdXJjZX0gZnJvbSAnLi90ZXN0X3N1cHBvcnQnO1xuaW1wb3J0IGNoYWkgPSByZXF1aXJlKCdjaGFpJyk7XG5cbnZhciB0cmFjZXVyUnVudGltZURlY2xhcmF0aW9ucyA9IGBcbiAgICBpbnRlcmZhY2UgSXRlcmFibGU8VD4ge31cbiAgICBpbnRlcmZhY2UgU3ltYm9sIHt9XG4gICAgaW50ZXJmYWNlIE1hcDxLLCBWPiB7XG4gICAgICBnZXQoa2V5OiBLKTogVjtcbiAgICAgIGhhcyhrZXk6IEspOiBib29sZWFuO1xuICAgICAgc2V0KGtleTogSywgdmFsdWU6IFYpOiBNYXA8SywgVj47XG4gICAgICBzaXplOiBudW1iZXI7XG4gICAgICBkZWxldGUoa2V5OiBLKTogYm9vbGVhbjtcbiAgICB9XG4gICAgZGVjbGFyZSB2YXIgTWFwOiB7XG4gICAgICBuZXc8SywgVj4oKTogTWFwPGFueSwgYW55PjtcbiAgICAgIHByb3RvdHlwZTogTWFwPGFueSwgYW55PjtcbiAgICB9O1xuICAgIGRlY2xhcmUgdmFyIFN5bWJvbDtcbiAgICBgO1xuXG5cbmZ1bmN0aW9uIGdldFNvdXJjZXMoc3RyOiBzdHJpbmcpOiB7W2s6IHN0cmluZ106IHN0cmluZ30ge1xuICB2YXIgc3Jjczoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgICdhbmd1bGFyMi90cmFjZXVyLXJ1bnRpbWUuZC50cyc6IHRyYWNldXJSdW50aW1lRGVjbGFyYXRpb25zLFxuICAgICdhbmd1bGFyMi9zcmMvZGkvZm9yd2FyZF9yZWYuZC50cyc6IGBcbiAgICAgICAgZXhwb3J0IGRlY2xhcmUgZnVuY3Rpb24gZm9yd2FyZFJlZjxUPih4OiBUKTogVDtgLFxuICAgICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jLmQudHMnOiBgXG4gICAgICAgIGV4cG9ydCBkZWNsYXJlIHZhciBQcm9taXNlID0gKDxhbnk+Z2xvYmFsKS5Qcm9taXNlO1xuICAgICAgICBleHBvcnQgZGVjbGFyZSBjbGFzcyBPYnNlcnZhYmxlIHt9O2AsXG4gICAgJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbi5kLnRzJzogYFxuICAgICAgICBleHBvcnQgZGVjbGFyZSB2YXIgTWFwOiB0eXBlb2YgTWFwO2AsXG4gICAgJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZy5kLnRzJzogYFxuICAgICAgICBpbnRlcmZhY2UgTGlzdDxUPiBleHRlbmRzIEFycmF5PFQ+IHt9XG4gICAgICAgIGV4cG9ydCBkZWNsYXJlIGZ1bmN0aW9uIENPTlNUX0VYUFI8VD4oeDogVCk6IFQ7YCxcbiAgICAnb3RoZXIvZmlsZS50cyc6IGBcbiAgICAgICAgZXhwb3J0IGNsYXNzIFgge1xuICAgICAgICAgIG1hcCh4OiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gU3RyaW5nKHgpOyB9XG4gICAgICAgICAgc3RhdGljIGdldChtOiBhbnksIGs6IHN0cmluZyk6IG51bWJlciB7IHJldHVybiBtW2tdOyB9XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0IGRlY2xhcmUgdmFyIFByb21pc2UgPSAoPGFueT5nbG9iYWwpLlByb21pc2U7YCxcbiAgfTtcbiAgc3Jjc1snbWFpbi50cyddID0gc3RyO1xuICByZXR1cm4gc3Jjcztcbn1cblxuY29uc3QgQ09NUElMRV9PUFRTID0ge1xuICB0cmFuc2xhdGVCdWlsdGluczogdHJ1ZSxcbiAgZmFpbEZhc3Q6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGV4cGVjdFdpdGhUeXBlcyhzdHI6IHN0cmluZykge1xuICByZXR1cm4gZXhwZWN0VHJhbnNsYXRlKGdldFNvdXJjZXMoc3RyKSwgQ09NUElMRV9PUFRTKTtcbn1cblxuZnVuY3Rpb24gZXhwZWN0RXJyb25lb3VzV2l0aFR5cGUoc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGNoYWkuZXhwZWN0KCgpID0+IHRyYW5zbGF0ZVNvdXJjZShnZXRTb3VyY2VzKHN0ciksIENPTVBJTEVfT1BUUykpO1xufVxuXG5kZXNjcmliZSgndHlwZSBiYXNlZCB0cmFuc2xhdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0RhcnQgdHlwZSBzdWJzdGl0dXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ2ZpbmRzIHJlZ2lzdGVyZWQgc3Vic3RpdHV0aW9ucycsICgpID0+IHtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcyhcbiAgICAgICAgICAnaW1wb3J0IHtQcm9taXNlLCBPYnNlcnZhYmxlfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luY1wiOyB2YXIgcDogUHJvbWlzZTxEYXRlPjsnKVxuICAgICAgICAgIC50by5lcXVhbChcbiAgICAgICAgICAgICAgJyBpbXBvcnQgXCJwYWNrYWdlOmFuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMuZGFydFwiIHNob3cgRnV0dXJlICwgU3RyZWFtIDsgRnV0dXJlIDwgRGF0ZVRpbWUgPiBwIDsnKTtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcygnaW1wb3J0IHtQcm9taXNlfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luY1wiOyB4IGluc3RhbmNlb2YgUHJvbWlzZTsnKVxuICAgICAgICAgIC50by5lcXVhbCgnIGltcG9ydCBcInBhY2thZ2U6YW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYy5kYXJ0XCIgc2hvdyBGdXR1cmUgOyB4IGlzIEZ1dHVyZSA7Jyk7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ3ZhciBuOiBOb2RlOycpLnRvLmVxdWFsKCcgZHluYW1pYyBuIDsnKTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3MgdW5kZWNsYXJlZCB0eXBlcycsXG4gICAgICAgKCkgPT4geyBleHBlY3RXaXRoVHlwZXMoJ3ZhciB0OiBUaGluZzsnKS50by5lcXVhbCgnIFRoaW5nIHQgOycpOyB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCBzdWJzdGl0dXRlIG1hdGNoaW5nIG5hbWUgZnJvbSBkaWZmZXJlbnQgZmlsZScsICgpID0+IHtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcygnaW1wb3J0IHtQcm9taXNlfSBmcm9tIFwib3RoZXIvZmlsZVwiOyB4IGluc3RhbmNlb2YgUHJvbWlzZTsnKVxuICAgICAgICAgIC50by5lcXVhbCgnIGltcG9ydCBcInBhY2thZ2U6b3RoZXIvZmlsZS5kYXJ0XCIgc2hvdyBQcm9taXNlIDsgeCBpcyBQcm9taXNlIDsnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvbGxlY3Rpb24gZmHDp2FkZScsICgpID0+IHtcbiAgICBpdCgndHJhbnNsYXRlcyBhcnJheSBvcGVyYXRpb25zIHRvIGRhcnRpc21zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCd2YXIgeDogQXJyYXk8bnVtYmVyPiA9IFtdOyB4LnB1c2goMSk7IHgucG9wKCk7JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBMaXN0IDwgbnVtID4geCA9IFsgXSA7IHggLiBhZGQgKCAxICkgOyB4IC4gcmVtb3ZlTGFzdCAoICkgOycpO1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCd2YXIgeDogQXJyYXk8bnVtYmVyPiA9IFtdOyB4Lm1hcCgoZSkgPT4gZSk7JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBMaXN0IDwgbnVtID4geCA9IFsgXSA7IHggLiBtYXAgKCAoIGUgKSA9PiBlICkgLiB0b0xpc3QgKCApIDsnKTtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcygndmFyIHg6IEFycmF5PG51bWJlcj4gPSBbXTsgeC51bnNoaWZ0KDEsIDIsIDMpOyB4LnNoaWZ0KCk7JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBMaXN0IDwgbnVtID4geCA9IFsgXSA7ICggeCAuLiBpbnNlcnRBbGwgJyArXG4gICAgICAgICAgICAgICAgICAgICcoIDAsIFsgMSAsIDIgLCAzIF0pICkgLiBsZW5ndGggOyB4IC4gcmVtb3ZlQXQgKCAwICkgOycpO1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCd2YXIgeDogQXJyYXk8bnVtYmVyPiA9IFtdOyB4LnVuc2hpZnQoMSk7JylcbiAgICAgICAgICAudG8uZXF1YWwoJyBMaXN0IDwgbnVtID4geCA9IFsgXSA7ICggeCAuLiBpbnNlcnQgKCAwLCAxICkgKSAuIGxlbmd0aCA7Jyk7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ3ZhciB4OiBBcnJheTxudW1iZXI+ID0gW107IHguY29uY2F0KFsxXSwgeCk7JylcbiAgICAgICAgICAudG8uZXF1YWwoXG4gICAgICAgICAgICAgICcgTGlzdCA8IG51bSA+IHggPSBbIF0gOyBuZXcgTGlzdCAuIGZyb20gKCB4ICkgLi4gYWRkQWxsICggWyAxIF0gKSAuLiBhZGRBbGwgKCB4ICkgOycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3RyYW5zbGF0ZXMgbWFwIG9wZXJhdGlvbnMgdG8gZGFydGlzbXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ3ZhciB4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgeC5zZXQoXCJrXCIsIFwidlwiKTsnKVxuICAgICAgICAgIC50by5lcXVhbCgnIHZhciB4ID0gbmV3IE1hcCA8IFN0cmluZyAsIFN0cmluZyA+ICggKSA7IHggWyBcImtcIiBdID0gXCJ2XCIgOycpO1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCd2YXIgeCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7IHguZ2V0KFwia1wiKTsnKVxuICAgICAgICAgIC50by5lcXVhbCgnIHZhciB4ID0gbmV3IE1hcCA8IFN0cmluZyAsIFN0cmluZyA+ICggKSA7IHggWyBcImtcIiBdIDsnKTtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcygndmFyIHggPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpOyB4LmhhcyhcImtcIik7JylcbiAgICAgICAgICAudG8uZXF1YWwoJyB2YXIgeCA9IG5ldyBNYXAgPCBTdHJpbmcgLCBTdHJpbmcgPiAoICkgOyB4IC4gY29udGFpbnNLZXkgKCBcImtcIiApIDsnKTtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcygndmFyIHggPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpOyB4LmRlbGV0ZShcImtcIik7JylcbiAgICAgICAgICAudG8uZXF1YWwoJyB2YXIgeCA9IG5ldyBNYXAgPCBTdHJpbmcgLCBTdHJpbmcgPiAoICkgOyAnICtcbiAgICAgICAgICAgICAgICAgICAgJyggeCAuIGNvbnRhaW5zS2V5ICggXCJrXCIgKSAmJiAoIHggLiByZW1vdmUgKCBcImtcIiApICE9IG51bGwgfHwgdHJ1ZSApICkgOycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3RyYW5zbGF0ZXMgbWFwIHByb3BlcnRpZXMgdG8gZGFydGlzbXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ3ZhciB4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgeC5zaXplOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgdmFyIHggPSBuZXcgTWFwIDwgU3RyaW5nICwgU3RyaW5nID4gKCApIDsgeCAuIGxlbmd0aCA7Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyZWdleHAnLCAoKSA9PiB7XG4gICAgZXhwZWN0V2l0aFR5cGVzKCd2YXIgeCA9IC9hL2c7IHgudGVzdChcImFcIik7JylcbiAgICAgICAgLnRvLmVxdWFsKCcgdmFyIHggPSBuZXcgUmVnRXhwICggclxcJ2FcXCcgKSA7IHggLiBoYXNNYXRjaCAoIFwiYVwiICkgOycpO1xuICB9KTtcblxuICBkZXNjcmliZSgnYnVpbHRpbiBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3RyYW5zbGF0ZXMgQ09OU1RfRVhQUiguLi4pIHRvIGNvbnN0ICguLi4pJywgKCkgPT4ge1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCdpbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnY29uc3QgeCA9IENPTlNUX0VYUFIoW10pOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgY29uc3QgeCA9IGNvbnN0IFsgXSA7Jyk7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ2ltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyBQZXJzb24ge30nICtcbiAgICAgICAgICAgICAgICAgICAgICAnY29uc3QgeCA9IENPTlNUX0VYUFIobmV3IFBlcnNvbigpKTsnKVxuICAgICAgICAgIC50by5lcXVhbCgnIGNsYXNzIFBlcnNvbiB7IH0gY29uc3QgeCA9IGNvbnN0IFBlcnNvbiAoICkgOycpO1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCdpbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnY29uc3QgeCA9IENPTlNUX0VYUFIoe1wib25lXCI6MX0pOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgY29uc3QgeCA9IGNvbnN0IHsgXCJvbmVcIiA6IDEgfSA7Jyk7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ2ltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICdpbXBvcnQge01hcH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvblwiO1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICdjb25zdCB4ID0gQ09OU1RfRVhQUihuZXcgTWFwKCkpOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgaW1wb3J0IFwicGFja2FnZTphbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24uZGFydFwiIHNob3cgTWFwIDsnICtcbiAgICAgICAgICAgICAgICAgICAgJyBjb25zdCB4ID0gY29uc3QgeyB9IDsnKTtcbiAgICAgIGV4cGVjdFdpdGhUeXBlcygnaW1wb3J0IHtDT05TVF9FWFBSfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2ltcG9ydCB7TWFwfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uXCI7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2NvbnN0IHggPSBDT05TVF9FWFBSKG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KCkpOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgaW1wb3J0IFwicGFja2FnZTphbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24uZGFydFwiIHNob3cgTWFwIDsnICtcbiAgICAgICAgICAgICAgICAgICAgJyBjb25zdCB4ID0gY29uc3QgPCBudW0gLCBTdHJpbmcgPiB7IH0gOycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3RyYW5zbGF0ZXMgZm9yd2FyZFJlZigoKSA9PiBUKSB0byBUJywgKCkgPT4ge1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCdpbXBvcnQge2ZvcndhcmRSZWZ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZGkvZm9yd2FyZF9yZWZcIjtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAndmFyIFNvbWVUeXBlID0gMTtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAndmFyIHggPSBmb3J3YXJkUmVmKCgpID0+IFNvbWVUeXBlKTsnKVxuICAgICAgICAgIC50by5lcXVhbCgnIHZhciBTb21lVHlwZSA9IDEgOyB2YXIgeCA9IFNvbWVUeXBlIDsnKTtcbiAgICAgIGV4cGVjdEVycm9uZW91c1dpdGhUeXBlKCdpbXBvcnQge2ZvcndhcmRSZWZ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZGkvZm9yd2FyZF9yZWZcIjtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmb3J3YXJkUmVmKDEpJylcbiAgICAgICAgICAudG8udGhyb3coL29ubHkgYXJyb3cgZnVuY3Rpb25zLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCd0cmFuc2xhdGVzIGFycmF5IGZhw6dhZGVzJywgKCkgPT4ge1xuICAgIGV4cGVjdFdpdGhUeXBlcygndmFyIHggPSBbXTsgQXJyYXkuaXNBcnJheSh4KTsnKS50by5lcXVhbCgnIHZhciB4ID0gWyBdIDsgKCAoIHggKSBpcyBMaXN0ICkgOycpO1xuICB9KTtcblxuICBkZXNjcmliZSgnZXJyb3IgZGV0ZWN0aW9uJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdBcnJheScsICgpID0+IHtcbiAgICAgIGl0KCcuY29uY2F0KCkgc2hvdWxkIHJlcG9ydCBhbiBlcnJvciBpZiBhbnkgYXJnIGlzIG5vdCBhbiBBcnJheScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0RXJyb25lb3VzV2l0aFR5cGUoJ3ZhciB4OiBBcnJheTxudW1iZXI+ID0gW107IHguY29uY2F0KDEpOycpXG4gICAgICAgICAgICAudG8udGhyb3coJ0FycmF5LmNvbmNhdCBvbmx5IHRha2VzIEFycmF5IGFyZ3VtZW50cycpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZm9yIHVudHlwZWQgc3ltYm9scyBtYXRjaGluZyBzcGVjaWFsIGNhc2VkIGZucycsICgpID0+IHtcbiAgICAgIGV4cGVjdEVycm9uZW91c1dpdGhUeXBlKCdmb3J3YXJkUmVmKDEpJykudG8udGhyb3coL1VudHlwZWQgcHJvcGVydHkgYWNjZXNzIHRvIFwiZm9yd2FyZFJlZlwiLyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZm9yIHVudHlwZWQgc3ltYm9scyBtYXRjaGluZyBzcGVjaWFsIGNhc2VkIG1ldGhvZHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3RFcnJvbmVvdXNXaXRoVHlwZSgneC5wdXNoKDEpJykudG8udGhyb3coL1VudHlwZWQgcHJvcGVydHkgYWNjZXNzIHRvIFwicHVzaFwiLyk7XG4gICAgfSk7XG5cbiAgICBpdCgnYWxsb3dzIHVucmVsYXRlZCBtZXRob2RzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCdpbXBvcnQge1h9IGZyb20gXCJvdGhlci9maWxlXCI7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ25ldyBYKCkubWFwKDEpJylcbiAgICAgICAgICAudG8uZXF1YWwoJyBpbXBvcnQgXCJwYWNrYWdlOm90aGVyL2ZpbGUuZGFydFwiIHNob3cgWCA7IG5ldyBYICggKSAuIG1hcCAoIDEgKSA7Jyk7XG4gICAgICBleHBlY3RXaXRoVHlwZXMoJ2ltcG9ydCB7WH0gZnJvbSBcIm90aGVyL2ZpbGVcIjtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnWC5nZXQoe1wiYVwiOiAxfSwgXCJhXCIpOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgaW1wb3J0IFwicGFja2FnZTpvdGhlci9maWxlLmRhcnRcIiBzaG93IFggOyBYIC4gZ2V0ICggeyBcImFcIiA6IDEgfSAsIFwiYVwiICkgOycpO1xuICAgICAgZXhwZWN0V2l0aFR5cGVzKCdbXCJhXCIsIFwiYlwiXS5tYXAoKHgpID0+IHgpOycpXG4gICAgICAgICAgLnRvLmVxdWFsKCcgWyBcImFcIiAsIFwiYlwiIF0gLiBtYXAgKCAoIHggKSA9PiB4ICkgLiB0b0xpc3QgKCApIDsnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==