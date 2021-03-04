/**
 * reactive 函数原理实现
 */

const isObject = val => val && (typeof val === 'object')
const hasOwn = (target, key) => target.hasOwnProperty(key)
// 如果子属性也是object，将子属性也设为响应式
const convert = target => isObject(target) ? reactive(target) : target


export const reactive = target => {
    // 如果不是object，直接返回自身
    if(!isObject(target)) return target

    const getter = (target, key, receiver) => {
        if (hasOwn(target, key)) {
            // 收集依赖
            track(target, key)
            const result =  Reflect.get(target, key, receiver)
            return convert(result)
        }
        else {
            return 'no such property'
        }
    }

    const setter = (target, key, value, receiver) => {
        const oldV = Reflect.get(target, key)
        if (value !== oldV) {
            const result = Reflect.set(target, key, value, receiver)
            // setter 生效之后，再触发，不然还是之前的值
            trigger(target, key)
            return result
        } else return oldV
    }

    const deleteHandler = (target, key) => {
        if (hasOwn(target, key)) {
            trigger(target, key)
            return Reflect.deleteProperty(target, key)
        }
        else {
            return 'no such property'
        }
    }

    return new Proxy(target, {
        get: getter,
        set: setter,
        deleteProperty: deleteHandler
    })
}

// 定义一个存放当前effect的变量
let activeEffect = null

// 定义targetMap
const targetMap = new WeakMap()

export const effect = callback => {
    // 将当前传入的回调赋值过去，并立即执行回调
    activeEffect = callback
    // 执行回调过程中，会访问依赖的getter，触发track函数
    callback()
    // 依赖收集完毕后，需要将activeEffect清空，不然会引发递归，因为后续trigger的规程中会再次执行callbacks
    activeEffect = null

}

// track 函数在getter处收集依赖
const track = (target, key) => {
    // 避免递归
    if (!activeEffect) return
    // 设置depsMap，存放key和callbacks集合
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    // 添加当前effect回调到集合中
    deps.add(activeEffect)
}

// 触发回调函数，通过target和key去遍历执行callbacks集合
const trigger = (target, key) => {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    const deps = depsMap.get(key)
    if (!deps) return
    deps.forEach(effect => {
        effect()
    })
}