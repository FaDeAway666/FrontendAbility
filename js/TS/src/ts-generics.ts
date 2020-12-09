function createNumberArray(len: number, value: number): number[] {
    let arr = Array<number>(len).fill(value)
    return arr
}

function createArray<T>(len: number, value: T) {
    let arr = Array<T>(len).fill(value);
    return arr;
}

const res = createArray<string>(2, 'pb')

class GenericNumber<T> {
    zero!: T;
    add!: (x: T, y: T) => T;
}

let generic = new GenericNumber<number>()
generic.zero = 0
generic.add = function(x, y) { return x + y }

interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let ca: CreateArrayFunc<any>;
ca = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

ca(3, 'x'); // ['x', 'x', 'x']