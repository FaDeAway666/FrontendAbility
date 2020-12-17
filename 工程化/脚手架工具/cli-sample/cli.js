#!/usr/bin/env node

// node cli 应用入口文件需要有这个文件头

console.log('cli working')

const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        default: 'cli-sample'
    }
]).then(answer => {
    this.answer = answer;
    const tmpDir = path.join(__dirname, 'templates')

    const destDir = process.cwd();

    fs.readdir(tmpDir, 'utf-8', (err, files) => {
        if (err) throw err
        files.forEach(file => {
            ejs.renderFile(path.join(tmpDir, file), answer, (err, result) => {
                if (err) throw err
                // console.log(result)
                fs.writeFileSync(path.join(destDir, file), result)
            })
        })
    })
})