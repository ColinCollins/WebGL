let globby = require('globby');

const resPath = `${__dirname}/res`;

// image

exports.imagesInit = false;
// need callback
exports.preloadImagesPath = function preloadImagesRes () {
    imagesRes = globby.sync([`${resPath}/**/*.png`, `${resPath}/**/*.jpg`], {
        absolute: true
    });
}


exports.textsInit = false;
// ----

exports.shaderInit = false;