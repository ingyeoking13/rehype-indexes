export function isHeader(node) {
  return (
    node.tagName === 'h1' ||
    node.tagName === 'h2' ||
    node.tagName === 'h3' ||
    node.tagName === 'h4' ||
    node.tagName === 'h5' ||
    node.tagName === 'h6'
  );
}

export function isIndexMode(mode) {
  return mode === undefined || mode === 'index';
}

export function gothrough(node, result) {
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

export function getPlainTextElem(text) {
  return {type: 'text', value: text};
}

export function headerComparer(a, b) {
  let _a = parseInt(a[1]);
  if (b === undefined) {
    return _a;
  }
  let _b = parseInt(b[1]);
  return _a - _b;
}

export function getIndex(node, count, prevHeader) {
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
  let base = 0;
  idx = parseInt(node.tagName[1]);
  while (++base <= idx) {
    if (result.length > 0) result += '.';
    result += count['h' + base];
  }
  return result;
}

export function addAnchorWithIndex(node, itemid, index) {
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

export function treecut(cur) {
  if (cur.children) {
    cur.children = cur.children.filter((child) => isHeader(child));
  }
}
