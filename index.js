import {visit} from 'unist-util-visit';
import {
  isHeader,
  isIndexMode,
  treecut,
  addAnchorWithIndex,
  getIndex,
  getPlainTextElem,
  gothrough,
} from './lib';

function indexes(tree, {mode = undefined}) {
  let count = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  };
  let prevHeader = {};
  visit(tree, '', (node) => {
    if (isHeader(node) === false) return;
    let result = {text: ''};
    gothrough(node, result);
    let index = getIndex(node, count, prevHeader);
    if (isIndexMode(mode)) {
      node.children = [];
      addAnchorWithIndex(node, result.text, index);
      node.children.push(getPlainTextElem(result.text));
    } else node.properties.id = `${index}-${result.text}`;
  });

  if (isIndexMode(mode)) treecut(tree);
}

export default function headerIndexing(config) {
  return function (tree) {
    config = config || {};
    indexes(tree, config);
  };
}
