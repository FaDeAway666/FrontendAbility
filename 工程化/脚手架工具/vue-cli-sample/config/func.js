const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

async function mkDirs(answer) {
    await fs.mkdirSync('public')
    await fs.mkdirSync('src')
    await fs.mkdirSync('src/assets')
    await fs.mkdirSync('src/assets/font')
    await fs.mkdirSync('src/assets/styles')
    await fs.mkdirSync('src/views')
    console.log(answer)
    if (answer.usei18n)
        await fs.mkdirSync('src/i18n')
    if (answer.useRouter)
        await fs.mkdirSync('src/router')
    if (answer.useStore)
        await fs.mkdirSync('src/store')
    console.log('文件夹创建成功，正在写入文件....')
}

function writeFiles(tmpDir, destDir, fileList, answer) {
    fileList.forEach((file, index) => {
        fs.readFile(path.join(tmpDir, file), async (err, data) => {
            if(err) throw err;
            try {
                const template = handlebars.compile(data.toString())
                await fs.writeFileSync(path.join(destDir, file), template(answer));
            } catch(e) {
                await fs.writeFileSync(path.join(destDir, file), data)
            }
            console.log(file, '写入完成！')
        })
    })
}

module.exports.mkDirs = mkDirs
module.exports.writeFiles = writeFiles