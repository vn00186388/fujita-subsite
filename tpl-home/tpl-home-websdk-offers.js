(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.$fbsdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Config = (function () {
        function Config() {
        }
        Config.baseHost = 'websdk.fastbooking-cloud.ch';
        Config.authToken = null;
        Config.SDK_VERSION = '0.0.1';
        return Config;
    }());
    exports.Config = Config;
});

},{}],3:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var noOp = function noOp(a) {
    };
    var _cache = {};
    var _locks = {};
    /**
     * Store for the elements to load (as a key-value or in pushed an array).
     */
    var Loader = (function () {
        function Loader() {
            this.elementsToLoad = { arr: [], obj: {} };
        }
        /**
         * Adds a loadable Object to the `elementsToLoad` member.
         *
         * @example
         * add('foo', myObject); //Index the object from a specific key
         * add(myObject); //Push the object in an array
         *
         * @param {String} [key]
         * @param {Object} loadableObject a loadable object (currently BaseModel subclasses)
         */
        Loader.prototype.add = function (key, loadableObject) {
            if (typeof (key) === 'string') {
                if (!isNaN(parseInt(key, 10))) {
                    throw new Error("cannot enqueue elements to load with a key which is a number: " + key);
                }
                this.elementsToLoad.obj[key] = loadableObject;
            }
            else {
                this.elementsToLoad.arr.push(key);
            }
            return this;
        };
        /**
         * Build an url from the given configuration.
         *
         * @param  {Object} config
         * @param  {String} config.schema ex: 'http', 'https'
         * @param  {String} config.host
         * @param  {String} config.path Uri concatened to the schema & host
         * @param  {Object} config.params A key/value hash containing query parameters.
         *
         * @return {String}
         */
        Loader.buildUrl = function (config) {
            // config.params
            var toRet = config.path;
            var paramsArray = [];
            if (typeof (window) !== 'undefined' && config.params.output === 'json') {
                // we're in the browser so we cannot do simple json requests but only jsonp
                config.params.output = 'jsonp'; // eslint-disable-line no-param-reassign
            }
            for (var key in config.params) {
                if (typeof (config.params[key]) !== 'undefined' && typeof (config.params[key]) !== 'function') {
                    paramsArray.push(key + "=" + encodeURIComponent(config.params[key]));
                }
            }
            toRet += "?" + paramsArray.join('&');
            return config.schema + "://" + config.host + toRet;
        };
        /**
         * Parallelly loads all the objects in the queue.
         *
         * @param {Function} onFinished called when ALL the objects where loaded (error or not)
         * @param {Function} [onSingleFinished=noop] called each time an object where loaded.
         * Please note that the order of the items loaded is not guaranteed.
         */
        Loader.prototype.load = function (onFinished, onSingleFinished) {
            if (onSingleFinished === void 0) { onSingleFinished = noOp; }
            var elementsToLoad = this.elementsToLoad;
            // Reset elements to load in the case the user wants to trigger another loading.
            this.elementsToLoad = { arr: [], obj: {} };
            var fnsToRun = [];
            var ajaxFnCreator = function ajaxFnCreator(el, index) {
                return function ajaxCall(cback) {
                    // noinspection Eslint
                    var url = Loader.buildUrl(el.getURLStructure());
                    // Different object same data requested.
                    if (typeof (_cache[url]) !== 'undefined') {
                        el.setRawData(_cache[url]);
                        return cback(null, index);
                    }
                    if (typeof (_locks[url]) !== 'undefined') {
                        // concurrent request going on.
                        // Reschedule check from ajaxCall
                        return setTimeout(function () { ajaxCall(cback); }, 200);
                    }
                    // set lock for this url
                    _locks[url] = true;
                    jQuery.ajax({
                        url: url,
                        dataType: 'jsonp',
                        timeout: 15000,
                    })
                        .done(function (result) {
                        el.setRawData(result.data);
                        _cache[url] = result.data;
                        cback(null, index);
                        // release lock
                        delete _locks[url];
                    })
                        .fail(function (_a, textStatus) {
                        var _b = _a.responseText, responseText = _b === void 0 ? "{\"data\": \"Generic Error\"}" : _b;
                        if (textStatus === 'timeout') {
                            return cback(new Error('Timeout'), index);
                        }
                        cback(new Error(jQuery.parseJSON(responseText).data), index);
                        // release lock
                        delete _locks[url];
                    });
                };
            };
            for (var i = 0; i < elementsToLoad.arr.length; i++) {
                fnsToRun.push(ajaxFnCreator(elementsToLoad.arr[i], i));
            }
            /* eslint-disable */
            for (var k in elementsToLoad.obj) {
                fnsToRun.push(ajaxFnCreator(elementsToLoad.obj[k], k));
            }
            /* eslint-enable */
            var finishedCounter = 0;
            var results = {};
            var callbackFnCreator = function callbackFnCreator() {
                return function ajaxResultReceived(err, index) {
                    finishedCounter++;
                    results[index] = {
                        origObject: typeof (index) === 'string' ?
                            elementsToLoad.obj[index] :
                            elementsToLoad.arr[index],
                        error: err // eslint-disable-line key-spacing
                    };
                    onSingleFinished(results[index]);
                    if (finishedCounter === fnsToRun.length) {
                        // Done callback
                        onFinished(results);
                    }
                };
            };
            for (var i = 0; i < fnsToRun.length; i++) {
                fnsToRun[i](callbackFnCreator());
            }
        };
        return Loader;
    }());
    exports.Loader = Loader;
});

},{}],4:[function(require,module,exports){
/// <reference path="../../typings/mytypings/pug.d.ts"/>
/// <reference path="../../typings/mytypings/underscore.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'pug'], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * @module Template
     */
    var pug = require('pug');
    /**
     * @class
     */
    var Template = (function () {
        function Template(tplStr) {
            this.tplStr = tplStr;
        }
        // noinspection Eslint
        /**
         * Renders the given Template.
         * @param {object} data hash of locals that needs to be accessed by the template renderer
         * @param {object} i18n hash of i18n strings that needs tob e accessed by the template renderer
         */
        Template.prototype.render = function (data, i18n) {
            throw new Error('Please use one of the sub-instances of Template such as Jade or underscore. or write your own!'); // eslint-disable-line max-len
        };
        return Template;
    }());
    exports.Template = Template;
    var JadeTemplate = (function (_super) {
        __extends(JadeTemplate, _super);
        function JadeTemplate() {
            _super.apply(this, arguments);
        }
        JadeTemplate.prototype.render = function (data, i18n) {
            var newData = data;
            newData.i18n = i18n;
            try {
                return pug.render(this.tplStr, newData);
            }
            catch (e) {
                return JSON.stringify(e.stack);
            }
        };
        return JadeTemplate;
    }(Template));
    exports.JadeTemplate = JadeTemplate;
    var UnderscoreTemplate = (function (_super) {
        __extends(UnderscoreTemplate, _super);
        function UnderscoreTemplate() {
            _super.apply(this, arguments);
        }
        UnderscoreTemplate.prototype.render = function (data, i18n) {
            var newData = data;
            newData.i18n = i18n;
            return _.template(this.tplStr)(newData);
        };
        return UnderscoreTemplate;
    }(Template));
    exports.UnderscoreTemplate = UnderscoreTemplate;
});

},{"pug":1}],5:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Config", "./Loader", "./Template", "./endpoints/index", './utils/index'], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    // <reference path="typings/index.d.ts" />
    __export(require("./Config"));
    __export(require("./Loader"));
    __export(require("./Template"));
    __export(require("./endpoints/index"));
    var utils = require('./utils/index');
    exports.utils = utils;
});

},{"./Config":2,"./Loader":3,"./Template":4,"./endpoints/index":18,"./utils/index":20}],6:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./BaseModel"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require("./BaseModel");
    var Accommodations = (function (_super) {
        __extends(Accommodations, _super);
        function Accommodations(config) {
            _super.call(this, config);
        }
        Accommodations.prototype.getRequiredParams = function () {
            return ['property', 'locale'];
        };
        Accommodations.prototype.getOptionalParams = function () {
            return ['output', 'orderType', 'offset', 'limit', 'imagew', 'imageh',
                'sortBy', 'template', 'stripTags', 'onlyBookableRooms'];
        };
        Accommodations.prototype.getURLPath = function () {
            return '/accommodations';
        };
        Accommodations.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                template: this.getConfig().template,
                locale: this.getConfig().locale,
                property: this.getConfig().property,
                offset: this.getConfig().offset,
                limit: this.getConfig().limit,
                imagew: this.getConfig().imagew,
                imageh: this.getConfig().imageh,
                sortBy: this.getConfig().sortBy,
                stripTags: this.getConfig().stripTags,
                onlyBookableRooms: this.getConfig().onlyBookableRooms,
                orderType: this.getConfig().orderType
            };
        };
        return Accommodations;
    }(BaseModel_1.BaseModel));
    exports.Accommodations = Accommodations;
});

},{"./BaseModel":8}],7:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./BaseModel", '../utils/index'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require("./BaseModel");
    var index_1 = require('../utils/index');
    var Availabilities = (function (_super) {
        __extends(Availabilities, _super);
        function Availabilities(config) {
            _super.call(this, config);
        }
        Availabilities.prototype.getRequiredParams = function () {
            return ['property', 'rateName'];
        };
        Availabilities.prototype.getOptionalParams = function () {
            return ['roomRestriction', 'maxCheckoutDays', 'locale', 'output'];
        };
        Availabilities.prototype.getURLPath = function () {
            return '/availabilities';
        };
        Availabilities.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                locale: this.getConfig().locale,
                property: this.getConfig().property,
                rateName: this.getConfig().rateName,
                roomRestriction: this.getConfig().roomRestriction,
                maxCheckoutDays: this.getConfig().maxCheckoutDays
            };
        };
        Availabilities.prototype.transformData = function (rawData) {
            var _this = this;
            if (rawData !== null) {
                this.availabilitiesByDate = {};
                rawData.availabilities.forEach(function (item) {
                    _this.availabilitiesByDate[item.arrivalDate] = item;
                });
            }
            return _super.prototype.transformData.call(this, rawData);
        };
        /**
         * @returns an array of number containing the number of days in the future where a checkout is possible
         */
        Availabilities.prototype.rawCheckouts = function (date) {
            var data;
            if (date instanceof Date) {
                data = this.availabilitiesByDate[index_1.formatDate(date)];
            }
            else {
                data = this.availabilitiesByDate[date];
            }
            if (typeof (data) !== 'undefined') {
                return data.possibleCheckouts;
            }
            return null;
        };
        /**
         * Finds the first checkout for the given date
         * @returns Date obj or null if date is unbookable
         */
        Availabilities.prototype.firstCheckout = function (date) {
            var possibleCheckouts = this.rawCheckouts(date);
            if (possibleCheckouts === null) {
                return null;
            }
            return new Date(index_1.castToDate(date).getTime() + 1000 * 24 * 3600 * possibleCheckouts[0]);
        };
        /**
         * Finds the last checkout for the given date
         * @returns Date obj or null if date is unbookable
         */
        Availabilities.prototype.lastCheckout = function (date) {
            var possibleCheckouts = this.rawCheckouts(date);
            if (possibleCheckouts === null) {
                return null;
            }
            return new Date(index_1.castToDate(date).getTime() + 1000 * 24 * 3600 * possibleCheckouts[possibleCheckouts.length - 1]);
        };
        Availabilities.prototype.isDateBookable = function (cfg) {
            if (!this.isLoaded()) {
                return null;
            }
            if (typeof (cfg) === 'string' || cfg instanceof Date) {
                cfg = { date: cfg };
            }
            var _a = cfg, _date = _a.date, nbNights = _a.nbNights;
            var checkouts = this.rawCheckouts(_date);
            if (checkouts === null) {
                return false;
            }
            if (typeof (nbNights) !== 'undefined' && checkouts.indexOf(nbNights) === -1) {
                // Date is not bookable cause of checkout date
                return false;
            }
            return true;
        };
        return Availabilities;
    }(BaseModel_1.BaseModel));
    exports.Availabilities = Availabilities;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Availabilities;
});

},{"../utils/index":20,"./BaseModel":8}],8:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../Loader', '../Config'], factory);
    }
})(function (require, exports) {
    "use strict";
    var Loader_1 = require('../Loader');
    var Config_1 = require('../Config');
    var BaseModel = (function () {
        /**
         * BaseModel Constructor
         *
         * Configuration values are assigned only if they are declared as Required
         * parameters or Optional parameters.
         *
         * @class
         * @protected
         * @throws {Error} If a required parameter is not given
         *
         * @param {Object} config Configuration for the sub-class.
         * @param {String} [config.output=jsonp]
         * @param {String} [config.locale=en_GB]
         */
        function BaseModel(config) {
            var _this = this;
            this._rawData = null;
            this._authToken = null;
            this._rawData = null;
            this._authToken = null;
            this._config = config;
            this._config.output = this._config.output || 'jsonp';
            var optionalParams = this.getOptionalParams();
            var requiredParams = this.getRequiredParams();
            // Check that required parameters were given
            requiredParams.forEach(function (paramName) {
                if (typeof (_this._config[paramName]) === 'undefined' || _this._config[paramName] === null) {
                    throw new Error("Parameter " + paramName + " is required for " + _this.getURLPath());
                }
            });
            var keysToRemove = [];
            Object.keys(this._config).forEach(function (key) {
                if (optionalParams.indexOf(key) === -1 && requiredParams.indexOf(key) === -1) {
                    keysToRemove.push(key);
                }
            });
            keysToRemove.forEach(function (key) {
                delete _this._config[key];
            });
            // R
        }
        /**
         * Returns an array of required config keys.
         *
         * Should be overriden by child class.
         *
         * @abstract
         *
         * @returns {String[]}
         */
        BaseModel.prototype.getRequiredParams = function () {
            return [];
        };
        /**
         * Returns an array of optional config keys.
         *
         * Should be overriden by child class.
         *
         * @abstract
         *
         * @returns {String[]}
         */
        BaseModel.prototype.getOptionalParams = function () {
            return [];
        };
        /**
         * Get the configuration, with possibly defaults values applied.
         *
         * @returns {Object}
         */
        BaseModel.prototype.getConfig = function () {
            return this._config;
        };
        /**
         * Throws an error since it must be overriden.
         *
         * @abstract
         *
         * @return {String}
         */
        BaseModel.prototype.getURLPath = function () {
            throw new Error('You must override this on your Model');
        };
        /**
         * Throws an error since it must be overriden.
         *
         * @abstract
         *
         * @return {Object}
         */
        BaseModel.prototype.getURLParams = function () {
            throw new Error('You must override this on your Model');
        };
        /**
         * Retrieves the url used for retrieve the model informations.
         * All the parameters needed to build the url should be passed through the Object constructor.
         *
         * @return {Object}
         */
        BaseModel.prototype.getURLStructure = function () {
            var urlParams = this.getURLParams();
            urlParams['s'] = '1';
            urlParams['version'] = urlParams['version'] || Config_1.Config.SDK_VERSION;
            if (this.getAuthToken() !== null) {
                urlParams['_authCode'] = this.getAuthToken();
            }
            return {
                schema: 'http',
                host: Config_1.Config.baseHost,
                path: this.getURLPath(),
                params: urlParams
            };
        };
        /**
         * Automatically called by {@link module:BaseModel~BaseModel#setRawData}.
         *
         * To override to provide a validation logic which will throw an Error in case
         * of invalid data.
         *
         * @abstract
      
         * @param {*} rawData
         */
        BaseModel.prototype.validateRawDataOrThrowException = function (rawData) {
            // Do nothing... validated!
        };
        BaseModel.prototype.getAuthToken = function () {
            return this._authToken || Config_1.Config.authToken;
        };
        BaseModel.prototype.setAuthToken = function (token) {
            this._authToken = token;
        };
        /**
         * @returns {*} the raw data fetched via load or set through BaseModel.setRawData
         */
        BaseModel.prototype.getRawData = function () {
            return this._rawData;
        };
        /**
         * Hook for subclasses to manipulate response data from backend
         * @param rawData
         */
        BaseModel.prototype.transformData = function (rawData) {
            return rawData;
        };
        /**
         * May throw an error by calling
         * {@link module:BaseModel~BaseModel#validateRawDataOrThrowException}
         * @private
         * @todo See how it can be refactor since {@link module:Loader~FbSdkLoader} is calling it
         * directly.
         * @param {*} rawData raw data object representing the underlying info
         */
        BaseModel.prototype.setRawData = function (rawData) {
            this.validateRawDataOrThrowException(rawData);
            this._rawData = this.transformData(rawData);
        };
        BaseModel.prototype.isLoaded = function () {
            return typeof (this.getRawData()) !== 'undefined' && this.getRawData() !== null;
        };
        /**
         * Loads the data asynchronously using FbSdkLoader.
         * Consecutive calls of this object are "returned" immediately
         * since the result is stored within BaseModel.getRawData
         *
         * @throws {Error} If method is called in a Node env (no 'window' global).
         *
         * @param {Function} cback callback where only one argument will be passed. (error) if any.
         * the callback might access this instance of the object using "this"
         */
        BaseModel.prototype.load = function (cback) {
            var _this = this;
            if (this.isLoaded()) {
                // why in the world would we re-load this?
                // we've the result already.. lets call the cback immediately.
                cback.apply(this, [null]);
            }
            else {
                if (typeof (window) !== 'undefined') {
                    var loader = new Loader_1.Loader();
                    loader.add(this);
                    loader.load(function (results) {
                        // self.setRawData() un-needed since the Loader takes this into account!
                        // call this.getRawData() to have the result.
                        cback.apply(_this, [results[0].error]);
                    });
                }
                else {
                    // within node server should not call this.
                    throw new Error('Load is not allowed within node');
                }
            }
        };
        /**
         * Render the model by :
         * - Returning the RawData if it's a string
         * - Returning the rendered template given.
         *
         * @param {Template} [template] Used for rendering. A sub instance of Template.
         *
         * @param {Object} [i18n] object to render labels, used only with template arg.
         *
         * @returns {String} Probably HTML ?
         */
        BaseModel.prototype.render = function (template, i18n) {
            if (typeof (this.getRawData()) === 'string') {
                return this.getRawData();
            }
            return template.render(this.getRawData(), i18n);
        };
        return BaseModel;
    }());
    exports.BaseModel = BaseModel;
});

},{"../Config":2,"../Loader":3}],9:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./BaseModel"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require("./BaseModel");
    var BestSinglePrice = (function (_super) {
        __extends(BestSinglePrice, _super);
        function BestSinglePrice(config) {
            _super.call(this, config);
        }
        BestSinglePrice.prototype.getRequiredParams = function () {
            return ['property', 'checkin', 'checkout'];
        };
        BestSinglePrice.prototype.getOptionalParams = function () {
            return ['output', 'rateName', 'currency', 'accommodation', 'adults'];
        };
        BestSinglePrice.prototype.getURLPath = function () {
            return '/bestsingleprice';
        };
        BestSinglePrice.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                adults: this.getConfig().adults,
                property: this.getConfig().property,
                currency: this.getConfig().currency,
                checkin: this.getConfig().checkin,
                checkout: this.getConfig().checkout,
                rateName: this.getConfig().rateName,
                accommodation: this.getConfig().accommodation
            };
        };
        return BestSinglePrice;
    }(BaseModel_1.BaseModel));
    exports.BestSinglePrice = BestSinglePrice;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BestSinglePrice;
});

},{"./BaseModel":8}],10:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./BaseModel"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require("./BaseModel");
    var Gallery = (function (_super) {
        __extends(Gallery, _super);
        function Gallery(config) {
            _super.call(this, config);
        }
        Gallery.prototype.getRequiredParams = function () {
            return ['property'];
        };
        Gallery.prototype.getOptionalParams = function () {
            return ['template', 'output', 'locale', 'tw', 'th', 'fw', 'fh', 'includeRoomImages'];
        };
        Gallery.prototype.getURLPath = function () {
            return '/gallery';
        };
        Gallery.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                template: this.getConfig().template,
                property: this.getConfig().property,
                locale: this.getConfig().locale,
                tw: this.getConfig().tw,
                th: this.getConfig().th,
                fw: this.getConfig().fw,
                fh: this.getConfig().fh,
                includeRoomImages: this.getConfig().includeRoomImages
            };
        };
        return Gallery;
    }(BaseModel_1.BaseModel));
    exports.Gallery = Gallery;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Gallery;
});

},{"./BaseModel":8}],11:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var GroupOffers = (function (_super) {
        __extends(GroupOffers, _super);
        function GroupOffers(config) {
            _super.call(this, config);
        }
        GroupOffers.prototype.getRequiredParams = function () {
            return ['group', 'locale'];
        };
        GroupOffers.prototype.getOptionalParams = function () {
            return ['template', 'output', 'orderBy', 'currency', 'extraCurrencies', 'roomRestriction'];
        };
        GroupOffers.prototype.getURLPath = function () {
            return '/groupoffers';
        };
        GroupOffers.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                template: this.getConfig().template,
                group: this.getConfig().group,
                orderBy: this.getConfig().orderBy,
                locale: this.getConfig().locale,
                currency: this.getConfig().currency,
                roomRestriction: this.getConfig().roomRestriction,
                extraCurrencies: this.getConfig().extraCurrencies
            };
        };
        return GroupOffers;
    }(BaseModel_1.BaseModel));
    exports.GroupOffers = GroupOffers;
});

},{"./BaseModel":8}],12:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var I18n = (function (_super) {
        __extends(I18n, _super);
        function I18n(config) {
            _super.call(this, config);
        }
        I18n.prototype.getRequiredParams = function () {
            return ['template', 'module', 'locale'];
        };
        I18n.prototype.getOptionalParams = function () {
            return ['output'];
        };
        I18n.prototype.getURLPath = function () {
            return '/i18n';
        };
        I18n.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                template: this.getConfig().template,
                locale: this.getConfig().locale,
                module: this.getConfig().module
            };
        };
        return I18n;
    }(BaseModel_1.BaseModel));
    exports.I18n = I18n;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = I18n;
});

},{"./BaseModel":8}],13:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var Location = (function (_super) {
        __extends(Location, _super);
        function Location(config) {
            _super.call(this, config);
        }
        Location.prototype.getRequiredParams = function () {
            return ['property', 'locale'];
        };
        Location.prototype.getOptionalParams = function () {
            return ['template', 'output'];
        };
        Location.prototype.getURLPath = function () {
            return '/location';
        };
        Location.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                template: this.getConfig().template,
                property: this.getConfig().property,
                locale: this.getConfig().locale
            };
        };
        return Location;
    }(BaseModel_1.BaseModel));
    exports.Location = Location;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Location;
});

},{"./BaseModel":8}],14:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var Offers = (function (_super) {
        __extends(Offers, _super);
        function Offers(config) {
            _super.call(this, config);
        }
        Offers.prototype.getRequiredParams = function () {
            return ['property', 'locale'];
        };
        Offers.prototype.getOptionalParams = function () {
            return ['template', 'output', 'orderBy', 'currency', 'roomRestriction', 'extraCurrencies', 'rateName', 'stripTags'];
        };
        Offers.prototype.getURLPath = function () {
            return '/offers';
        };
        Offers.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                template: this.getConfig().template,
                property: this.getConfig().property,
                orderBy: this.getConfig().orderBy,
                rateName: this.getConfig().rateName,
                stripTags: this.getConfig().stripTags,
                locale: this.getConfig().locale,
                currency: this.getConfig().currency,
                roomRestriction: this.getConfig().roomRestriction,
                extraCurrencies: this.getConfig().extraCurrencies
            };
        };
        return Offers;
    }(BaseModel_1.BaseModel));
    exports.Offers = Offers;
});

},{"./BaseModel":8}],15:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var Property = (function (_super) {
        __extends(Property, _super);
        function Property(config) {
            _super.call(this, config);
        }
        Property.prototype.getRequiredParams = function () {
            return ['property'];
        };
        Property.prototype.getOptionalParams = function () {
            return ['locale', 'template', 'output'];
        };
        Property.prototype.getURLPath = function () {
            return '/property';
        };
        Property.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                property: this.getConfig().property,
                locale: this.getConfig().locale,
                template: this.getConfig().template
            };
        };
        return Property;
    }(BaseModel_1.BaseModel));
    exports.Property = Property;
});

},{"./BaseModel":8}],16:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var PropertyTranslations = (function (_super) {
        __extends(PropertyTranslations, _super);
        function PropertyTranslations(config) {
            _super.call(this, config);
        }
        PropertyTranslations.prototype.getRequiredParams = function () {
            return ['property', 'locale'];
        };
        PropertyTranslations.prototype.getOptionalParams = function () {
            return ['stripTags', 'output'];
        };
        PropertyTranslations.prototype.getURLPath = function () {
            return '/property-translations';
        };
        PropertyTranslations.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                property: this.getConfig().property,
                locale: this.getConfig().locale,
                stripTags: this.getConfig().stripTags
            };
        };
        return PropertyTranslations;
    }(BaseModel_1.BaseModel));
    exports.PropertyTranslations = PropertyTranslations;
});

},{"./BaseModel":8}],17:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './BaseModel'], factory);
    }
})(function (require, exports) {
    "use strict";
    var BaseModel_1 = require('./BaseModel');
    var Quotation = (function (_super) {
        __extends(Quotation, _super);
        function Quotation(config) {
            _super.call(this, config);
        }
        Quotation.prototype.getRequiredParams = function () {
            return ['property', 'arrivalDate', 'adults'];
        };
        Quotation.prototype.getOptionalParams = function () {
            return ['output', 'roomRestriction', 'extraCurrencies', 'rateName', 'currency', 'nights'];
        };
        Quotation.prototype.getURLPath = function () {
            return '/quotation';
        };
        Quotation.prototype.getURLParams = function () {
            return {
                output: this.getConfig().output,
                property: this.getConfig().property,
                arrivalDate: this.getConfig().arrivalDate,
                nights: this.getConfig().nights,
                currency: this.getConfig().currency,
                rateName: this.getConfig().rateName,
                extraCurrencies: this.getConfig().extraCurrencies,
                roomRestriction: this.getConfig().roomRestriction,
                adults: this.getConfig().adults,
            };
        };
        return Quotation;
    }(BaseModel_1.BaseModel));
    exports.Quotation = Quotation;
});

},{"./BaseModel":8}],18:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Accommodations', './Availabilities', './BestSinglePrice', './Gallery', './GroupOffers', './I18n', './Location', './Offers', './Property', './PropertyTranslations', './Quotation'], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(require('./Accommodations'));
    __export(require('./Availabilities'));
    __export(require('./BestSinglePrice'));
    __export(require('./Gallery'));
    __export(require('./GroupOffers'));
    __export(require('./I18n'));
    __export(require('./Location'));
    __export(require('./Offers'));
    __export(require('./Property'));
    __export(require('./PropertyTranslations'));
    __export(require('./Quotation'));
});

},{"./Accommodations":6,"./Availabilities":7,"./BestSinglePrice":9,"./Gallery":10,"./GroupOffers":11,"./I18n":12,"./Location":13,"./Offers":14,"./Property":15,"./PropertyTranslations":16,"./Quotation":17}],19:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../endpoints/Quotation', '../endpoints/Availabilities', './index'], factory);
    }
})(function (require, exports) {
    "use strict";
    var Quotation_1 = require('../endpoints/Quotation');
    var Availabilities_1 = require('../endpoints/Availabilities');
    var index_1 = require('./index');
    var PriceOnCalendar = (function () {
        function PriceOnCalendar() {
        }
        PriceOnCalendar.prototype.callMeOnInit = function (cback) {
            if (this.isLoaded()) {
                return cback(null);
            }
            this.init(cback);
        };
        PriceOnCalendar.prototype.getPrice = function (cfg, cback) {
            var _this = this;
            if (typeof (cfg) === 'string' || cfg instanceof Date) {
                cfg = { date: cfg };
            }
            this.callMeOnInit(function (err) {
                if (err) {
                    return cback(err);
                }
                var _a = cfg, _date = _a.date, _b = _a.nbNights, nbNights = _b === void 0 ? 1 : _b, _c = _a.nbAdults, nbAdults = _c === void 0 ? 1 : _c;
                var quotation = _this.buildQuotation({
                    adults: nbAdults,
                    nights: nbNights,
                    arrivalDate: index_1.formatDate(index_1.castToDate(_date))
                });
                _this.loadQuotation(quotation, cback);
            });
        };
        PriceOnCalendar.prototype.loadQuotation = function (quotation, cback) {
            quotation.load(function (err) {
                if (err) {
                    return cback(err);
                }
                cback(null, quotation.getRawData()[0]);
            });
        };
        PriceOnCalendar.prototype.isCheckoutableFrom = function (_from, _to) {
            var possibleChe = this.possibleCheckouts(_from);
            var from = index_1.castToDate(_from);
            var to = index_1.castToDate(_to);
            if (from.getTime() >= to.getTime()) {
                return false;
            }
            if (possibleChe === null) {
                return true;
            }
            var daysDelay = Math.floor((to.getTime() - from.getTime()) / (24 * 3600 * 1000));
            return possibleChe.indexOf(daysDelay) !== -1;
        };
        /**
         * REturns all the possible checkouts from a given arrivalDate.
         * If the return data is null then no particoular restrictions are
         * set.
         * @param date
         * @returns {null}
         */
        PriceOnCalendar.prototype.possibleCheckouts = function (date) {
            return null;
        };
        PriceOnCalendar.from = function (cfg) {
            if (cfg instanceof Availabilities_1.Availabilities) {
                return new PriceOnCalendarWithAvailabilities(cfg);
            }
            return new PriceOnCalendarWithoutAvailabilities(cfg);
        };
        return PriceOnCalendar;
    }());
    exports.PriceOnCalendar = PriceOnCalendar;
    /**
     * @private
     */
    var PriceOnCalendarWithAvailabilities = (function (_super) {
        __extends(PriceOnCalendarWithAvailabilities, _super);
        function PriceOnCalendarWithAvailabilities(availability) {
            _super.call(this);
            this.availability = availability;
            this.onInitToCall = [];
            this.initializing = false;
        }
        PriceOnCalendarWithAvailabilities.prototype.init = function (cback) {
            var _this = this;
            if (this.availability.isLoaded()) {
                return cback(null);
            }
            this.onInitToCall.push(cback);
            if (!this.initializing) {
                this.initializing = true;
                this.availability.load(function (err) {
                    _this.onInitToCall.forEach(function (cback) { return cback(err); });
                    _this.initializing = false;
                });
                return;
            }
        };
        PriceOnCalendarWithAvailabilities.prototype.isLoaded = function () {
            return this.availability.isLoaded();
        };
        PriceOnCalendarWithAvailabilities.prototype.buildQuotation = function (_a) {
            var adults = _a.adults, nights = _a.nights, arrivalDate = _a.arrivalDate;
            if (this.availability.isDateBookable(arrivalDate)) {
                //console.log('bookable');
                var checkouts = this.availability.rawCheckouts(arrivalDate);
                //console.log(checkouts);/
                nights = Math.min(checkouts[checkouts.length - 1], Math.max(nights, checkouts[0]));
            }
            return new Quotation_1.Quotation({
                roomRestriction: this.availability.getConfig().roomRestriction,
                rateName: this.availability.getConfig().rateName,
                adults: adults,
                nights: nights,
                arrivalDate: arrivalDate,
                property: this.availability.getConfig().property,
            });
        };
        PriceOnCalendarWithAvailabilities.prototype.possibleCheckouts = function (date) {
            return this.availability.rawCheckouts(date);
        };
        PriceOnCalendarWithAvailabilities.prototype.loadQuotation = function (quotation, cback) {
            var isBookable = this.availability.isDateBookable({
                date: quotation.getConfig().arrivalDate,
                nbNights: quotation.getConfig().nights
            });
            if (!isBookable) {
                return cback(null);
            }
            return _super.prototype.loadQuotation.call(this, quotation, cback);
        };
        return PriceOnCalendarWithAvailabilities;
    }(PriceOnCalendar));
    /**
     * @private
     */
    var PriceOnCalendarWithoutAvailabilities = (function (_super) {
        __extends(PriceOnCalendarWithoutAvailabilities, _super);
        function PriceOnCalendarWithoutAvailabilities(config) {
            _super.call(this);
            this.config = config;
        }
        PriceOnCalendarWithoutAvailabilities.prototype.init = function (cback) {
            cback(null);
        };
        PriceOnCalendarWithoutAvailabilities.prototype.isLoaded = function () {
            return true;
        };
        PriceOnCalendarWithoutAvailabilities.prototype.buildQuotation = function (_a) {
            var adults = _a.adults, nights = _a.nights, arrivalDate = _a.arrivalDate;
            return new Quotation_1.Quotation({
                roomRestriction: this.config.roomRestriction,
                rateName: this.config.rateName,
                property: this.config.property,
                adults: adults,
                nights: nights,
                arrivalDate: arrivalDate
            });
        };
        return PriceOnCalendarWithoutAvailabilities;
    }(PriceOnCalendar));
});

},{"../endpoints/Availabilities":7,"../endpoints/Quotation":17,"./index":20}],20:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './PriceOnCalendar'], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    function twoZeroPad(_dataEntity) {
        var dataEntity = "" + _dataEntity;
        if (dataEntity.length == 1) {
            return "0" + dataEntity;
        }
        return dataEntity;
    }
    exports.twoZeroPad = twoZeroPad;
    function formatDate(date) {
        return date.getFullYear() + "-" + twoZeroPad(date.getMonth() + 1) + "-" + twoZeroPad(date.getDate());
    }
    exports.formatDate = formatDate;
    function castToDate(date) {
        if (date instanceof Date) {
            return date;
        }
        var splits = date.split('-');
        return new Date(parseInt(splits[0]), parseInt(splits[1]) - 1, parseInt(splits[2]));
    }
    exports.castToDate = castToDate;
    __export(require('./PriceOnCalendar'));
});

},{"./PriceOnCalendar":19}]},{},[5])(5)
});
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty  = Object.prototype.hasOwnProperty,
        hasDontEnumBug  = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums       = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {

    var k;

    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
},{}]},{},[1]);



