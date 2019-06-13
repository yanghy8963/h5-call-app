# h5-call-app
模块提供大部分浏览器、应用H5唤起APP的方案，提供大部分兼容性，及跳转失败转回指定页面或app store。

# 安装
```npm install h5-call-app```

# 使用
```
import CallApp from 'callapp-lib';

...
let options = {
    scheme: {
        protocol: 'protocol'
    },
    fallback: 'https://www.google.com',
    timeout: 2000
};
let callLib = new CallApp(options);

callLib.open({
    params: {},
    path: 'openapp/123'
});
...
```
# 初始化options
## scheme
类型：object
（必填）Url Scheme相关参数
### protocol
类型：string
地址协议

## universal
类型：object
iOS universal url相关配置
### host
类型：string
域名
### pathKey
类型：string
pathKey，需要与APP开发人员确认

## fallback
类型：string
调用失败后跳转的页面，也可以是app store地址或其他地址，如应用宝地址

## timeout
类型：int
超时时间判断，默认2秒

## appstore
类型：string
iOS的App Store地址

# 方法
## open
类型：object
接收一个object类型，参数定义如下：

### path
类型：string
（必填）跳转的页面地址，如'index/'（host不填，因为在初始化时已传递）
### params
类型：object
universal link时有用，用来拼凑query，如：{ key1: 'value1', key2: 'value2' }
### callback
类型：function
唤起APP失败时调用，会覆盖默认的fallback链接跳转呦！
