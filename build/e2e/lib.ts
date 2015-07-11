import {CONST, CONST_EXPR, forwardRef} from "angular2/src/facade/lang";

@CONST
export class MyClass {
  private _error: string = "error";
  constructor(private _field: string) {}

  get field(): string {
    // TODO: TypeScript doesn't parse the RHS as StringKeyword so we lose
    // the translation of string -> String.
    // We use capital S String here, even though it wouldn't run in TS.
    if ((<any>" world") instanceof String) {
      return this._field + " world";
    } else {
      return this._error;
    }
  }

  namedParam({x = "?"}: any = {}) { return 'hello' + x; }
}

interface Observer {
  update(o: Object, arg: Object);
}

export class MySubclass extends MyClass implements Observer {
  constructor(_field: string) { super(_field); }
  get subclassField(): string { return this.field; }
  update(o: Object, arg: Object) {}
}

export const SomeArray = CONST_EXPR([1, 2, 3]);
const someArray = forwardRef(() => SomeArray);
