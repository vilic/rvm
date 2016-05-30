import * as Chalk from 'chalk';

import {
    Command,
    command,
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
    checkPath
} from '../utils';

import * as config from '../config';

@command({
    description: 'Install Ruff SDK on this computer.'
})
export default class extends Command {
    execute(
        @param({
            name: 'version',
            description: 'Version of the Ruff SDK to install.'
        })
        range: string
    ) {
        log('FETCHING', 'SDK package metadata...');

        let version: string;

        return getPackageMetadata(range)
            .then(metadata => {
                version = metadata.version;
                log('DOWNLOADING', `SDK package (version ${version})...`);

                return downloadPackage('sdk', metadata);
            })
            .then(packagePath => {
                log('EXTRACTING', 'SDK package...');
                return extractPackage('sdk', packagePath);
            })
            .then(() => {
                log('CHECKING', '`PATH` environment variable...');
                return checkPath('sdk');
            })
            .then(pathConfigured => {
                if (!pathConfigured) {
                    log(Chalk.yellow(`\
It seems that environment variable \`PATH\` has not yet been configured, please refer to the link below for how:
  https://ruff.io/zh-cn/docs/environment-variables.html
You might need the SDK path to walk through the configuration steps:
  ${config.sdkPath}`));
                }

                log(`Ruff SDK (version ${version}) has been successfully installed.`);
            });
    }
}
