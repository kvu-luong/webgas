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
- 24/07/2023
  - https://www.youtube.com/watch?v=TiMiJazU4Pc
  + connect mongodb and checking connection 
  + Increase speed for nodejs server with threadpool : https://www.youtube.com/watch?v=PLCrpMgaaeg
  + thaut toan: cac cach giai 1 bai toan  dung va nhanh, cau truc du lieu: cach luu tru du lieu cho cac du lieu khac nhau: https://www.youtube.com/watch?v=dCr9Rctt74I
  + mongoPool auto connect/disconnect 
  + maxPoolSize: 100 default -> set connect in queue and waiting for previous connect free: https://www.mongodb.com/docs/manual/administration/connection-pool-overview/
    + handle open and reuse connection in pool -> pool is a mechanism

  + Different between env and configs??
    env: sensitive information.
    config: common, support to setup project.



  + Sigup API:
    + shop model
    + vscode extenstionrest request
      + create snippet 
        + ctrl shift p -> type search snippet
        + create new snippet file json.
        ```
         "Generate Mongoose Schema": {
            "prefix": "mdbgm",
            "body": [
              "import { Schema, model, Document } from 'mongoose';",
              "",
              "export interface I${1:ModelName} extends Document {",
              "\tpublicKey: string;",
              "\tprivateKey: string;",
              "}",
              "",
              "const DOCUMENT_NAME = '${1:ModelName}';",
              "const COLLECTION_NAME = '${2:collectionName}';",
              "",
              "const ${3:keyStoreSchema} = new Schema<I${1:ModelName}>({",
              "\tpublicKey: {",
              "\t\ttype: String,",
              "\t\trequired: true,",
              "\t\tunique: true,",
              "\t\tindex: true",
              "\t},",
              "\tprivateKey: {",
              "\t\ttype: String,",
              "\t\trequired: true,",
              "\t\tunique: true",
              "\t}",
              "}, {",
              "\ttimestamps: true,",
              "\tcollection: COLLECTION_NAME",
              "});",
              "",
              "export default model<I${1:ModelName} & Document>(DOCUMENT_NAME, ${3:keyStoreSchema});"
            ],
            "description": "Generate Mongoose Schema with TypeScript"
          }
        ```
        + usage: typing -> mdbgm then press **Enter**, input the first parameter,  then **Tab** to type the second parameter

    + router, controller, service
    + query .lean() -> return object
    + signup: validate mail(exist, format)
    + using argon2-ffi to hash password: https://www.npmjs.com/package/argon2-ffi
  

  part2: 
  - keystoreModel: userid, publickkey, refreshToken.
    - userId is ref to ShopModel.
    - signIn with jwt + rsa , each user will have 1 private + publickey -> save this public in server to verify

    there are two ways: symmetric with out query db and asymetric that need to query db to get public key.

    => decide to use symmetric
    - get formatted data response.
      - problem:
        - lost accesstoken
        - access multiple device
        - only 1 devide
        - blacklist + whitelist ????
        - create token error but still create db record



    part3: check apiKey and permission ( identify partner and there membership)
    https://www.youtube.com/watch?v=nQxEwBAcYrI
    - custome type of request 
   
    ```
    
    declare module 'express-serve-static-core' {
      interface Request {
        objKey?: IApiKey; // Replace IApiKey with the actual type of objKey
      }
    }

    Then:
    req.objKey to get the value.
    ```
    Alternative way on the router, 
    ```
    (req: Request<{objKey: IApiKey}>)
    Then
    req.params.objKey to use it.
    ```

    In the middleware, we still need to custom the Request to pass typescript checking
    ```
    interface CustomRequest extends Request {
        objKey?: IApiKey;
      }
    Then:
    req.objKey = objKey to use it in other router too.
    ```

     - mongo record auto delete with **expires** in Schema
        ```
        createdAt: {
            type: Date,
            default: Date.now,
            expires: "30d"
        }
        ```


  part 4: error handler
  https://www.youtube.com/watch?v=hyF1S0nFS7A

  - error with router: 404, listen throw error 
  - move try catch to HOC 
    ```
    export const asyncHandler = (fn:any) => {
      return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
      }
    }


    export default class AccessController {
      static signUp = async (req: Request, res: Response) => {
        return res.status(201).json(await AccessService.signUp(req.body));
      };
    }
    ```

    - success response
    ```
    {
      statusCode: team_code_define
      message: information
      metadata: object
      options: addition information
    }
    ```


  part 5:login 

  - sign up -> return accessToken, refreshToken -> let user go ahead without login
  - login -> create new AT, RF token -> input username/ password to login to server.
    - conditions:
      - email exist
      - match password
      - create AT vs RT and ave
      - save refresh token in db: still access to db -> but It reduce time.
  - flow code: model -> service -> contoller -> router 


  part 6: add authentication to check token before goto other router.
    - header:
      - x-api-key: partner id 
      - x-client-id: userId ???? -> extract from : send to server to let server check right userId with the right accestoken then get db to verify to make this user still exist. And make the code more flexible ( don't need to check userId after decode toKen )
      - authentication token 

    - defined config error.

    session: platform
    accessToken: accessToken reduce request to db
    username/password: 
    https://github.com/trangchongcheng/refreshToken/blob/main/auto-fresh-token-by-interceptors-axios
    or this video: https://www.youtube.com/watch?v=cI_xxZDYYPg

    client don't have to send refresh token every time to the server.

    server still need to check userId exist to make sure this user is still avalible in our system in case this user have been deleted.


   ** multiple platform:**
    - add field in header param: web/android/ in KeyStore to check userId + platform 

    Logout will delete keyStore record, but if use don't logout then use the oldRefreshToken -> flag here.


    Part 7:
    Handle RefreshToken:https://www.youtube.com/watch?v=S8yvvRag6Kk
    check used old token
    create new token pair and update the keystore
    send both accessToken and refreshToken to the server -> FE must send resquest to get token before expired
    - update authentication middle router with refreshToken
    - mongo query update: https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
      -> if the field does not exist -> then don't do anything.


    part 8: product section
    - db design: polymorphic pattern. Commom on product, detail in new collection attribute
    - mongodb: 16MB on doc, 100 nested on doc , max collection 32TB
    - step: model - business logic with **factory pattern**.
    - But we need to **handle asynchonous** when 1 is fail and other procoss save data is success ???

    - id of child must be the same at parent -> query and know where it belong to.

    When update the product type, this will break the rule SOLID in **ProductFactory** -> therefore, we need to updated 

    - update product model: 
      with slug , pre in mongodb.
      pagination type:
        - scroll media
        - page: ecommerce
      apply repository structure.
      BULLQUEUE: https://docs.nestjs.com/techniques/queues

    - features for product
      + package: slugify
      + add pre hook in model product
      + repository folder to handler interface database.
        + draft product
        + publish product.
        + unpublish
        + search product
      pagination, total, nextPage, AbstractFactory ????
    - **Fulltext search**: https://anonystick.com/blog-developer/full-text-search-mongodb-chi-mot-bai-viet-khong-can-nhieu-2022012063033379
      with index text 
    - .lean() -> return plain object that reduce memory


  part 9: product 
  - findAllProducts -> should apply abstractFactory here for paginate
  -  transaction when update 2 things at the same time
  -  findOneProduct
  -  Update product: nested object, input null.
     -  PUT: full,
     -  Patch: part -> reduce bandwidth with less data.

  verify email to active account ???
  Note: **router in index** file must be different to let use middle in each router seperate
  ```
    app.use(configs.commomConfig.app.apiVersionRoute + '/user', UserRouter);
    app.use(configs.commomConfig.app.apiVersionRoute + '/product', ProductRouter);
    app.use(configs.commomConfig.app.apiVersionRoute + '/shop', AccessRouter);

  ```

  
---------------------
api structure and hanlder version on header: 
    - https://www.youtube.com/watch?v=jSWkGTvZeco&list=PLw0w5s5b9NK4fr9o4uT2xVX199343SPir&index=15

hander version of api in header simlilar to gihub version api.

using next(error) to throw error to the handle router.

call function : https://www.w3schools.com/js/js_function_call.asp


hanle error of request with HOC:https://www.youtube.com/watch?v=OMpCldR3XsU
```
const handlerRequest = promise => {
  return promise.then(data => ([undefined, data])).catch(error => ([err, undefined]))
}

const [err, result] = await handlerRequest(request(a));
if(err) => do something here.
```
--------------------
inistal middlewae :
  - dev dependency
    - morgan: http request logger -> write down request log.
    - helmet: hide technique that use in our projet
    - compressiion: reduce response data size -> increase performance -> https://www.youtube.com/watch?v=bIFq0fxNLoE
    - usefull package: https://www.becomebetterprogrammer.com/how-to-use-third-party-middleware-with-express-js-and-typescript/
    - cors: https://www.npmjs.com/package/cors#configuring-cors
  
- --------------
Delpyment
- render
- digital ocean
- mongoatlas
- Cicd
------------
code pattern
- strategy: handle if else condition: https://www.youtube.com/watch?v=sheV2IBlQkU
  github: https://github.com/anonystick/learning-design-patterns
  - lv2: split function and, in the main we still use if else but we return the function.'
  - good: split function + object condition -> in the main function will return the value of object with type.
```
const getPricesStrategies = {
  preOrder: preOrderPriceFn,
  promotion: promotionPriceFn
}

function getPrice(originalPrice, typePromotion) {
  return getPricesStrategies[typePromotion](origianlPrice)
}
console.log('-->>', getPrice(100, 'preOrder'))
```

Factory pattern: with logictis example
+ simple: using swith case with input option class -> https://www.youtube.com/watch?v=O6TsDdKtyz0
+ factory: without break solid -> move a swith to a factory
```
class ServiceLogicTics {
  typeTransportClass = defaultCar;
  getTransport = (customerInfo)  => {
    return new this.typeTransportClass(custommerInfo);
  }
}

class defaultCar {
  contructor({name = 'hahah, customerInfo = {}}){
    this.name = name;
    this.customerInfo = customerInfo;
  }
}
// Usage
const carService = new ServiceLogicTics();

// Extend new type of transport
class Truck {
  contructor();
}
class TruckService extends ServiceLogicTics {
  typeTransportClass = Truck;
}

const truckService = new TruckService();
// keep using the function getTransport in the commomen
// keep the same method in same place to inherit -> why don't split function then get class as input ??? composition ???
// why we decide to use CAR or Truck ??? incomming request with a type 

// Strategy change the behavior
// Factory change the object : example payment with credit/cash/bitcoin -> can app strategy too???

Just apply in class opp 
https://www.youtube.com/watch?v=CNIEdB7XBRk
There are still exist and if else or switch conditon here.
???
Read more on this page: https://sourcemaking.com/design_patterns/factory_method

Factory pattern: create new object base on type , each object do 
```


Facade pattern
ex: shiping cost: https://www.youtube.com/watch?v=zK_sNkfzugs
-> combine all complex function in 1 one to let user use this function,
hide the complexity behide the scenes

Modulus algo: let the index loop from 1 -> 2 -> end -> 1 -> 2 ->end ( Round Robin )
May be apply to load balance to decide which server will be receive a request.: server index, response time, least connect, weight -> all these is conditions to decide the destination of a request.
https://www.youtube.com/watch?v=EINOE9z3sLE
```
const getNextValueWithModulus = (servers:number[]): number => {
  const nextServerValue: number= servers[index];
  index = (index + 1) % servers.length;
  return nextServerValue;
}
const servers = [1, 2, 3];
let index = 0;
console.log(getNextValueWithModulus(servers))
console.log(getNextValueWithModulus(servers))
console.log(getNextValueWithModulus(servers))
console.log(getNextValueWithModulus(servers))
console.log(getNextValueWithModulus(servers))
```
-----------
Coding:
- condition: if this condition is long -> put it into a variable or a function
```
const isOk = user.age > 30 && user.name === 'haha';
if(isOk){
  //do something
}
// more clear
const isOk = user => {
  return (
    user.age > 30 &&
    user.name === 'haha'
  )
};

if(isOk(user)){
  // do somthing
}

```

Trying to apply in the http error code handling
=> this is the same at strategy pattern.
----------------------
bridge pattern: same interface but do different behavior 
inherit ?? 
https://www.youtube.com/watch?v=0CuTOeCKbjM

2 method different: payment1, payment2, ....
1 class that let controller use it base on type: Membership with method **payment**, "**registerPaymentType**"

```
const visaPaymentProcess = new VisaPaymentProcess('visa information');
const membership = new MembershipRegistration(visaPaymentProcess);
// -> using the payment method of class visa paymentProcess.
// avoid using if else condition.
```
--------------------
Adapter pattern
different interface to do the same thing.
https://www.youtube.com/watch?v=cUNoGD7sR-g

Write one more fucntion to cover another to the destination one.


---------------
All ways to support upgrade version of infrastructure
https://www.youtube.com/watch?v=j0dchuY2DSk
----------------------
Observe pattern -> apply in news feed who register to this idol
how to apply it ???
receive notify -> but each object maybe interact differenct
**example**:
 event , then who would like to join -> should register -> after user register they can receive informtion about this event
https://www.youtube.com/watch?v=7J5pRc2vzWk
**eventemit
pub/sub rabitmq**
--------------
Reference
- https://github.com/duyhoangptit/duyhoangptit

---------------
utils: commom function that small code, not dependency on toher
helper: functions that do specific purpose related to 1 modules.

---------------
Unitest: https://web3usecase.co/mastering-unit-testing-best-practices-4f9ecad894a0
- stubs: fake response data 
- spies

Testing rules:
- independece: don't reply on other test
- one assertion per test: 1 happy, 1 fail
- focus on happy case 
-----------
News in ES14 2023
- toSorted, toReversed, with ( splice ) -> copy value to new address

https://github.com/tc39/proposals

https://www.proposals.es/

-------------
Optimistic and Pessimistic key distributed in big system to handle transaction concurrent from multiple user 
https://www.youtube.com/watch?v=UjiGO37qugY&list=PLw0w5s5b9NK5fDx409WXgT06Zm4P83yiA&index=14

opti: multiple request but one 1 request handled at the time like a bank.
pess: multiple request comming but then checking outcomming like supper market
 ----------------- 
Stream in nodejs

https://www.youtube.com/watch?v=AiPuHlyP8qM&list=PLw0w5s5b9NK5fDx409WXgT06Zm4P83yiA&index=10


=> reduce using ram, cpu of server
 --------------
EventLoop

https://www.youtube.com/watch?v=GVx47SJYZhI&list=PLw0w5s5b9NK5fDx409WXgT06Zm4P83yiA&index=11

why single thread? 
  - support manage: edit/create/.. DOM : 1 done then after

2 part in javascript : memory heap and call stack

eventLoop: device asynchonous and synchonous task

allway microtask first until this threead done. see task -> put this to queue then continue to execute.
microTask ( job queue )
  - process.nextTick: create next queu 
  - promise
  - aysnc/awat
general: immediately or after microtask
  console.log
  code outside micro, macro 
macroTask ( task queue )
  - setTimeout
  - setInterval
  - setImmediate
  - I/O
  - UI render

In micro/ and: we still need to decide base on the type: timers, panding, ide, poll, check, close
https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick


example:
```
console.log(0)

setTimeout(function(){
    console.log(1);
    new Promise((resolve, reject) => {
        console.log('resolve')
        resolve('xks')
    }).then((val) => console.log(val))
});

new Promise((resolve, reject) => {
    console.log(2)
    resolve(3)
    setTimeout(() => console.log('time in micro'))
}).then((val) => console.log(val)).then(() => console.log('then 12'))

new Promise((resolve, reject) => {
    console.log(4)
    resolve(5)
}).then((val) => console.log(val)).then(() => console.log(
    'thehs 233'
))

console.log(6);
// general: execute immediate or before micro
// micro: check first
// macro: move immediately and then handle at the end of loop.
// 0, 2, 4, 6, 3, 5, tjem 12. thens 233, 1, resolve, xks, time in micro 
```
 ------------
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
1. Tutorial setup project: https://www.youtube.com/watch?v=BWUi6BS9T5Y&t=0s 
2. Conect Mongodb
3. Log with pino

    in .gitignore need to write rule 'logs' before git add to prevent overwrite rule ignore

4. Route

     Differences between import and require:

    **require** for express library,  but we need to use **import** for type express
