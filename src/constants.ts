export const pkg = {
    modules: ['@minecraft/server', '@minecraft/server-ui', '@minecraft/server-net', '@minecraft/server-admin', '@minecraft/server-gametest'],
    plugins: ['@minecraft/vanilla-data', '@minecraft/math'],
    addons: ['@mxbe/database', '@mxbe/scoreboard'],
    compiler: ['ts-loader', 'webpack', 'webpack-cli', 'typescript',
        '@mxbe/common'
    ],
};

export default { pkg };