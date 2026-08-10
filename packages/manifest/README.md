# @tailor-cms/ce-embed-manifest

Shared element definition for the **Embed** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Declares the element type, display name, UI configuration and initial state. The authoring, end-user and server packages all build on it, so it is the only package that has to be understood to know what the element *is*.

## Installation

```sh
npm install @tailor-cms/ce-embed-manifest
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import manifest, { type ElementData } from '@tailor-cms/ce-embed-manifest';

manifest.type;       // 'EMBED'
manifest.initState(); // initial element data
```

## Element

| Property | Value |
| --- | --- |
| Name | Embed |
| Type | `EMBED` |
| Icon | [`mdi-application-brackets`](https://pictogrammers.com/library/mdi/) |
| Composite | No |

## Packages

This element ships as four packages, published together from the
[`ce-embed`](https://github.com/tailor-cms/ce-embed) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-embed-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-embed-manifest) | Shared element definition |
| [`@tailor-cms/ce-embed-edit`](https://www.npmjs.com/package/@tailor-cms/ce-embed-edit) | Authoring component |
| [`@tailor-cms/ce-embed-display`](https://www.npmjs.com/package/@tailor-cms/ce-embed-display) | End-user component |
| [`@tailor-cms/ce-embed-server`](https://www.npmjs.com/package/@tailor-cms/ce-embed-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
