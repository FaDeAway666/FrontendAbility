// 实现这个项目的构建任务
const {src, dest, series, parallel, watch} = require('gulp')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins() // 一次性加载所有gulp-*的插件
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
const del = require('del')

const bs = require('browser-sync')

const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src'}) // 添加一个src option
        .pipe(plugins.sass({
            outputStyle: 'expanded'
        }))
        .pipe(dest('tmp'))
        // .pipe(bs.reload({stream: true})) // 也可以用这种方法，就不要再bs.init里面用files
}

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src'})
        .pipe(plugins.babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest('tmp'))
}

const page = () => {
    return src('src/**/*.html', { base: 'src'})
        .pipe(plugins.swig())
        .pipe(dest('tmp'))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src'})
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/*', { base: 'src'})
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public'})
        .pipe(dest('dist'))
}

const clean = () => {
    return del(['dist','tmp'])
}

const serve = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/**/*.html', page) 

    // 当图片或字体发生改变的时候，reload浏览器，而不是进行构建
    watch(['src/assets/images/**','src/assets/fonts/*', 'public/**'], bs.reload) 

    bs.init({
        port: 3000,
        files: 'tmp/**', // 监听文件变化
        server: {
            baseDir: ['tmp', 'src', 'public'], // 如果第一个找不到，就回到后面的目录中寻找
            routes: {
                // /node_modules开头的请求都被转发到node_modules文件夹中
                '/node_modules': 'node_modules' 
            }
        }
    })
}

const useref = () => {
    return src('tmp/*.html', {base: 'tmp'})
        .pipe(plugins.useref({ searchPath: ['tmp', '.']})) // 根据注释，将外部引用的依赖进行合并
        .pipe(plugins.if(/\.js$/, plugins.uglify())) // 压缩js，css，html
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true})))
        .pipe(dest('dist'))
}

const compile = parallel(style, script, page)

const dev = series(compile, serve)

const build = series(clean, parallel(series(compile, useref), image, font, extra))

module.exports = {
    build,
    clean,
    dev
}