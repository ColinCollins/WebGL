const gulp = require('gulp');
const fse = require('fs-extra');
const fs = require('fs');
const program = require('commander');
const utils = require('./Tool/utils');
const globby = require('globby');
const { parse } = require('path');
const  child_process = require('child_process');
const del = require('del');

program
    .option('-f, --fold <names>', 'Create a new Chapter fold or specified the inputFold')
    .option('-b, --brunch <name>', 'Using the browserify build a js file')
    .option('-t, --test [fileNames]', 'Test file names', test, [])
    .option('-o, --optionsBrowserify <str>', 'browserify transfrom to package require, Optionally use a colon separator to set the target.')
    .option('-d, --developer [flag]', 'Development mode')
    .parse(process.argv);

const WEBGL_PROJECT_TEMPLATE_PATH = './Template/build-template/';
const OPENGL_PROJECT_TEMPLATE_PATH = './Template/opengl-template/';

function test (value, memo) {
    memo.push(value);
    return memo;
}

gulp.task('test', function (done) {
    let tests = program.test;
    console.log(tests);
    done();
});
// #region webgl project template
gulp.task('default', function (done) {
    var foldName = program.fold;
    var developer = program.developer;
    let dist = `./${foldName}`
    if (!foldName) {
        utils.error('Can\'t find fold name.');
        return;
    }
    if (fs.existsSync(dist)) {
        utils.warn('fold already exists');
        if (!developer)  return;
        del.sync([`${parse(dist).base}/**`], {
            force: true
        });
    }
    fs.mkdirSync(dist);

    let files = globby.sync(`${WEBGL_PROJECT_TEMPLATE_PATH}*`, {
        expandDirectories: {
            extensions: ['.js']
        }
    });
    files.forEach((file) => {
        let parser = parse(file);
        let ext = parser.ext;
        let name = parser.name;
        // 清除多余的注释部分
        if (name === 'template') {
            let jsRes = fs.readFileSync(file, 'utf8');
            if (ext === '.js') {
                // \r\n window 烦躁。。。。
                let regex = new RegExp(/\/\/\sREGION\wSTART(.|\r\n)*\/\/\sREGION\wEND/, 'gm');
                jsRes = jsRes.replace(regex, '');
            }
            fse.outputFileSync(dist + `/index.js`, jsRes);
        }
        else {
            let desPath = dist + '/' + name + ext;
            // copy file will not create the relative fold into the new path
            fs.copyFileSync(file, desPath);
        }
    });

    let result = fs.readFileSync(WEBGL_PROJECT_TEMPLATE_PATH + '/template.html', 'utf8');
    result = result.replace(/{foldName}/g, `package.js`);
    fse.outputFileSync(`${dist}/${foldName}.html`, result);
    // creator-api-docs 使用的是 gulp.dest 流水线进行文件拷贝，下次可以尝试一下。
    fse.copy(`${WEBGL_PROJECT_TEMPLATE_PATH}/lib`, `${dist}/lib`)
    .then(() => {
        utils.pass('Copy lib finished.');
        done();
    }).
    catch((err) => {
        utils.error(err);
    });
});
// #endregion

// #region learn opengl project template
gulp.task('openglProject', (done) => {
    var foldName = program.fold;
    var developer = program.developer;

    let dist = `./openglProject/${foldName}`;
    if (!foldName) {
        utils.error('Can\'t find fold name.');
        return;
    }
    if (fs.existsSync(dist)) {
        utils.warn('fold already exists');
        if (!developer)  return;
        del.sync([`${dist}/**`], {
            force: true
        });
    }
    fs.mkdirSync(dist);
    // copy all js file to dest
    let files = globby.sync(`${OPENGL_PROJECT_TEMPLATE_PATH}*`, {
        expandDirectories: {
            extensions: ['.js']
        }
    });

    files.forEach((file) => {
        let parser = parse(file);
        let ext = parser.ext;
        let name = parser.name;
        let desPath = dist + '/' + name + ext;
        fs.copyFileSync(file, desPath);
    });

    // copy html file
    let result = fs.readFileSync(OPENGL_PROJECT_TEMPLATE_PATH + '/template.html', 'utf8');
    result = result.replace(/{foldName}/g, `package.js`);
    fse.outputFileSync(dist + `/${foldName}.html`, result);

    // copy lib fold and glsl fold
    fse.copy(`${OPENGL_PROJECT_TEMPLATE_PATH}/lib`, `${dist}/lib`)
    .then(() => {
        utils.pass('data lib finished.');
        fse.copy(`${OPENGL_PROJECT_TEMPLATE_PATH}/glsl`, `${dist}/glsl`)
        .then(() => {
            utils.pass('data glsl finished.');
            done();
        })
    }).
    catch((err) => {
        utils.error(err);
    });
});

// #endregion

// transform the script to the useful file
gulp.task('br', function (done) {
    console.log(__dirname);
    var foldName = program.fold;
    var developer = program.developer;
    var requires = program.optionsBrowserify;

    let src = `./${foldName}`
    if (!foldName) {
        utils.error('Can\'t find fold name.');
        return;
    }
    // develop controll whether delete the package.js
    if (fs.existsSync(`${src}/package.js`)) {
        if (developer) {
            del.sync([`${src}/package.js`], {
                force: true
            });
            utils.pass('delete success');
        }
    }
    let reArray = [];
    if (requires && requires.length > 0) {
        reArray = ['-r', requires];
    }

    let command = [`${src}/index.js`, '-o', `${src}/package.js`];
    command = command.concat(reArray);
    let ls = child_process.spawn(`watchify`, command, {
        cwd: process.cwd(),
        env: process.env,
        shell: true
    });

    ls.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    ls.stdout.on('close', (code) => {
        done();
        console.log('code: ' + code);
    });

    ls.stderr.on('data', (data) => {
        console.log(data.toString("utf8"));
    });

});