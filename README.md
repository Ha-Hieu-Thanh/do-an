## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Tip .env

git rm --cached .env
git add .gitignore
git commit -m "Remove .env from Git history and update .gitignore"
git push

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Step create project

npm install -g @nestjs/cli

- nest new common
- nest generate app client
- nest generate lib config
- setup configuration

## Use

- run create resource ( module, service, controller)
  nest g res app
- run create module
  nest g mo app
- run create service
  nest g s cats
- nest g library my-library
