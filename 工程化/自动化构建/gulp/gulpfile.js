// gulp 入口文件

exports.foo = done => { // 推荐使用方式
    console.log('foo task working')

    done() // gulp取消了同步写法，必须调用done来标记任务结束
    // done(new Error())
}

exports.default = done => {
    console.log('default task')
    done()
}

// const gulp = require('gulp')

// gulp.task('bar', done => { // 不推荐这种写法
//     console.log('bar task')
//     done()
// })

const { series, parallel } = require('gulp')

const task1 = done => {
    setTimeout(() => {
        console.log('task1 working')
        done()
    }, 1000);
}

const task2 = done => {
    setTimeout(() => {
        console.log('task2 working')
        done()
    }, 1000);
}

exports.t1 = series(task1, task2) // 串行执行任务，适用于编译过程

exports.t2 = parallel(task1, task2) // 并行执行任务，适用于

// 异步其他写法
exports.promise = () => {
    console.log('promise done')
    return Promise.resolve() // Promise.reject(new Error('reject))
}

const timeout = time => {
    return new Promise((resolve,reject) => {
        setTimeout(resolve, time)
    })
}
exports.async = async () => {
    await timeout(1000)
    console.log('async task done')
}

// 流
const fs = require('fs')
exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStream.pipe(writeStream)
    console.log('stream done')
    return readStream // 实际上注册了一个任务来监听stream的end事件
}

// 模拟chunk构建核心原理
// 读取文件流，将其进行转换，在写入到目标文件中
const { Transform } = require('stream')
exports.transform = () => {
    // 文件读取流
    const read = fs.createReadStream('temp.txt')
    // 文件写入流
    const write = fs.createWriteStream('newpackage.js')
    // 文件转换流
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            // chunk是读取到的文件
            const input = chunk.toString()
            const output = input.replace(/\"/g, '')
            callback(null, output)
        }
    })
    // 管道操作，在扩展插件的时候可以有一个统一的方式
    read.pipe(transform)
        .pipe(write)

    return read
}

// gulp中文件的读取和写入的API
const {src, dest} = require('gulp')

exports.read = () => {
    return src('newpackage.js').pipe(dest('dest')) // 输出目录
}