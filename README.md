### Usage
```
yarn install
```

- Dev mode
```
yarn watch:dev
yarn server:dev
```
give permission for husky
```
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```


### Processing
- 23/07/2023: 1st
+ Node version: **16.20.0**
+ Settup project with webpack
  + Need wepback to use alias in typescript project after build.
+ Fix error enviroment can't load
  + Using dotenvwpack in webackconfig to load environment
+ Code structure with MVC pattern
  + https://www.youtube.com/watch?v=x2xkzvG1NDg
    + BigInt -> let compare number more safe when that number exceed the maximum number
    + Nummber: 9_000_000
  + Mongo pattern
    + Model nest set: https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-nested-sets/
    + 
--------------------
inistal middlewae :
  - dev dependency
    - morgan: http request logger -> write down request log.
    - helmet: hide technique that use in our projet
    - compressiion: reduce response data size -> increase performance -> https://www.youtube.com/watch?v=bIFq0fxNLoE
    - usefull package: https://www.becomebetterprogrammer.com/how-to-use-third-party-middleware-with-express-js-and-typescript/
    - cors: https://www.npmjs.com/package/cors#configuring-cors
- --------------

  
Issues
- eslint???
- log folder is not working ???


## 1. Setup

1. install library
2. set rule for typescript

   ```
   npx tsc --init
   ```

   in tsconfig.json

3. For Dev we need to run to script below

```
yarn watch : => to tracking and compile ts to js
yarn dev : => to run node server after being compled in js
```

4. setup prettier

- .prettierrc file : content in pretter play ground

* ctrl shift p: to set up format type in vscode

  win: shift alt f

  ubuntu: ctrl shift i

-

```
yarn add -D prettier
```

add **.pretterignore** file to ignore some file that don't need to format

5. husky

- pre-comit
- comit-msg

```
git init -> in pre configure
yarn add husky -D
npx mrm@2 lint-staged -> to rewrite after format code 'git add .' with pretter
```

convention checking for git commit message

```
yarn add @commitlint/config-conventional @commitlint/cli
```

then create and copy content file commitlint.config.js to write rule of commit
next, we enable husky commit message

```
yarn husky add .husky/commit-msg 'yarn commitlint --edit $1'
or
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
```

rules document: https://commitlint.js.org/#/reference-rules

6. setup engine to only run yarn
- create file .nvmrc
```
node -v > .nvmrc
```
- create file .npmrc
- setup engine in package.json

## 2. Start Coding
1. Tutorial: https://www.youtube.com/watch?v=BWUi6BS9T5Y&t=0s 
2. Conect Mongodb
3. Log with pino

    in .gitignore need to write rule 'logs' before git add to prevent overwrite rule ignore

4. Route

     Differences between import and require:

    **require** for express library,  but we need to use **import** for type express
