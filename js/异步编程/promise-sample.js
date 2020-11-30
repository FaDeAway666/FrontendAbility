import ajax from './promise-ajax';

const promise = new Promise((resolve,reject) => {
    resolve(100)

    reject(new Error('promise rejected!')) // 状态一旦变更，不可再修改
})

Promise.all([
    ajax('./api/test.json'),
    ajax('./api/as.json')
]).then(value => console.log(value))
.catch(err => console.log(new Error(err)))

Promise.race([
    ajax('./api/test.json'),
    new Promise((resolve,reject) => {
        setTimeout(() => {
            reject('TIMEOUT')
        }, 0);
    })
]).then(value => console.log(value))
.catch(err => console.log(new Error(err)))

// ajax('/api/bb.json').then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// })
// promise.then(res => {
//     console.log(res, 'resolved')
// }).catch(err => {
//     console.log(err)
// })