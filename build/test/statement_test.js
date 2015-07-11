/// <reference path="../typings/mocha/mocha.d.ts"/>
var test_support_1 = require('./test_support');
describe('statements', function () {
    it('translates switch', function () {
        test_support_1.expectTranslate('switch(x) { case 1: break; case 2: break; default: break; }')
            .to.equal(' switch ( x ) { case 1 : break ; case 2 : break ; default : break ; }');
    });
    it('translates for loops', function () {
        test_support_1.expectTranslate('for (1; 2; 3) { 4 }').to.equal(' for ( 1 ; 2 ; 3 ) { 4 ; }');
        test_support_1.expectTranslate('for (var x = 1; 2; 3) { 4 }').to.equal(' for ( var x = 1 ; 2 ; 3 ) { 4 ; }');
        test_support_1.expectTranslate('for (var x, y = 1; 2; 3) { 4 }')
            .to.equal(' for ( var x , y = 1 ; 2 ; 3 ) { 4 ; }');
        test_support_1.expectTranslate('for (var x = 0, y = 1; 2; 3) { 4 }')
            .to.equal(' for ( var x = 0 , y = 1 ; 2 ; 3 ) { 4 ; }');
    });
    it('translates for-in loops', function () {
        test_support_1.expectTranslate('for (var x in 1) { 2 }').to.equal(' for ( var x in 1 ) { 2 ; }');
        test_support_1.expectTranslate('for (x in 1) { 2 }').to.equal(' for ( x in 1 ) { 2 ; }');
    });
    it('translates while loops', function () {
        test_support_1.expectTranslate('while (1) { 2 }').to.equal(' while ( 1 ) { 2 ; }');
        test_support_1.expectTranslate('do 1; while (2);').to.equal(' do 1 ; while ( 2 ) ;');
    });
    it('translates if/then/else', function () {
        test_support_1.expectTranslate('if (x) { 1 }').to.equal(' if ( x ) { 1 ; }');
        test_support_1.expectTranslate('if (x) { 1 } else { 2 }').to.equal(' if ( x ) { 1 ; } else { 2 ; }');
        test_support_1.expectTranslate('if (x) 1;').to.equal(' if ( x ) 1 ;');
        test_support_1.expectTranslate('if (x) 1; else 2;').to.equal(' if ( x ) 1 ; else 2 ;');
    });
    it('translates try/catch', function () {
        test_support_1.expectTranslate('try {} catch(e) {} finally {}')
            .to.equal(' try { } catch ( e , e_stack ) { } finally { }');
        test_support_1.expectTranslate('try {} catch(e: MyException) {}')
            .to.equal(' try { } on MyException catch ( e , e_stack ) { }');
    });
    it('translates throw', function () {
        test_support_1.expectTranslate('throw new Error("oops")').to.equal(' throw new Error ( "oops" ) ;');
    });
    it('translates empty statements', function () { test_support_1.expectTranslate(';').to.equal(' ;'); });
    it('translates break & continue', function () {
        test_support_1.expectTranslate('break;').to.equal(' break ;');
        test_support_1.expectTranslate('continue;').to.equal(' continue ;');
        test_support_1.expectTranslate('break foo ;').to.equal(' break foo ;');
    });
    it('rewrites catch block to preserve stack trace', function () {
        test_support_1.expectTranslate('try {} catch (e) { console.log(e, e.stack); }')
            .to.equal(' try { } catch ( e , e_stack ) { console . log ( e , e_stack ) ; }');
    });
    it('rewrites rethrow to preserve stack trace', function () {
        test_support_1.expectTranslate('try {} catch (ex) { throw ex; }')
            .to.equal(' try { } catch ( ex , ex_stack ) { rethrow ; }');
    });
});

