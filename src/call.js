import { getIOSVersion, getBrowser } from './versions';

let iframe = null;
let options = {};

// =============================================
// 基础组件
// 获取浏览器hidden属性名
function getPrefix() {
    if ('hidden' in document) {
        return '';
    }

    let curPrefix = ['webkit', 'moz', 'ms', 'o'].find((prefix) => {
        return `${prefix}Hidden` in document;
    });

    return curPrefix || '';
}

// =============================================
// 跳转相关功能
// 通过top.location.href跳转
function callByHref(uri) {
    window.top.location.href = uri;
}

// 通过a标签跳转
function callByTagA(uri) {
    let a = document.createElement('a');
    a.setAttribute('href', uri);
    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();
}

// 通过iframe跳转
function callByIframe(uri) {
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.frameborder = '0';
        iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
        document.body.appendChild(iframe);
    }

    iframe.src = uri;
}

// 检测是否跳转成功
function checkOpen(cb) {
    let hiddenPrefix = getPrefix();
    let visibilityChangeProperty = hiddenPrefix ? `${hiddenPrefix}visibilitychange` : 'pagehide';
    let timer = setTimeout(() => {
        let hidden = hiddenPrefix ? `${hiddenPrefix}Hidden` : 'hidden';
        if (!document[hidden]) {
            cb();
        }
    }, options.timeout);

    document.addEventListener(visibilityChangeProperty, () => {
        clearTimeout(timer);
    });
}

// =============================================
// 生成url相关功能
// 生成universalScheme
function generateScheme(config = {}) {
    let protocol = options.scheme && options.scheme.protocol;
    let path = config.path;
    return `${protocol}://${path}`;
}

// 生成universal link
function generateUniversalLink(config = {}) {
    let universal = options.universal;
    if (!universal) {
        return '';
    }

    // 生成参数
    let params = config.params;
    let urlQuery = '';
    if (typeof params === 'object') {
        urlQuery = Object.keys(params).map((key) => {
            return `${key}=${params[key]}`;
        }).join('&');
    }

    return `https://${universal.host}?${universal.pathKey}=${config.path}${urlQuery}`;
}

// =============================================
// 打开链接相关功能
// 跳转不成功时fallback
function fallback(uri) {
    checkOpen(() => {
        callByHref(uri);
    });
}
// 尝试打开APP链接
export function open(config = {}, opt = {}) {
    options = opt || {};

    let browser = getBrowser();
    let schemeURL = generateScheme(config);
    let fallbackUrl = options.fallback;

    if (browser.isIos) {
        if (browser.isWechat || browser.isQQ || browser.isQQBrowser) {
            // 腾讯系浏览器：直接跳转ios appstore地址
            // 微信、QQ、QQ浏览器均禁止了scheme和universalLink
            callByHref(options.appstore);
        } else if ((getIOSVersion() < 9)) {
            // iOS低于9版本时使用iframe
            callByIframe(schemeURL);
        } else if (options.universal === 'undefined') {
            // 未定义universalLink时使用schema
            callByHref(schemeURL);
        } else {
            callByHref(generateUniversalLink(config));
        }

        // 不成功时若定义了appstore地址则跳转appstore，否则跳转fallback url
        fallbackUrl = options.appstore || options.fallback;
    } else if (browser.isOriginalChrome) {
        // 原生chrome时使用a tag调用
        callByTagA(schemeURL);
    } else {
        // 其他时候使用iframe调用
        callByIframe(schemeURL);
    }

    if (typeof config.callback === 'function') {
        checkOpen(() => {
            config.callback();
        });
        return;
    }

    if (!fallbackUrl) {
        return;
    }

    fallback(fallbackUrl);
}