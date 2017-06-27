"use strict";

const
    path = require('path'),
    fs = require('fs');


const directoryStack = [];

function pushd(directory) {
    directoryStack.push(process.cwd());
    process.chdir(directory);
}

function popd() {
    const destination = directoryStack.pop();
    process.chdir(destination);
}

/**
 * @async
 * @param source
 * @param target
 * @returns {Promise}
 */
function copyFile(source, target) {
    return new Promise((resolve, reject) => {
        function rejectCleanup(err) {
            input.destroy();
            output.end();
            reject(err);
        }

        const input = fs.createReadStream(source);
        const output = fs.createWriteStream(target);

        input.on('error', rejectCleanup);
        output.on('error', rejectCleanup);

        output.on('finish', resolve);
        input.pipe(output);
    });
}

/**
 * Copies a folder and its files recursively.
 * @async
 * @param {string} sourcePath - source folder (e.g.: /foo/bar)
 * @param {string} targetPath - destination folder (e.g.: /fizz - will create /fizz/bar and any files and subdirs)
 */
async function copyRecursive(sourcePath, targetPath) {
    // console.debug(`Copying from ${sourcePath} to ${targetPath}`);
    if (fs.existsSync(sourcePath)) {
        targetPath = path.join(targetPath, path.basename(sourcePath));
        // console.debug(`"${sourcePath}" exists and target is "${targetPath}"`);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            // console.debug(`${sourcePath} is a directory`);
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
                // console.debug('creating directory ' + targetPath);
            }
            const fileNames = fs.readdirSync(sourcePath);
            for (const fileName of fileNames) {
                const curPath = path.join(sourcePath, fileName);
                await copyRecursive(curPath, targetPath);
            }
        } else {
            // console.debug(`${sourcePath} is a file`);
            await copyFile(sourcePath, targetPath);
        }
    }
}

/**
 * Recursively deletes directory and all its files and subdirectories.
 * Adapted from https://stackoverflow.com/a/32197381/778272.
 * @param {string} path - the directory to remove
 */
function removeDirectory(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = path + "/" + file;
            fs.lstatSync(curPath).isDirectory() ? removeDirectory(curPath) : fs.unlinkSync(curPath);
        });
        fs.rmdirSync(path);
    }
}

module.exports = {
    pushd, popd, copyFile, removeDirectory, copyRecursive
};
