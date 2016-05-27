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
    log
} from '../utils';

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

        return getPackageMetadata(range)
            .then(metadata => {
                log('DOWNLOADING', `SDK package (version ${metadata.version})...`);

                return downloadPackage('sdk', metadata);
            })
            .then(packagePath => {
                log('EXTRACTING', 'SDK package...');
                return extractPackage('sdk', packagePath);
            });
    }
}
