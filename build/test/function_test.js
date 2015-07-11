/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
describe('functions', function () {
    it('supports declarations', function () { test_support_1.expectTranslate('function x() {}').to.equal(' x ( ) { }'); });
    it('supports param default values', function () {
        test_support_1.expectTranslate('function x(a = 42, b = 1) { return 42; }')
            .to.equal(' x ( [ a = 42 , b = 1 ] ) { return 42 ; }');
        test_support_1.expectTranslate('function x(p1, a = 42, b = 1, p2) { return 42; }')
            .to.equal(' x ( p1 , [ a = 42 , b = 1 , p2 ] ) { return 42 ; }');
    });
    it('translates optional parameters', function () {
        test_support_1.expectTranslate('function x(a?: number, b?: number) { return 42; }')
            .to.equal(' x ( [ num a , num b ] ) { return 42 ; }');
        test_support_1.expectTranslate('function x(p1, a?: number, b?: number, p2) { return 42; }')
            .to.equal(' x ( p1 , [ num a , num b , p2 ] ) { return 42 ; }');
    });
    it('supports empty returns', function () { test_support_1.expectTranslate('function x() { return; }').to.equal(' x ( ) { return ; }'); });
    it('supports named parameters', function () {
        test_support_1.expectTranslate('function x({a = "x", b}) { return a + b; }')
            .to.equal(' x ( { a : "x" , b } ) { return a + b ; }');
    });
    // TODO(martinprobst): Support types on named parameters.
    it.skip('fails for types on named parameters', function () {
        test_support_1.expectErroneousCode('function x({a}: number) { return a + b; }')
            .to.throw('types on named parameters are unsupported');
    });
    it('does not support var args', function () {
        test_support_1.expectErroneousCode('function x(...a: number) { return 42; }')
            .to.throw('rest parameters are unsupported');
    });
    it('does not support generic functions', function () {
        test_support_1.expectErroneousCode('function x<T>() { return 42; }')
            .to.throw('generic functions are unsupported');
    });
    it('translates function expressions', function () { test_support_1.expectTranslate('var a = function() {}').to.equal(' var a = ( ) { } ;'); });
    it('translates fat arrow operator', function () {
        test_support_1.expectTranslate('var a = () => {}').to.equal(' var a = ( ) { } ;');
        test_support_1.expectTranslate('var a = (): string => {}').to.equal(' var a = /* String */ ( ) { } ;');
        test_support_1.expectTranslate('var a = (p) => isBlank(p)').to.equal(' var a = ( p ) => isBlank ( p ) ;');
        test_support_1.expectTranslate('var a = (p = null) => isBlank(p)')
            .to.equal(' var a = ( [ p = null ] ) => isBlank ( p ) ;');
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZnVuY3Rpb25fdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtREFBbUQ7QUFDbkQsNkJBQW1ELGdCQUFnQixDQUFDLENBQUE7QUFFcEUsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixFQUFFLENBQUMsdUJBQXVCLEVBQUUsY0FBUSw4QkFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtRQUNsQyw4QkFBZSxDQUFDLDBDQUEwQyxDQUFDO2FBQ3RELEVBQUUsQ0FBQyxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUMzRCw4QkFBZSxDQUFDLGtEQUFrRCxDQUFDO2FBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNuQyw4QkFBZSxDQUFDLG1EQUFtRCxDQUFDO2FBQy9ELEVBQUUsQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUMxRCw4QkFBZSxDQUFDLDJEQUEyRCxDQUFDO2FBQ3ZFLEVBQUUsQ0FBQyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyx3QkFBd0IsRUFDeEIsY0FBUSw4QkFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0YsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1FBQzlCLDhCQUFlLENBQUMsNENBQTRDLENBQUM7YUFDeEQsRUFBRSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0gseURBQXlEO0lBQ3pELEVBQUUsQ0FBQyxJQUFJLENBQUMscUNBQXFDLEVBQUU7UUFDN0Msa0NBQW1CLENBQUMsMkNBQTJDLENBQUM7YUFDM0QsRUFBRSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1FBQzlCLGtDQUFtQixDQUFDLHlDQUF5QyxDQUFDO2FBQ3pELEVBQUUsQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtRQUN2QyxrQ0FBbUIsQ0FBQyxnQ0FBZ0MsQ0FBQzthQUNoRCxFQUFFLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsaUNBQWlDLEVBQ2pDLGNBQVEsOEJBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtRQUNsQyw4QkFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ25FLDhCQUFlLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDeEYsOEJBQWUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUMzRiw4QkFBZSxDQUFDLGtDQUFrQyxDQUFDO2FBQzlDLEVBQUUsQ0FBQyxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3QvZnVuY3Rpb25fdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21vY2hhL21vY2hhLmQudHNcIi8+XG5pbXBvcnQge2V4cGVjdFRyYW5zbGF0ZSwgZXhwZWN0RXJyb25lb3VzQ29kZX0gZnJvbSAnLi90ZXN0X3N1cHBvcnQnO1xuXG5kZXNjcmliZSgnZnVuY3Rpb25zJywgKCkgPT4ge1xuICBpdCgnc3VwcG9ydHMgZGVjbGFyYXRpb25zJywgKCkgPT4geyBleHBlY3RUcmFuc2xhdGUoJ2Z1bmN0aW9uIHgoKSB7fScpLnRvLmVxdWFsKCcgeCAoICkgeyB9Jyk7IH0pO1xuICBpdCgnc3VwcG9ydHMgcGFyYW0gZGVmYXVsdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmdW5jdGlvbiB4KGEgPSA0MiwgYiA9IDEpIHsgcmV0dXJuIDQyOyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgeCAoIFsgYSA9IDQyICwgYiA9IDEgXSApIHsgcmV0dXJuIDQyIDsgfScpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnZnVuY3Rpb24geChwMSwgYSA9IDQyLCBiID0gMSwgcDIpIHsgcmV0dXJuIDQyOyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgeCAoIHAxICwgWyBhID0gNDIgLCBiID0gMSAsIHAyIF0gKSB7IHJldHVybiA0MiA7IH0nKTtcbiAgfSk7XG4gIGl0KCd0cmFuc2xhdGVzIG9wdGlvbmFsIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmdW5jdGlvbiB4KGE/OiBudW1iZXIsIGI/OiBudW1iZXIpIHsgcmV0dXJuIDQyOyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgeCAoIFsgbnVtIGEgLCBudW0gYiBdICkgeyByZXR1cm4gNDIgOyB9Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmdW5jdGlvbiB4KHAxLCBhPzogbnVtYmVyLCBiPzogbnVtYmVyLCBwMikgeyByZXR1cm4gNDI7IH0nKVxuICAgICAgICAudG8uZXF1YWwoJyB4ICggcDEgLCBbIG51bSBhICwgbnVtIGIgLCBwMiBdICkgeyByZXR1cm4gNDIgOyB9Jyk7XG4gIH0pO1xuICBpdCgnc3VwcG9ydHMgZW1wdHkgcmV0dXJucycsXG4gICAgICgpID0+IHsgZXhwZWN0VHJhbnNsYXRlKCdmdW5jdGlvbiB4KCkgeyByZXR1cm47IH0nKS50by5lcXVhbCgnIHggKCApIHsgcmV0dXJuIDsgfScpOyB9KTtcbiAgaXQoJ3N1cHBvcnRzIG5hbWVkIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmdW5jdGlvbiB4KHthID0gXCJ4XCIsIGJ9KSB7IHJldHVybiBhICsgYjsgfScpXG4gICAgICAgIC50by5lcXVhbCgnIHggKCB7IGEgOiBcInhcIiAsIGIgfSApIHsgcmV0dXJuIGEgKyBiIDsgfScpO1xuICB9KTtcbiAgLy8gVE9ETyhtYXJ0aW5wcm9ic3QpOiBTdXBwb3J0IHR5cGVzIG9uIG5hbWVkIHBhcmFtZXRlcnMuXG4gIGl0LnNraXAoJ2ZhaWxzIGZvciB0eXBlcyBvbiBuYW1lZCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgIGV4cGVjdEVycm9uZW91c0NvZGUoJ2Z1bmN0aW9uIHgoe2F9OiBudW1iZXIpIHsgcmV0dXJuIGEgKyBiOyB9JylcbiAgICAgICAgLnRvLnRocm93KCd0eXBlcyBvbiBuYW1lZCBwYXJhbWV0ZXJzIGFyZSB1bnN1cHBvcnRlZCcpO1xuICB9KTtcbiAgaXQoJ2RvZXMgbm90IHN1cHBvcnQgdmFyIGFyZ3MnLCAoKSA9PiB7XG4gICAgZXhwZWN0RXJyb25lb3VzQ29kZSgnZnVuY3Rpb24geCguLi5hOiBudW1iZXIpIHsgcmV0dXJuIDQyOyB9JylcbiAgICAgICAgLnRvLnRocm93KCdyZXN0IHBhcmFtZXRlcnMgYXJlIHVuc3VwcG9ydGVkJyk7XG4gIH0pO1xuICBpdCgnZG9lcyBub3Qgc3VwcG9ydCBnZW5lcmljIGZ1bmN0aW9ucycsICgpID0+IHtcbiAgICBleHBlY3RFcnJvbmVvdXNDb2RlKCdmdW5jdGlvbiB4PFQ+KCkgeyByZXR1cm4gNDI7IH0nKVxuICAgICAgICAudG8udGhyb3coJ2dlbmVyaWMgZnVuY3Rpb25zIGFyZSB1bnN1cHBvcnRlZCcpO1xuICB9KTtcbiAgaXQoJ3RyYW5zbGF0ZXMgZnVuY3Rpb24gZXhwcmVzc2lvbnMnLFxuICAgICAoKSA9PiB7IGV4cGVjdFRyYW5zbGF0ZSgndmFyIGEgPSBmdW5jdGlvbigpIHt9JykudG8uZXF1YWwoJyB2YXIgYSA9ICggKSB7IH0gOycpOyB9KTtcbiAgaXQoJ3RyYW5zbGF0ZXMgZmF0IGFycm93IG9wZXJhdG9yJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIGEgPSAoKSA9PiB7fScpLnRvLmVxdWFsKCcgdmFyIGEgPSAoICkgeyB9IDsnKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3ZhciBhID0gKCk6IHN0cmluZyA9PiB7fScpLnRvLmVxdWFsKCcgdmFyIGEgPSAvKiBTdHJpbmcgKi8gKCApIHsgfSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd2YXIgYSA9IChwKSA9PiBpc0JsYW5rKHApJykudG8uZXF1YWwoJyB2YXIgYSA9ICggcCApID0+IGlzQmxhbmsgKCBwICkgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIGEgPSAocCA9IG51bGwpID0+IGlzQmxhbmsocCknKVxuICAgICAgICAudG8uZXF1YWwoJyB2YXIgYSA9ICggWyBwID0gbnVsbCBdICkgPT4gaXNCbGFuayAoIHAgKSA7Jyk7XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=