//# sourceMappingURL=data:application/json;base64,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LENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsOEJBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELDhCQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCw4QkFBZSxDQUFDLCtDQUErQyxDQUFDO2FBQzNELEVBQUUsQ0FBQyxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQztJQUN0RixDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQywwQ0FBMEMsRUFDMUM7UUFBTyw4QkFBZSxDQUFDLGlDQUFpQyxDQUFDO2FBQzdDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtJQUFBLENBQUMsQ0FBQyxDQUFDO0FBQzlFLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3Qvc3RhdGVtZW50X3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9tb2NoYS9tb2NoYS5kLnRzXCIvPlxuaW1wb3J0IHtleHBlY3RUcmFuc2xhdGUsIGV4cGVjdEVycm9uZW91c0NvZGV9IGZyb20gJy4vdGVzdF9zdXBwb3J0JztcblxuZGVzY3JpYmUoJ3N0YXRlbWVudHMnLCAoKSA9PiB7XG4gIGl0KCd0cmFuc2xhdGVzIHN3aXRjaCcsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3N3aXRjaCh4KSB7IGNhc2UgMTogYnJlYWs7IGNhc2UgMjogYnJlYWs7IGRlZmF1bHQ6IGJyZWFrOyB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgc3dpdGNoICggeCApIHsgY2FzZSAxIDogYnJlYWsgOyBjYXNlIDIgOiBicmVhayA7IGRlZmF1bHQgOiBicmVhayA7IH0nKTtcbiAgfSk7XG4gIGl0KCd0cmFuc2xhdGVzIGZvciBsb29wcycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2ZvciAoMTsgMjsgMykgeyA0IH0nKS50by5lcXVhbCgnIGZvciAoIDEgOyAyIDsgMyApIHsgNCA7IH0nKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2ZvciAodmFyIHggPSAxOyAyOyAzKSB7IDQgfScpLnRvLmVxdWFsKCcgZm9yICggdmFyIHggPSAxIDsgMiA7IDMgKSB7IDQgOyB9Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmb3IgKHZhciB4LCB5ID0gMTsgMjsgMykgeyA0IH0nKVxuICAgICAgICAudG8uZXF1YWwoJyBmb3IgKCB2YXIgeCAsIHkgPSAxIDsgMiA7IDMgKSB7IDQgOyB9Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmb3IgKHZhciB4ID0gMCwgeSA9IDE7IDI7IDMpIHsgNCB9JylcbiAgICAgICAgLnRvLmVxdWFsKCcgZm9yICggdmFyIHggPSAwICwgeSA9IDEgOyAyIDsgMyApIHsgNCA7IH0nKTtcbiAgfSk7XG4gIGl0KCd0cmFuc2xhdGVzIGZvci1pbiBsb29wcycsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2ZvciAodmFyIHggaW4gMSkgeyAyIH0nKS50by5lcXVhbCgnIGZvciAoIHZhciB4IGluIDEgKSB7IDIgOyB9Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdmb3IgKHggaW4gMSkgeyAyIH0nKS50by5lcXVhbCgnIGZvciAoIHggaW4gMSApIHsgMiA7IH0nKTtcbiAgfSk7XG4gIGl0KCd0cmFuc2xhdGVzIHdoaWxlIGxvb3BzJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnd2hpbGUgKDEpIHsgMiB9JykudG8uZXF1YWwoJyB3aGlsZSAoIDEgKSB7IDIgOyB9Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdkbyAxOyB3aGlsZSAoMik7JykudG8uZXF1YWwoJyBkbyAxIDsgd2hpbGUgKCAyICkgOycpO1xuICB9KTtcbiAgaXQoJ3RyYW5zbGF0ZXMgaWYvdGhlbi9lbHNlJywgKCkgPT4ge1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnaWYgKHgpIHsgMSB9JykudG8uZXF1YWwoJyBpZiAoIHggKSB7IDEgOyB9Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdpZiAoeCkgeyAxIH0gZWxzZSB7IDIgfScpLnRvLmVxdWFsKCcgaWYgKCB4ICkgeyAxIDsgfSBlbHNlIHsgMiA7IH0nKTtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2lmICh4KSAxOycpLnRvLmVxdWFsKCcgaWYgKCB4ICkgMSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdpZiAoeCkgMTsgZWxzZSAyOycpLnRvLmVxdWFsKCcgaWYgKCB4ICkgMSA7IGVsc2UgMiA7Jyk7XG4gIH0pO1xuICBpdCgndHJhbnNsYXRlcyB0cnkvY2F0Y2gnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd0cnkge30gY2F0Y2goZSkge30gZmluYWxseSB7fScpXG4gICAgICAgIC50by5lcXVhbCgnIHRyeSB7IH0gY2F0Y2ggKCBlICwgZV9zdGFjayApIHsgfSBmaW5hbGx5IHsgfScpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgndHJ5IHt9IGNhdGNoKGU6IE15RXhjZXB0aW9uKSB7fScpXG4gICAgICAgIC50by5lcXVhbCgnIHRyeSB7IH0gb24gTXlFeGNlcHRpb24gY2F0Y2ggKCBlICwgZV9zdGFjayApIHsgfScpO1xuICB9KTtcbiAgaXQoJ3RyYW5zbGF0ZXMgdGhyb3cnLCAoKSA9PiB7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCd0aHJvdyBuZXcgRXJyb3IoXCJvb3BzXCIpJykudG8uZXF1YWwoJyB0aHJvdyBuZXcgRXJyb3IgKCBcIm9vcHNcIiApIDsnKTtcbiAgfSk7XG4gIGl0KCd0cmFuc2xhdGVzIGVtcHR5IHN0YXRlbWVudHMnLCAoKSA9PiB7IGV4cGVjdFRyYW5zbGF0ZSgnOycpLnRvLmVxdWFsKCcgOycpOyB9KTtcbiAgaXQoJ3RyYW5zbGF0ZXMgYnJlYWsgJiBjb250aW51ZScsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ2JyZWFrOycpLnRvLmVxdWFsKCcgYnJlYWsgOycpO1xuICAgIGV4cGVjdFRyYW5zbGF0ZSgnY29udGludWU7JykudG8uZXF1YWwoJyBjb250aW51ZSA7Jyk7XG4gICAgZXhwZWN0VHJhbnNsYXRlKCdicmVhayBmb28gOycpLnRvLmVxdWFsKCcgYnJlYWsgZm9vIDsnKTtcbiAgfSk7XG4gIGl0KCdyZXdyaXRlcyBjYXRjaCBibG9jayB0byBwcmVzZXJ2ZSBzdGFjayB0cmFjZScsICgpID0+IHtcbiAgICBleHBlY3RUcmFuc2xhdGUoJ3RyeSB7fSBjYXRjaCAoZSkgeyBjb25zb2xlLmxvZyhlLCBlLnN0YWNrKTsgfScpXG4gICAgICAgIC50by5lcXVhbCgnIHRyeSB7IH0gY2F0Y2ggKCBlICwgZV9zdGFjayApIHsgY29uc29sZSAuIGxvZyAoIGUgLCBlX3N0YWNrICkgOyB9Jyk7XG4gIH0pO1xuICBpdCgncmV3cml0ZXMgcmV0aHJvdyB0byBwcmVzZXJ2ZSBzdGFjayB0cmFjZScsXG4gICAgICgpID0+IHtleHBlY3RUcmFuc2xhdGUoJ3RyeSB7fSBjYXRjaCAoZXgpIHsgdGhyb3cgZXg7IH0nKVxuICAgICAgICAgICAgICAgIC50by5lcXVhbCgnIHRyeSB7IH0gY2F0Y2ggKCBleCAsIGV4X3N0YWNrICkgeyByZXRocm93IDsgfScpfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==