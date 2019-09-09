let fs = require('fs');

exports.CheckFoldExist = function (path, isCreate) {
    if (!fs.existsSync(path)) {
        if (isCreate) {
            fs.mkdirSync(`${__filename}/${path}`);
        }
        return isCreate;
    }

    return true;
}