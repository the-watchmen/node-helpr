# node-helpr

miscellaneous helper functions

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![build status](https://github.com/the-watchmen/node-helpr/actions/workflows/release.yaml/badge.svg)](https://github.com/the-watchmen/node-helpr/actions)
[![npm (scoped)](https://img.shields.io/npm/v/@watchmen/helpr.svg)](https://www.npmjs.com/package/@watchmen/helpr)

> see [tests](test) for examples

## usage

* `npm i @watchmen/helpr`
* `import {...} from '@watchmen/helpr'`

### opt-ins

1. `args`
1. `cache-manager`
1. `joi-helper`
1. `debug`

> * imported like: `import {...} from '<package name>/dist/<file name>'`
> * certain components are made opt-in to avoid dependency bloat when not being used
> * opt-ins will require that [`peerDependencies`](https://docs.npmjs.com/files/package.json#peerdependencies) are provided by consumer

## development

1. `git clone {repo name}`
1. `cd {repo name}`
1. `npm i`
1. `npm test`
