// iOS系统版本号
export function getIOSVersion() {
    let version = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(version[1], 10);
}

// 获取浏览器标识
export function getBrowser() {
    let ua = window.navigator.userAgent || '';
    let isAndroid = /android/i.test(ua);
    let isIos = /iphone|ipad|ipod/i.test(ua);
    return {
        isAndroid,
        isIos,
        isWechat: /micromessenger\/([\d.]+)/i.test(ua),
        isQQ: /qq\/([\d.]+)/i.test(ua),
        isQQBrowser: /(qqbrowser)\/([\d.]+)/i.test(ua),
        isOriginalChrome: /chrome\/[\d.]+ Mobile Safari\/[\d.]+/i.test(ua) && isAndroid,
    };
}
