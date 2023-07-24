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
- ```
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
try to apply in the http error code handling
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
utils: commom function that small code 
helper: functions that do specific purpose
  
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
