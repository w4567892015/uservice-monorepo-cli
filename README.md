# uservice-monorepo-cli
[![ts-airbnb-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat)](https://github.com/iamturns/eslint-config-airbnb-typescript) [![test](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/w4567892015/uservice-monorepo-cli/branch/main/graph/badge.svg?token=DA8QWNVEBZ)](https://codecov.io/gh/w4567892015/uservice-monorepo-cli) [![CodeQL](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/codeql-analysis.yml) [![npm](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/npm-publish.yml) [![npm version](https://badge.fury.io/js/@viewsonic-mvb%2Fpino-fluentd.svg)](https://badge.fury.io/js/@viewsonic-mvb%2Fpino-fluentd)

The monorepo cli tools.

## Install

```
npm install -g @viewsonic-mvb/uservice-monorepo-cli
```

## Usage as CLI

## Get help
```
$ uservice --help
```

## OpenAI Commit

#### Use OpenAI commits
```
$ uservice aicommits
```

#### Use OpenAI commit preview
```
$ uservice aicommits --preview
```

#### Get OpenAI configuration
```
$ uservice aicommits config --get
```

#### Set OpenAI configuration
```
$ uservice aicommits config --set OPENAI_URL=https://<url> OPENAI_KEY=<key>
```

## License

Licensed under [MIT](./LICENSE).
