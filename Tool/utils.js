const chalk = require('chalk');

var utils = {

    isdebug: true,

    error (str) {
        if (!this.isdebug) return;
        console.log(chalk.red.underline(str));
    },

    log (str) {
        if (!this.isdebug) return;
        console.log(chalk.green(str));
    },

    pass (str) {
        if (!this.isdebug) return;
        console.log(chalk.bgGreenBright(str));
    },

    warn (str) {
        if (!this.isdebug) return;
        console.log(chalk.yellow(str));
    }
}

module.exports = utils;