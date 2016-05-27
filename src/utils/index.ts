import * as Chalk from 'chalk';

export function log(verb: string, ...objects: any[]): void {
    console.log(Chalk.green(verb), ...objects);
}
