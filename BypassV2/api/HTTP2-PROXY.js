const CloudflareBypasser = require('cloudflare-bypasser');
 
let cf = new CloudflareBypasser();
 
cf.request('https://welovecloudflare.de')
.then(res => {
  // res - full response
  console.log(res);
});