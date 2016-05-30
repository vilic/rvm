import * as Path from 'path';

const HOME = process.env.HOME || process.env.USERPROFILE;
const EXEC_EXT = process.platform === 'win32' ? '.exe' : '';

export const registry = 'https://raw.githubusercontent.com/vilic/rvm/registry';

export const rvmPath = Path.join(HOME, '.rvm');
export const downloadsPath = Path.join(rvmPath, 'downloads');
export const sdkPath = Path.join(rvmPath, 'sdk');
export const sdkBinPath = Path.join(sdkPath, 'bin');

export const targetPathMap: Dictionary<string> = {
    sdk: sdkPath
};

export const ruffExecName = `ruff${EXEC_EXT}`;
export const rapExecName = `rap${EXEC_EXT}`;

export const ruffExecPath = Path.join(sdkBinPath, ruffExecName);
export const rapExecPath = Path.join(sdkBinPath, rapExecName);
