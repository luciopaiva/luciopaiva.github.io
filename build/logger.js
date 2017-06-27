"use strict";

const
    chalk = require('chalk');


function info(message) {
    console.info('> '  + message);
}

function success(message) {
    console.info('> '  + chalk.green(message));
}

function error(message) {
    console.error('> '  + chalk.red(message));
}

function warning(message) {
    console.error('> '  + chalk.yellow(message));
}

module.exports = {
    info, success, error, warning
};
