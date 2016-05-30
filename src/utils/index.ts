import * as Path from 'path';

import * as Chalk from 'chalk';
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

export function warn(...objects: any[]) {
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
