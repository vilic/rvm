import * as Path from 'path';

import * as Chalk from 'chalk';
import Promise from 'thenfail';

import {
    Command,
    Options,
    command,
    option,
    param
} from 'clime';

import {
    getPackageMetadata,
    downloadPackage,
    extractPackage
} from '../core';

import {
    log,
    warn,
    checkPath,
    copyNpmBin
} from '../utils';

import * as config from '../config';

export class InstallOptions extends Options {
    @option({
        flag: 'l',
        description: 'Install Ruff SDK into local `.ruff` folder.',
        toggle: true
    })
    local: boolean;
}

@command({
    description: 'Install Ruff SDK on this computer.'
})
export default class extends Command {
    execute(
        @param({
            name: 'version',
            description: 'Version of the Ruff SDK to install.'
        })
        range: string,

        options: InstallOptions
    ) {
        log('FETCHING', 'SDK package metadata...');

        let version: string;
        let targetPath = options.local ? Path.resolve('.ruff') : config.sdkPath;

        return getPackageMetadata(range)
            .then(metadata => {
                version = metadata.version;
                log('DOWNLOADING', `SDK package (version ${version})...`);

                return downloadPackage('sdk', metadata);
            })
            .then(packagePath => {
                log('EXTRACTING', 'SDK package...');
                return extractPackage('sdk', packagePath, targetPath);
            })
            .then(() => {
                if (options.local) {
                    return this.copyNpmBin();
                } else {
                    return this.checkPath();
                }
            })
            .then(() => log(`Ruff SDK (version ${version}) has been successfully installed.`));
    }

    private copyNpmBin(): Promise<void> {
        log('COPYING', 'executable scripts to `node_modules/.bin`...');
        return copyNpmBin();
    }

    private checkPath(): Promise<void> {
        log('CHECKING', '`PATH` environment variable...');
        return checkPath('sdk')
            .then(pathConfigured => {
                if (!pathConfigured) {
                    log(Chalk.yellow(`\
It seems that environment variable \`PATH\` has not yet been configured, please refer to the link below for how:
  https://ruff.io/zh-cn/docs/environment-variables.html
You might need the SDK path to walk through the configuration steps:
  ${config.sdkPath}`));
                }
            });
    }
}
