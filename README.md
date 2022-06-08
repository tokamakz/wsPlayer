## @run/ws-player
[![Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli)

> Starter wsPlayer to use component for vue.js 2-3

## Features
- Faster by default: [vite](https://github.com/vitejs/vite), [vue](https://github.com/vuejs/vue-next), [pnpm](https://github.com/pnpm/pnpm), [esbuild](https://github.com/evanw/esbuild)
- Typescript, of course
- Testing: [vitest](https://vitest.dev/)
- Git custom hooks: [husky](https://github.com/typicode/husky)
- Commit conventions: [commitizen](https://github.com/commitizen/cz-cli)
- Linters: [commitlint](https://github.com/conventional-changelog/commitlint), [eslint](https://github.com/eslint/eslint), [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- CI/CD: [github actions](https://github.com/features/actions)

## Requirement
  - [node.js](http://nodejs.org/)
  - [volta](https://docs.volta.sh/guide/getting-started)
  - [pnpm](https://pnpm.js.org/en/installation)
  - [encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Getting Started

```bash
# clone repository
$ git clone git@github.com:rwerplus/wsPlayer.git dev

# open folder
$ cd wsPlayer

# install packages
$ pnpm install

# build and serve with vite dev server
$ pnpm dev
```

And, enjoy ;/

## Publish to NPM
Make sure you have added the `GIT_TOKEN` and `NPM_TOKEN` encrypted secrets

```bash
# tag git history
$ git tag v0.0.1 -m 'v0.0.1'

# push tag to git
$ git push origin --tags
```

## Usage
### Setup
Vue 3
```js
import { createApp } from 'vue'
import HelloWorld from '@run/ws-player'
import App from './app.vue'

const app = createApp(App)
app.use(HelloWorld)
```

Vue 2
```js
import Vue from 'vue'
import CompositionAPI from '@vue/composition-api'
import HelloWorld from '@run/ws-player'

Vue.use(CompositionAPI)
Vue.use(HelloWorld)
```

### Basic Usage
```html
<template>
  <hello-world />
</template>
```
[Demo →](https://stackblitz.com/edit/vitejs-vite-e7qhxx?file=src%2FApp.vue)

## Cheer me on
If you like my works, you can cheer me 😆

## License
MIT License © 2022 Randall Wang
