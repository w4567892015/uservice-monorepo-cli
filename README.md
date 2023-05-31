# uservice-monorepo-cli
[![ts-airbnb-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat)](https://github.com/iamturns/eslint-config-airbnb-typescript) [![test](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/w4567892015/uservice-monorepo-cli/branch/main/graph/badge.svg?token=DA8QWNVEBZ)](https://codecov.io/gh/w4567892015/uservice-monorepo-cli) [![CodeQL](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/codeql-analysis.yml) [![npm](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/w4567892015/uservice-monorepo-cli/actions/workflows/npm-publish.yml) [![npm version](https://badge.fury.io/js/@viewsonic-mvb%2Fuservice-monorepo-cli.svg)](https://badge.fury.io/js/@viewsonic-mvb%2Fuservice-monorepo-cli)

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

## Configuration

#### Get configuration
```
$ uservice config --get
```

#### Set configuration
```
$ uservice config --set OPENAI_URL=https://<url> OPENAI_KEY=<key>
```

#### Set OpenAI Response Language
```
$ uservice config --set LOCALE=en-US|zh-TW
```

## OpenAI Commit

#### Use OpenAI commits
```
$ uservice commits
```

If you want to edit the commit message. you can use the `git commit --amend` command.

#### Use OpenAI commit Preview
```
$ uservice commits --preview
```

## OpenAI Generate Unit Test File

#### Use OpenAI Unit Test
```
$ uservice tester -f <file path>
```

If you want to edit the commit message. you can use the `git commit --amend` command.

#### Use OpenAI Unit Test Preview
```
$ uservice tester --preview -f <file path>
```

## License

Licensed under [MIT](./LICENSE).
