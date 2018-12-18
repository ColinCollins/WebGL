const gulp = require('gulp');
const fse = require('fs-extra');
const fs = require('fs');
const program = require('commander');
const utils = require('./Tool/utils');
// copy the lib into a new fold

program
    .option('-f, --fold <names>', 'Create a new Chapter fold')
    .option('-b, --brunch <name>', 'Using the browserify build a js file')
    .parse(process.argv);

gulp.task('default', function (done) {
    var foldName = program.fold;
    let dist = `./${foldName}`
    if (!foldName) {
        utils.error('Can\'t find fold name.');
        return;
    }
    if (fs.existsSync(dist)) {
        utils.warn('fold already exists');
        return;
    }
    else {
        fs.mkdirSync(dist);
    }

    let path = './build-templete/templete';
    let result = fs.readFileSync(path + '.html', 'utf8');
    result = result.replace(/{foldName}/g, foldName);
    fse.outputFileSync(dist + `/${foldName}.html`, result);

    let jsRes = fs.readFileSync(path + '.js', 'utf8');
    fse.outputFileSync(dist + `/${foldName}.js`, jsRes);

    fse.copy('./build-templete/lib', dist + `/lib`)
    .then(() => {
        utils.pass('Copy lib finished.');
        done();
    }).
    catch((err) => {
        utils.error(err);
    });
});
// brwoserify
//gulp.task();