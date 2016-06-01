import * as Path from 'path';

import * as Chalk from 'chalk';
import * as FS from 'fs-extra';
import Promise from 'thenfail';
import * as which from 'which';

import { PackageType } from '../core';
import * as config from '../config';

interface PackageData {
    bin: string;
}

export function log(verb: string, ...objects: any[]): void {
    if (/^[A-Z]+$/.test(verb)) {
        verb = Chalk.green(verb);
    }

    console.log(verb, ...objects);
}

export function warn(...objects: any[]): void {
    console.log(Chalk.yellow('WARN'), ...objects);
}

export function checkPath(type: PackageType): Promise<boolean> {
    if (type !== 'sdk') {
        throw new TypeError(`Project type "${type}" is not supported`);
    }

    return Promise
        .invoke<string>(which, config.rapExecName)
        .then(path => Path.relative(path, config.rapExecPath) === '', () => false);
}

export function copyNpmBin(): Promise<void> {
    let npmBinTemplateDirPath = Path.join(__dirname, '../../templates/npm-bin');
    let npmBinDirPath = Path.resolve('./node_modules/.bin');

    return Promise.invoke<void>(FS.copy, npmBinTemplateDirPath, npmBinDirPath);
}
