import * as Path from 'path';
import * as Tmp from 'tmp';

import { ExpectedError } from 'clime';
import Promise from 'thenfail';
import * as FS from 'fs-extra';
import * as extract from 'extract-zip';
import * as fetch from 'node-fetch';
import match from 'semver-match';

import * as config from '../config';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export type PackageType = 'sdk';

export interface Distribution extends RawDistribution {
    platform: string;
}

export interface RawDistribution {
    format: string;
    url: string;
    strip: number;
}

export interface PackageMetadata {
    version: string;
    dist: Distribution;
}

export interface RawPackageMetadata {
    dists: Dictionary<RawDistribution>;
}

export interface VersionsData {
    tags: Dictionary<string>;
    packages: Dictionary<RawPackageMetadata>;
}

export function getPackageMetadata(range = '*'): Promise<PackageMetadata> {
    let versionsUrl = `${config.registry}/sdks.json`;

    return Promise
        .resolve(fetch(versionsUrl))
        .then(res => res.json<VersionsData>())
        .then(data => {
            let { tags, packages } = data;
            let versions = Object.keys(packages);

            let version = match(range, versions, tags);

            if (!version) {
                throw new ExpectedError(`No matching version found for "${range}"`);
            }

            let { dists } = packages[version];
            let priorPlatformName = `${process.platform}-${process.arch}`

            let possiblePlatformNames = [
                priorPlatformName,
                process.platform
            ];

            let dist: Distribution;
            let platformName: string;

            for (let platformName of possiblePlatformNames) {
                if (hasOwnProperty.call(dists, platformName)) {
                    let rawDist = dists[platformName];

                    dist = {
                        platform: platformName,
                        format: rawDist.format,
                        url: rawDist.url,
                        strip: rawDist.strip
                    };

                    break;
                }
            }

            if (!dist) {
                throw new ExpectedError(`No matching distribution package found for platform "${priorPlatformName}"`);
            }

            return {
                version,
                dist
            };
        });
}

export function downloadPackage(type: PackageType, metadata: PackageMetadata): Promise<string> {
    let { version, dist: { platform, format, url } } = metadata;

    let packageBaseName = `${type}-${version}-${platform}`
    let packageName = `${packageBaseName}.${format}`;
    let metadataFileName = `${packageBaseName}.json`;

    let packagePath = Path.join(config.downloadsPath, packageName);
    let metadataFilePath = Path.join(config.downloadsPath, metadataFileName);

    if (FS.existsSync(packagePath) && FS.existsSync(metadataFilePath)) {
        return Promise.resolve(packagePath);
    }

    let tmpPackagePath = Tmp.tmpNameSync();

    return Promise
        .resolve(fetch(url))
        .then(res => {
            let resStream = res.body;
            let writeStream = FS.createWriteStream(tmpPackagePath);

            resStream.pipe(writeStream);

            return Promise.for(writeStream, 'close', [resStream]);
        })
        .then(() => {
            FS.copySync(tmpPackagePath, packagePath);

            let metadataJSON = JSON.stringify(metadata, undefined, 4);
            FS.writeFileSync(metadataFilePath, metadataJSON);

            return packagePath;
        });
}

export function extractPackage(type: PackageType, packagePath: string): Promise<void> {
    let targetPath = config.tagetPathMap[type];
    FS.removeSync(targetPath);

    let metadataFilePath = `${packagePath.replace(/\.\w+$/, '')}.json`;
    let metadata: PackageMetadata = require(metadataFilePath);

    return Promise.invoke<void>(extract, packagePath, ({
        dir: targetPath,
        strip: metadata.dist.strip
    } as extract.Options));
}
