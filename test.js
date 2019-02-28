const dpath = require('./index');
const obj = new dpath('/abc/des/abc-d_:{abc:string}*x--a{cde?:number}-d/test{value:string}');
console.log(obj.exec('/abc/des/abc-d_:dista*x--a123-d/testdd'));
const x = obj.router({
  abc: 'dddd',
  cde: 345,
  value: 'dafa'
});
console.log(x)
// { abc: 'dista', cde: '123', value: 'dd' }