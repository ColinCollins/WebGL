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

gulp.task('default', function () {
    var foldName = program.fold;
    if (!foldName) {
        utils.error('Can\'t find fold name.');
        return;
    }
    if (fs.existsSync(`./${foldName}`)) {
        utils.warn('fold already exists');
        return;
    }
    else {
        fs.mkdirSync(`./${foldName}`);
    }

    let result = fs.readFileSync('./build-templete/templete.html', 'utf8');
    result = result.replace(/{foldName}/g, foldName);

    fse.outputFileSync(`./${foldName}/${foldName}.html`, result);
    fse.copy('./build-templete/lib', `./${foldName}/lib`)
    .then(() => {
        fse.writeFileSync(`./${foldName}/${foldName}.js`, '');
    }).
    catch((err) => {
        utils.error(err);
    });
});
// brwoserify
gulp.task();