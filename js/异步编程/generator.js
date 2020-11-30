const { default: ajax } = require("./promise-ajax");

function * foo() {
    console.log('start');

    try {
        let result = yield 'foo'
        console.log(result)
        yield 'bb'
    }catch(e) {
        console.log(e)
    }
}

function * main() {
    let res = yield ajax('./api/test.json')
    console.log(res)

    let res2 = yield ajax('./api/test.json')
    console.log(res2)
}

let g = main();
function handleResult(result) {
    if(result.done) return

    result.value.then(res => {
        handleResult(g.next(res))
    })
}

handleResult(g.next())