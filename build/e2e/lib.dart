 class MyClass { final String _field ; final String _error = "error" ; const MyClass ( this . _field ) ; String get field {
 // TODO: TypeScript doesn't parse the RHS as StringKeyword so we lose

 // the translation of string -> String.

 // We use capital S String here, even though it wouldn't run in TS.
 if ( ( ( " world" as dynamic ) ) is String ) { return this . _field + " world" ; } else { return this . _error ; } } namedParam ( { x : "?" } ) { return "hello" + x ; } } abstract class Observer { update ( Object o , Object arg ) ; } class MySubclass extends MyClass implements Observer { MySubclass ( String _field ) : super ( _field ) { /* super call moved to initializer */ ; } String get subclassField { return this . field ; } update ( Object o , Object arg ) { } } const SomeArray = const [ 1 , 2 , 3 ] ; const someArray = forwardRef ( ( ) => SomeArray ) ;