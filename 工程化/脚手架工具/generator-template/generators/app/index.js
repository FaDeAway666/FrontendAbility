// generator的核心入口
// 需要导出一个继承 Yeoman Generator的类型
// Yeoman Generator 在工作时会自动调用在此类型中定义的一些生命周期方法
// 在这些方法中，可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    prompting() {
        // yeoman在询问用户环节会调用此方法
        // 调用父类的prompt发出对用户的命令行询问
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'your project name',
                default: this.appname
            }
        ]).then(answers => {
            this.answers = answers
        })
    }
    writing () {
        // Yeoman自动在文件生成阶段调用这个writing方法
        // this.fs.write(this.destinationPath('temp.txt'), 'hello generator')

        // 通过模板方式写入文件到指定目录

        const tmpl = this.templatePath('bar.html') // templatePath 对应templates文件夹下的路径

        const output = this.destinationPath('bar.html')

        const context = this.answers

        this.fs.copyTpl(tmpl, output, context)
    }
}