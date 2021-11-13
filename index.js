import {visit} from 'unist-util-visit';

function isHeader(node) {
  return (
    node.tagName === 'h1' ||
    node.tagName === 'h2' ||
    node.tagName === 'h3' ||
    node.tagName === 'h4' ||
    node.tagName === 'h5' ||
    node.tagName === 'h6'
  );
}

function gothrough(node, result) {
  for (let child of node.children) {
    if (child.type === 'text') result.text += child.value;
    else {
      if (child.children.length > 0) {
        gothrough(child, result);
      } else if (child.tagName === 'img') {
        result.text += child.properties.alt;
      }
    }
  }
}

function getPlainTextElem(text) {
  return {type: 'text', value: text};
}

function headerComparer(a, b) {
  let _a = parseInt(a[1]);
  if (b === undefined) {
    return _a;
  }
  let _b = parseInt(b[1]);
  return _a - _b;
}

function getIndex(node, count, prevHeader) {
  const comp = headerComparer(node.tagName, prevHeader.header);
  let idx = parseInt(node.tagName[1]);
  if (comp > 0) {
    while (idx++ < 7) {
      count[`h` + idx] = 0;
    }
  }
  prevHeader = {header: node.tagName};

  ++count[node.tagName];
  let result = '';
  let base = 1;
  idx = parseInt(node.tagName[1]);
  while (base <= idx) {
    if (result.length > 0) result += '.';
    result += count['h' + base];
    base++;
  }
  return result;
}

function addAnchorWithIndex(node, itemid, index) {
  node.children = [
    {
      type: 'element',
      tagName: 'a',
      children: [{type: 'text', value: index}],
      properties: {href: `#${index}-${itemid}`},
    },
    ...node.children,
  ];
}

function treecut(cur) {
  if (cur.children) {
    for (let index = cur.children.length - 1; index >= 0; index--) {
      const _cur = cur.children[index];
      if (isHeader(_cur)) continue;
      cur.children.splice(index, 1);
    }
  }
}

function modeIndex(tree) {
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
    node.children = [];
    addAnchorWithIndex(node, result.text, index);
    node.children.push(getPlainTextElem(result.text));
  });

  treecut(tree);
}

function modeDocs(tree) {
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
    node.properties.id = `${index}-${result.text}`;
  });
}

export default function headerIndexing(config) {
  if (config === undefined || config.mode === 'index') return modeIndex;
  if (config.mode === 'document') return modeDocs;
  return modeIndex;
}
