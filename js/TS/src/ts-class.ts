export {}

class Person {
    name: string // 默认访问符为public
    age: number
    private school: string
    protected readonly id: number

    constructor (name:string, age: number, school: string, id: number) {
        this.name = name
        this.age = age
        this.school = school
        this.id = id
    }
}

class Student extends Person {
    constructor (name:string, age: number, school: string, id: number) {
        super(name, age, school, id)
    }
}

const p = new Person('pb', 19, 'whut', 1)

abstract class Animal {
    abstract sayHi(): void
}

class Dog extends Animal {
    sayHi() {
        console.log('dog')
    }
}

interface Behavior {
    eat (food: string): void
}

class Cat implements Behavior {
    eat(food: string): void {
        console.log(food)
    }
}