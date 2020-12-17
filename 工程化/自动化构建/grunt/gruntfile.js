// grunt 的入口文件
// 用于定义一些需要grunt 自动执行的任务
// 需要导出一个函数
// 该函数接收一个grunt形参，内部提供一些创建任务时可以用到的API

module.exports = grunt => { // 会去自动找node_modules中的grunt命令，去执行注册的任务
    grunt.registerTask('foo', () => {
        console.log('foo')
    })

    grunt.registerTask('bar', () => {
        console.log('bar')
    })

    // grunt.registerTask('default', ['foo', 'bar']) // 定义默认任务 直接yarn grunt就会按照任务数组的顺序执行

    // grunt执行顺序默认是同步，如果要注册异步任务，需要在异步任务完成的时候调用task的async方法
    grunt.registerTask('async-task', function() { 
        const done = this.async()
        setTimeout(() => {
            console.log('async task')
            done()
        }, 1000);
    })

    // 标记失败
    // 通过返回一个false标记任务的失败
    grunt.registerTask('bad', () => {
        console.log('bad')
        return false
    })

    // 一个任务的失败会导致后面的任务不能执行，如果要强制后面的任务执行，可以使用--force参数
    grunt.registerTask('default', ['foo','bad','bar'])

    // 异步的任务失败，需要在done方法中传递一个false作为参数
    grunt.registerTask('async-false', function() {
        const done = this.async()
        setTimeout(() => {
            console.log('async false')
            done(false)
        }, 1000);
    })

    // 配置方法
    grunt.initConfig({
        foo: 'bar',
        obj: {
            name: 'pb'
        }
    })
    // 可以在后续的调用中使用该配置
    grunt.registerTask('config', () => {
        console.log(grunt.config('foo'))
        console.log(grunt.config('obj.name'))
    })

    // 多目标任务
    // 使用配置项，将任务拆成多个子任务
    grunt.initConfig({
        // config属性名要设置为任务名
        build: {
            options: { // 任务的配置项
                foo: 'bar'
            },
            css: 1,
            js: {
                options: { // 子任务配置项在执行的时候会覆盖掉总配置项
                    foo: 'baz'
                }
            }
        }
    })

    grunt.registerMultiTask('build', function() {
        console.log(this.options())
        console.log(this.target, this.data)
    })

    // 插件
    // 安装插件，通过loadNpmTasks安装对应的任务

    // grunt-contrib-clean是一个多目标任务，需要配置config
    grunt.initConfig({
        clean: {
            temp: 'temp/app.js' // 清除temp文件夹下app.js文件
        }
    })

    grunt.loadNpmTasks('grunt-contrib-clean') // 通常插件注册的任务名就是最后一个横杠后的名字


}