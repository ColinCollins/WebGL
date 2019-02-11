const gulp = require('gulp');
const fse = require('fs-extra');
const fs = require('fs');
const program = require('commander');
const utils = require('./Tool/utils');
const globby = require('globby');
const { parse } = require('path');
const del = require('del');

const browserify = require('browserify');
// copy the lib into a new fold

program
    .option('-f, --fold <names>', 'Create a new Chapter fold')
    .option('-b, --brunch <name>', 'Using the browserify build a js file')
    .option('-d, --developer [flag]', 'Development mode')
    .parse(process.argv);

const path = './build-templete/';

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

    let files = globby.sync(`${path}*`, {
        expandDirectories: {
            extensions: ['.js']
        }
    });
    files.forEach((file) => {
        let parser = parse(file);
        let ext = parser.ext;
        let name = parser.name;
        if (name === 'templete') {
            let jsRes = fs.readFileSync(file, 'utf8');
            fse.outputFileSync(dist + `/${foldName}.js`, jsRes);
        }
        else {
            let desPath = dist + '/' + name + ext;
            // copy file will not create the relative fold into the new path
            fs.copyFileSync(file, desPath);
        }
    });

    let result = fs.readFileSync(path + '/templete.html', 'utf8');
    result = result.replace(/{foldName}/g, foldName);
    fse.outputFileSync(dist + `/${foldName}.html`, result);
    // creator-api-docs 使用的是 gulp.dest 流水线进行文件拷贝，下次可以尝试一下。
    fse.copy('./build-templete/lib', dist + `/lib`)
    .then(() => {
        utils.pass('Copy lib finished.');
        done();
    }).
    catch((err) => {
        utils.error(err);
    });
});
// transform the script to the useful file
gulp.task('transform', function () {
    var foldName = program.fold;
    var developer = program.developer;
    let src = `./${foldName}`
    if (!foldName) {
        utils.error('Can\'t find fold name.');
        return;
    }


});