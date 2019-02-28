# super-url-path

A super library for formatting URL paths, similar to TS static grammar detection.

## Install

```shell
npm i super-url-path
```

## Usage

Usually it is used in this way:

```javascript
const SuperUrlPath = require('SuperUrlPath');
const uri = new SuperUrlPath('/abc/des/abc-d_:{abc:string}*x--a{cde?:number}-d/test{value:string}');
console.log(uri.exec('/abc/des/abc-d_:dista*x--a123-d/testdd'));
console.log(uri.router({
  abc: 'dddd',
  cde: 345,
  value: 'dafa'
}))
```

## Variable Grammar

it likes typescript:

```shell
abc: string
# or
abc?: string
```

You should use it like this:

```shell
/abc/des/abc-d_:{abc:string}*x--a{cde?:number}-d/test{value:string}
```

### uri.router(options)

create a new url by options.

```javascript
uri.router({
  abc: 'dddd',
  cde: 345,
  value: 'dafa'
}))
```

### uri.match(url)

Judging whether URL conforms to the rules. it returns a boolean value.

```javascript
uri.match('/abc/des/abc-d_:dista*x--a123-d/testdd'); // true or false
```

### uri.exec(url)

Get the value of the variable from the rule and return a JSON data format

```javascript
const SuperUrlPath = require('SuperUrlPath');
const uri = new SuperUrlPath('/abc/des/abc-d_:{abc:string}*x--a{cde?:number}-d/test{value:string}');
console.log(uri.exec('/abc/des/abc-d_:dista*x--a123-d/testdd'));
// => { abc: 'dista', cde: '123', value: 'dd' }
```

## Add custom data format

use `SuperUrlPath.addType(name, regexp_string)`

- **name** `string` the datatype name.
- **regexp_string** `string` a String Regular Expression.

```javascript
const SuperUrlPath = require('SuperUrlPath');
SuperUrlPath.addType('user_id', 'user_(\\d+)_uuid_[a-zA-Z0-9]');
// then you can use like this
const uri = new SuperUrlPath('/interface/api/user/custom_{user: user_id}/{id: number}');
```

# License

`super-url-path` is [MIT licensed](https://opensource.org/licenses/MIT).