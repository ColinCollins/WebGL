let fs = require('fs');

exports.checkFoldExist = function (path, isCreate) {
    if (!fs.existsSync(path)) {
        if (isCreate) {
            fs.mkdirSync(`${__filename}/${path}`);
        }
        return isCreate;
    }

    return true;
}