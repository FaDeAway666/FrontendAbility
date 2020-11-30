const { default: ajax } = require("./promise-ajax")

async function main() {
    let res = await ajax('./api/test.json')
    console.log(res)

    let res2 = await ajax('./api/test.json')
    console.log(res2)
}

const promise = main()

promise.then(() => {
    console.log('all completed')
})
