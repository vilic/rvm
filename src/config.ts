import * as Path from 'path';

const HOME = process.env.HOME || process.env.USERPROFILE;

export const registry = 'https://raw.githubusercontent.com/vilic/rvm/registry';

export const rvmPath = Path.join(HOME, '.rvm');
export const downloadsPath = Path.join(rvmPath, 'downloads');
export const sdkPath = Path.join(rvmPath, 'sdk');

export const tagetPathMap: Dictionary<string> = {
    sdk: sdkPath
};
