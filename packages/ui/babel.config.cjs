/** Babel config used ONLY by jest (babel-jest) to convert the repo's ESM
 *  sources to CJS. Never affects the build (script/build.mjs copies sources
 *  verbatim) or lint. */
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
