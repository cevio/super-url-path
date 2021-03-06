const dpath = require('./index');
const obj = new dpath('/abc/des/abc-d_:{abc:string}*x--a{cde?:number}-d/test{value:string}');
console.log(obj.exec('/abc/des/abc-d_:dista*x--a123-d/testdd'));
const x = obj.router({
  abc: 'dddd',
  cde: 345,
  value: 'dafa'
});
console.log(x); // { abc: 'dista', cde: '123', value: 'dd' }
console.log(obj)
const obj2 = new dpath('/abc/{zx?: any}');
console.log(obj2.exec('/abc/des/abc-d_:dista*x--a123-d/testdd')); // { zx: 'des/abc-d_:dista*x--a123-d/testdd' }
console.log(obj.deep, obj2.deep)
