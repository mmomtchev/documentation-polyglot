import _ from 'lodash';
import * as path from 'path';

const defaultConfig = {
    extensions: [ '.cpp', '.c', '.cc', '.h', '.hpp' ]
};

const pluginConfig = defaultConfig;

export function init(config) {
    if (config['documentation-polyglot'])
        Object.assign(pluginConfig, config['documentation-polyglot']);
}

/**
 * Convert linear offset to a line:column position
 *
 * @param {string} text
 * @param {number} position
 */
function getPosition(text, position) {
    const line = (text.substring(0, position).match(/\n/g) || []).length + 1;
    const lastNewLine = text.substring(0, position).lastIndexOf('\n');
    const column = position - (lastNewLine !== -1 ? lastNewLine : 0) + 1;
    return { line, column };
}

/**
 * Dumb (no AST) extraction of the comments from a source file using RegExps
 *
 * @param {string} text
 * @returns {Array<Object>}
 */
function getComments(source) {
    if (typeof source !== 'string')
        throw new TypeError('getComments expects a string');
    const res = [];
    for (const comment of source.matchAll(
        /\/\*(\*\s(\*(?!\/)|[^*])*)\*\/\s*(.*)/g
    )) {
        const obj = {
            after: comment[3],
            api: comment[1].indexOf('@api') !== -1,
            start: comment.index,
            end: comment.index + comment[1].length,
            type: 'CommentBlock',
            value: comment[1],
            loc: {
                start: getPosition(source, comment.index + 1),
                end: getPosition(source, comment.index + 1 + comment[1].length)
            }
        };
        res.push(obj);
    }
    return res;
}

/**
 * Documentation stream parser: this receives a module-dep item,
 * reads the file, parses the code, parses the JSDoc, and
 * emits parsed comments.
 * @param sourceFile a chunk of data provided by module-deps
 * @param config documentation configuration
 * @param api documentation hooks
 * @return {Array<Object>} adds to memo
 */
export function parse(sourceFile, config, api) {
    if (!pluginConfig.extensions.includes(path.extname(sourceFile.file)))
        return false;

    return getComments(sourceFile.source)
        .filter(api.isJSDocComment)
        .map(comment => {
            const context = {
                loc: _.clone(comment.loc),
                file: sourceFile.file,
                sortKey: sourceFile.file + ' ' + comment.loc.start.line
            };
            return api.parseJSDoc(comment.value, comment.loc, context);
        });
}

/**
 * Is full dependency processing support for this type of file
 * 
 * @param {string} file 
 * @param config documentation configuration
 * @param api documentation hooks
 */
export function shallow(file, config, api) {
    if (pluginConfig.extensions.includes(path.extname(file)))
        return true;
    return false;
}