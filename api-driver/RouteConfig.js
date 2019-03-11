'use strict';

const querystring = require('querystring');
const Handlebars = require('handlebars');
Handlebars.registerHelper('escapeurl', function(url) {

    return new Handlebars.SafeString(querystring.escape(url));
});

/**
 * Route config.
 * @param fullName
 * @param {Object} routeConfig
 * @param {String} [routeConfig.customImplementationsModule]
 * @constructor
 */
const RouteConfig = function(fullName, routeConfig) {

    const fullNameArray = fullName.split('.');

    /**
     * @type {Object}
     * @property customImplementation
     */
    this.rawConfig = routeConfig;

    this.fullName = fullName;
    // last string after '.' is the name of the route
    this.name = fullNameArray.pop();
    // the rest of array (if any) is the ordered array of namespace hierarchy
    this.namespaceSequence = fullNameArray;
    // Handlebars template
    this.template = Handlebars.compile(JSON.stringify(routeConfig), { strict: true });
};

RouteConfig.prototype.getJson = function(parameters) {

    return JSON.parse(this.template(parameters));
};

module.exports = RouteConfig;
