import fs from 'fs-extra';
import cliProgress from 'cli-progress';
import { execSync } from 'child_process';
import { pkg } from './constants';

async function getDependencyVersions(dependencies: string[], version: string) {
    const bar = new cliProgress.SingleBar({
        format: 'Loading [{bar}] {percentage}% | {value}/{total} | {dependency}',
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true
    }, cliProgress.Presets.shades_classic);

    bar.start(dependencies.length, 0, { dependency: '' });

    const results = [];

    for (const dependency of dependencies) {
        let versions: string[] = [];

        try {
            versions = JSON.parse(
                execSync(`npm view ${dependency} versions --json`, { stdio: 'pipe' }).toString()
            );
        } catch (err) {
            console.error(`❌ Error fetching ${dependency}`);
            versions = [];
        }

        const isStable = version === 'stable';

        const filteredVersions = versions.filter(v => {
            const isPlugin = pkg.plugins.includes(dependency);
            const isModule = pkg.modules.includes(dependency);

            if (isPlugin) {
                return isStable
                    ? !v.includes('preview')
                    : dependency === '@minecraft/math'
                        ? true
                        : v.includes('preview');
            } else if (isModule) {
                return isStable ? v.includes('stable') : v.includes('preview');
            }
            return true;
        }).sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));

        results.push({
            name: dependency,
            choices: filteredVersions
        });

        bar.increment(1, { dependency });
    }

    bar.stop();

    return results;
}

export const getJsonFile = {
    manifest: () => fs.readJSON("manifest.json"),
    tsconfig: () => fs.readJSON("tsconfig.json"),
    package: () => fs.readJSON("package.json")
}

export default { getDependencyVersions, getJsonFile };