var subsite_hotel_rest_url = fjtss_data.group_rest_url + 'hotels/' + fjtss_data.site_slug ;
fjtss_get_json( subsite_hotel_rest_url,  function( hotel_data ) {
	if ( hotel_data.hotel_fb_hid ) {

		// START WEB SDK CODE
		$('#js_websdk__home-offers').each(function() {
			var container = $(this),
				model_name = container.data('websdk'),
				id = container.attr('id'),
				custom_template = container.data('websdk-template'),
				template_id, config, model, template, html;
				template_id = custom_template ? custom_template : '#'+id+'_template';

			template = $(template_id).text();
			if (typeof websdk_config !== 'undefined'  && typeof websdk_config[id] !== 'undefined') {

				// set the property of current subsite
				websdk_config[id]['params']['property'] = hotel_data.hotel_fb_hid;

				config = websdk_config[id];
				$fbsdk.baseHost = config.baseHost;
				model = new $fbsdk[model_name](config.params);
				model.setAuthToken(config._authCode);
				model.load(function(error) {
					var data,i;
					if (!error) {
						//YEAH, this happens when we have data and we're ready to use it!
						data=this.getRawData();
						
						var promotion = data.rates[0];
						var title = jQuery.parseHTML(promotion.rate.title);
						jQuery('.promotion .card__title').text($(title).text());
						jQuery('.promotion .card__price').text(promotion.quotation.pricePerNight.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' ' + promotion.quotation.currency);
						jQuery('.promotion .card__button').attr('onclick', promotion.quotation.jsBookLink);
						jQuery('.promotion .card__link').click(function(){
							$(this).empty();
							jQuery('.promotion .details').append(promotion.rate.html_description);
						})
					}
				});
			}
		});
		// END WEB SDK CODE;

	}
})
