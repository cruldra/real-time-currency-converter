export interface IStreamable<T> {
  get value(): T;
}

export class SimpleStreamable<T> implements IStreamable<T> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }
}
export class ArrayStream<T> extends SimpleStreamable<Array<T>> {
  static of<T>(value: Array<T>): ArrayStream<T> {
    return new ArrayStream<T>(value);
  }

  skip(index: number): ArrayStream<T> {
    const copy = [...this.value];
    copy.splice(index, 1);
    return ArrayStream.of(copy);
  }
}
