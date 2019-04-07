const {task, src, dest, parallel,series} = require('gulp');      // Connect gulp plugins
const prefixer = require ('gulp-autoprefixer');
const imagemin = require ('gulp-imagemin');
const browsync = require ('browser-sync');
const watch = require ('gulp-watch');
const cleancss = require ('gulp-clean-css');
const clean = require ('gulp-clean');
const maps = require ('gulp-sourcemaps');
const concat = require ('gulp-concat');
const uglify = require ('gulp-uglify');

var path = {
        build: {                            //Path to folders with ready code
            html: 'build/',
            js: 'build/js/',
            style: 'build/css/',
            img: 'build/img/',
            fonts: 'build/fonts/'
        },
        source: {                           //Path to folders with working files
            html: 'app/*.html',             
            js: 'app/js/**/*.js',         
            style: 'app/css/style.css',
            img: 'app/img/**/*.*',          
            fonts: 'app/fonts/**/*.*'
        },
        clear: 'build/*'
}

function html() {                           //HTML file assembly
    return src(path.source.html)
        .pipe(concat('index.html'))
        .pipe(dest(path.build.html))
        .pipe(browsync.stream())
}

function css() {                            //CSS file assembly
    return src(path.source.style)
        .pipe(prefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('style-all.css'))
        .pipe(maps.init())
        .pipe(cleancss({level :2}))
        .pipe(maps.write())
        .pipe(dest(path.build.style))
        .pipe(browsync.stream())
}

function js() {                             //JS file assembly
    return src(path.source.js)
        .pipe(concat('main.js'))
        .pipe(maps.init())
        .pipe(uglify())
        .pipe(maps.write())
        .pipe(dest(path.build.js))
        .pipe(browsync.stream())
}

function img() {                            //IMG file assembly 
    return src(path.source.img)
        .pipe(imagemin())
        .pipe(dest(path.build.img))
}

function del() {                            //Remove files from the build folders
    return src(path.clear)
        .pipe(clean())
}

function watching() {                        //Browsersync run and watching for changing files 
    browsync.init({
        server: {
            baseDir: "build"
        }});
    watch(path.source.html, html);
    watch(path.source.style, css);
    watch(path.source.js, js);
    watch(path.source.img, img);
}

task('del', del);                                                     //Task for clear build folder
task('start', series(del, parallel(html, css, js, img), watching));   //Task for build project
