// Copyright 2019-2022 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fflate = require('fflate/node');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { formatNumber } = require('@polkadot/util');

const data = fs.readFileSync(`./${process.env.PKG_NAME}/build-wasm/wasm_opt.wasm`);
const compressed = Buffer.from(fflate.zlibSync(data, { level: 9 }));
const denoDir = `./${process.env.PKG_NAME}-wasm/build-deno/deno`;

console.log(`*** Compressed WASM: ${formatNumber(data.length)} -> ${formatNumber(compressed.length)} (${(100 * compressed.length / data.length).toFixed(2)}%)`);

mkdirp.sync(denoDir);

fs.writeFileSync(`./${process.env.PKG_NAME}-wasm/build/cjs/bytes.js`, `// Copyright 2019-${new Date().getFullYear()} @polkadot/${process.env.PKG_NAME}-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit

const sizeCompressed = ${compressed.length};
const sizeUncompressed = ${data.length};
const bytes = '${compressed.toString('base64')}';

module.exports = { bytes, sizeCompressed, sizeUncompressed };
`);

fs.writeFileSync(`${denoDir}/bytes.js`, `// Copyright 2019-${new Date().getFullYear()} @polkadot/${process.env.PKG_NAME}-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit

export const sizeCompressed = ${compressed.length};

export const sizeUncompressed = ${data.length};

export const bytes = '${compressed.toString('base64')}';
`);
