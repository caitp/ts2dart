/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
describe('types', function () {
    it('supports qualified names', function () { test_support_1.expectTranslate('var x: foo.Bar;').to.equal(' foo . Bar x ;'); });
    it('drops type literals', function () { test_support_1.expectTranslate('var x: {x: string, y: number};').to.equal(' dynamic x ;'); });
    it('allows typecasts', function () { test_support_1.expectTranslate('<MyType>ref').to.equal(' ( ref as MyType ) ;'); });
    it('does not mangle prototype names', function () {
        test_support_1.expectTranslate('import toString = require("./somewhere");')
            .to.equal(' import "somewhere.dart" as toString ;');
    });
    it('should support union types', function () {
        test_support_1.expectTranslate('var x: number|List<string> = 11;')
            .to.equal(' dynamic /* num | List < String > */ x = 11 ;');
    });
    it('should support array types', function () { test_support_1.expectTranslate('var x: string[] = [];').to.equal(' List < String > x = [ ] ;'); });
    it('should support function types (by ignoring them)', function () {
        test_support_1.expectTranslate('var x: (a: string) => string;')
            .to.equal(' dynamic /* (a: string) => string */ x ;');
    });
});
describe('type arguments', function () {
    it('should support declaration', function () {
        test_support_1.expectTranslate('class X<A, B> { a: A; }').to.equal(' class X < A , B > { A a ; }');
    });
    it('should support nested extends', function () {
        test_support_1.expectTranslate('class X<A extends B<C>> { }').to.equal(' class X < A extends B < C > > { }');
    });
    it('should multiple extends', function () {
        test_support_1.expectTranslate('class X<A extends A1, B extends B1> { }')
            .to.equal(' class X < A extends A1 , B extends B1 > { }');
    });
    it('should support use', function () {
        test_support_1.expectTranslate('class X extends Y<A, B> { }').to.equal(' class X extends Y < A , B > { }');
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvdHlwZV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1EQUFtRDtBQUNuRCw2QkFBOEIsZ0JBQWdCLENBQUMsQ0FBQTtBQUUvQyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLEVBQUUsQ0FBQywwQkFBMEIsRUFDMUIsY0FBUSw4QkFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsRUFBRSxDQUFDLHFCQUFxQixFQUNyQixjQUFRLDhCQUFlLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUYsRUFBRSxDQUFDLGtCQUFrQixFQUNsQixjQUFRLDhCQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLDhCQUFlLENBQUMsMkNBQTJDLENBQUM7YUFDdkQsRUFBRSxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLDhCQUFlLENBQUMsa0NBQWtDLENBQUM7YUFDOUMsRUFBRSxDQUFDLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLDRCQUE0QixFQUM1QixjQUFRLDhCQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixFQUFFLENBQUMsa0RBQWtELEVBQUU7UUFDckQsOEJBQWUsQ0FBQywrQkFBK0IsQ0FBQzthQUMzQyxFQUFFLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixFQUFFLENBQUMsNEJBQTRCLEVBQUU7UUFDL0IsOEJBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUN0RixDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtRQUNsQyw4QkFBZSxDQUFDLDZCQUE2QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ2hHLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1FBQzVCLDhCQUFlLENBQUMseUNBQXlDLENBQUM7YUFDckQsRUFBRSxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLG9CQUFvQixFQUFFO1FBQ3ZCLDhCQUFlLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDOUYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L3R5cGVfdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL21vY2hhL21vY2hhLmQudHNcIi8+XG5pbXBvcnQge2V4cGVjdFRyYW5zbGF0ZX0gZnJvbSAnLi90ZXN0X3N1cHBvcnQnO1xuXG5kZXNjcmliZSgndHlwZXMnLCAoKSA9PiB7XG4gIGl0KCdzdXBwb3J0cyBxdWFsaWZpZWQgbmFtZXMnLFxuICAgICAoKSA9PiB7IGV4cGVjdFRyYW5zbGF0ZSgndmFyIHg6IGZvby5CYXI7JykudG8uZXF1YWwoJyBmb28gLiBCYXIgeCA7Jyk7IH0pO1xuICBpdCgnZHJvcHMgdHlwZSBsaXRlcmFscycsXG4gICAgICgpID0+IHsgZXhwZWN0VHJhbnNsYXRlKCd2YXIgeDoge3g6IHN0cmluZywgeTogbnVtYmVyfTsnKS50by5lcXVhbCgnIGR5bmFtaWMgeCA7Jyk7IH0pO1xuICBpdCgnYWxsb3dzIHR5cGVjYXN0cycsXG4gICAgICgpID0+IHsgZXhwZWN0VHJhbnNsYXRlKCc8TXlUeXBlPnJlZicpLnRvLmVxdWFsKCcgKCByZWYgYXMgTXlUeXBlICkgOycpOyB9KTtcbiAgaXQoJ2RvZXMgbm90IG1hbmdsZSBwcm90b3R5cGUgbmFtZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdpbXBvcnQgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi9zb21ld2hlcmVcIik7JylcbiAgICAgICAgLnRvLmVxdWFsKCcgaW1wb3J0IFwic29tZXdoZXJlLmRhcnRcIiBhcyB0b1N0cmluZyA7Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgdW5pb24gdHlwZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd2YXIgeDogbnVtYmVyfExpc3Q8c3RyaW5nPiA9IDExOycpXG4gICAgICAgIC50by5lcXVhbCgnIGR5bmFtaWMgLyogbnVtIHwgTGlzdCA8IFN0cmluZyA+ICovIHggPSAxMSA7Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgYXJyYXkgdHlwZXMnLFxuICAgICAoKSA9PiB7IGV4cGVjdFRyYW5zbGF0ZSgndmFyIHg6IHN0cmluZ1tdID0gW107JykudG8uZXF1YWwoJyBMaXN0IDwgU3RyaW5nID4geCA9IFsgXSA7Jyk7IH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgZnVuY3Rpb24gdHlwZXMgKGJ5IGlnbm9yaW5nIHRoZW0pJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndmFyIHg6IChhOiBzdHJpbmcpID0+IHN0cmluZzsnKVxuICAgICAgICAudG8uZXF1YWwoJyBkeW5hbWljIC8qIChhOiBzdHJpbmcpID0+IHN0cmluZyAqLyB4IDsnKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3R5cGUgYXJndW1lbnRzJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgZGVjbGFyYXRpb24nLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYPEEsIEI+IHsgYTogQTsgfScpLnRvLmVxdWFsKCcgY2xhc3MgWCA8IEEgLCBCID4geyBBIGEgOyB9Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHN1cHBvcnQgbmVzdGVkIGV4dGVuZHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdjbGFzcyBYPEEgZXh0ZW5kcyBCPEM+PiB7IH0nKS50by5lcXVhbCgnIGNsYXNzIFggPCBBIGV4dGVuZHMgQiA8IEMgPiA+IHsgfScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBtdWx0aXBsZSBleHRlbmRzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY2xhc3MgWDxBIGV4dGVuZHMgQTEsIEIgZXh0ZW5kcyBCMT4geyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgY2xhc3MgWCA8IEEgZXh0ZW5kcyBBMSAsIEIgZXh0ZW5kcyBCMSA+IHsgfScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBzdXBwb3J0IHVzZScsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2NsYXNzIFggZXh0ZW5kcyBZPEEsIEI+IHsgfScpLnRvLmVxdWFsKCcgY2xhc3MgWCBleHRlbmRzIFkgPCBBICwgQiA+IHsgfScpO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9