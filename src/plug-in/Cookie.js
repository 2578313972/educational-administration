/**
 * Cookie操作工具
 * @author caolingxiong
 * @date 2019-7-24
 */
class Cookie {
    constructor() {
        this.allCookies = {};
        this.init();
    }

    /**
     * 初始化Cookie的信息
     */
    init() {
        this.cookie = document.cookie;
        this.allCookies = {};
        const reg = /([^=;\s]+)=([^=;]+);?/g; // Cookie解析正则表达式
        let res = reg.exec(this.cookie);
        while (res !== null) { // 解析Cookie
            this.allCookies[decodeURIComponent(res[1])] = decodeURIComponent(res[2]);
            res = reg.exec(this.cookie);
        }
    }

    /**
       * 获取Cookie
       * @param {String} name  cookie对应的名称
       */
    getCookie(name) {
        this.init();
        return this.allCookies[name];
    }

    /**
       * @description: 设置cookie
       * @name {String} 字段名称
       * @value {String} 字段值
       * @opts {Object} cookie属性值
       *  @opts {maxAge} cookie 的有效时间 单位 s
       *  @opts {domain} cookie属性值
       *  @opts {path} cookie属性值
       * @return:
       */
    setCookie(name, value, opts) {
        this.allCookies[name] = value;
        let str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        if (opts) {
            const { maxAge, domain, path } = opts;
            if (maxAge) {
                str += `; max-age=${maxAge}`;
            }
            if (domain) {
                str += `; domain=${domain}`;
            }
            if (path) {
                str += `; path=${path}`;
            }
        }
        document.cookie = str;
    }
    /**
       * 移除Cookie
       * @param {String} name
       */
    removeCookie(name) {
        this.init();
        document.cookie = `${name}=;expires=Thu, 01-Jan-1970 00:00:01 GMT`;
        delete this.allCookies[name];
    }
}
export default new Cookie();
