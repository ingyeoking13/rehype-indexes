# rehype-indexes

header index library for rehype

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install rehype-indexes
```

this library is intended to support react-markdown interactively. as named indexes, It supports `heading` tag to have suffix index number with `anchor` tag.

## Use

following source code shows how to use with `react-markdown`.

```js
import rehypIndex from 'rehype-indexes';

///... for index
<ReactMarkDown rehypePlugins={[[rehypeIndex, {mode: 'index'} ]]}>
{text}
</ReactMarkDown>

///... for origin document
<ReactMarkDown rehypePlugins={[[rehypeIndex, {mode: 'document'}]]}>
{text}
</ReactMarkDown>
```

## Options

`{mode: 'index'}` or non-option.

- works for index.
- It remove all non-heading tags exclude tags inside heading tag. (! you don't need to remove non-heading tag by yourself.)
- It appends anchor tag 1 based.
- anchor tag has link to document heading id.

`{mode: 'document'}`

- works for document.
- It add id tag to heading.

## Related

- [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
  — Recursively walk over nodes
- [`react-markdown`](https://github.com/remarkjs/react-markdown) — Mainly targeted.

## Contribute

All contributes are wellcome! 😀

## License

[MIT][license] © Jeong Yo Han
