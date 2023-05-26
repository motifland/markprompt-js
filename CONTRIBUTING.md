# Contributing

## Getting Started

To start working on Markprompt, see the GitHub _[Contributing to projects](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)_ documentation.

After cloning, you need to install dependencies using [npm](https://www.npmjs.com):

```sh
npm ci
```

Markprompt is linted using [ESLint](https://eslint.org) and [Prettier](https://prettier.io). It is type checked using [TypeScript](https://www.typescriptlang.org). To verify your changes, run:

```sh
npm run lint
```

When you open a pull request, this is also run by our GitHub Actions [ci workflow](./.github/workflows/ci.yml) to make sure all code conforms to the code quality standards.

You can format all code using the `prettier` command:

```sh
npx prettier --write .
```

Releases are managed using [Changesets](https://github.com/changesets/changesets). You need to add a changeset for changes that need a release. To add a changeset, run the following command, and follow the instructions from the command line:

```sh
npx changeset
```

Don’t forget to commit the generated changeset!

## Releasing

> **Note** This section is only for maintainers

Releases are managed using [Changesets](https://github.com/changesets/changesets). If there are any [changesets](./.changeset) present, Changesets will open a pull request. Merging this pull request will publish all updated packages to npm and create a GitHub release.
