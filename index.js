import { open } from './src/call';

class CallApp {
    constructor(options) {
        let defaultOptions = {
            timeout: 2000
        };
        this.options = Object.assign(defaultOptions, options);
    }

    // 尝试唤起客户端
    open(config = {}) {
        open(config, this.options);
    }
}

export default CallApp;