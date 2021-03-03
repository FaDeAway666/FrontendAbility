# setup

组合式API的入口，一个接受props和context的函数，从setup中返回的所有内容都将暴露给组件的其余部分（计算属性、方法、生命钩子函数等）及组件的模板



# reactive/toRefs/ref

reactive函数返回对象的响应式副本，这个转换是深层的，包括了所有嵌套的属性。

ref函数接受一个参数，并将其包装成一个具有value属性的对象，使其具有响应式，可以使用这个value访问或更改响应式变量的值

```js
import { ref } from 'vue'

const count = ref(0)

console.log(count) // { value: 0}

count.value++
console.log(count.value) // 1
```

toRefs将**响应式对象转换为普通对象**，结果对象中每个property都是指向原始对象相应property的ref

```js
const state = reactive({
    foo: 1,
    bar: 2
})

const stateAsRefs = toRefs(state)

/*
{
	foo: Ref<number>
	bar: Ref<number>
}
*/
```

reactive