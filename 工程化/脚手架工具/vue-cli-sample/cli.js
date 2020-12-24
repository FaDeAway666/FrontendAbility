#!/usr/bin/env node

// node cli 应用入口文件需要有这个文件头

const inquirer = require('inquirer')
const path = require('path')
const handlebars = require('handlebars')
const { mkDirs, writeFiles } = require('./config/func')

const { common, i18n, router, store, style } = require('./config/inquirerConf')

const template = handlebars.compile('<div>{{name}}<div>')
            console.log(template(this.answer));
inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'your project name?',
        default: 'cli-sample'
    },
    {
        type: 'confirm',
        name: 'useRouter',
        message: 'use Vue-Router?'
    },
    {
        type: 'confirm',
        name: 'useStore',
        message: 'use Vuex?'
    },
    {
        type: 'confirm',
        name: 'usei18n',
        message: 'use i18n?'
    },
    {
        type: 'list',
        name: 'cssType',
        message: 'your css type?',
        choices: [
            'css',
            'sass',
            'less'
        ]
    },
]).then(answer => {
    this.answer = answer;

    const tmpDir = path.join(__dirname, 'templates')
    const destDir = process.cwd();
    let fileList = common
    if(answer.useRouter) {
        fileList = fileList.concat(router)
    }
    if(answer.useStore) {
        fileList = fileList.concat(store)
    }
    if(answer.usei18n) {
        fileList = fileList.concat(i18n)
    }

    switch(answer.cssType) {
        case 'css': 
            fileList = fileList.concat(style.css)
            this.answer.useCss = true
            break;
        case 'less':
            fileList = fileList.concat(style.less)
            this.answer.useLess = true
            break;
        case 'sass':
            fileList = fileList.concat(style.sass)
            this.answer.useSass = true
            break;
    }

    mkDirs(this.answer);
    writeFiles(tmpDir, destDir, fileList, this.answer);

    // fileList.forEach(file => {
    //     fs.readFile(path.join(tmpDir, file), (err, data) => {
    //         if(err) throw err;
    //         try {
    //             const template = handlebars.compile(data.toString())
    //             fs.writeFileSync(path.join(destDir, file), template(this.answer));
    //         } catch(e) {
    //             fs.writeFileSync(path.join(destDir, file), data)
    //         }
    //         // console.log(template(this.answer), file)

    //     })
    // })

})
