var _ = require('lodash');

function Scope() {
    this.$$watchers = Array();
};
module.exports = Scope;

Scope.prototype.$watch = function (watchFn,listenerFn) {
    var watcher = {
        watchFn:watchFn,
        listenerFn:listenerFn
    };
    Scope.$$watchers.push(watcher);
};

Scope.prototype.$digest = function () {
    _.forEach(this.$$watchers,function (watch) {
        watch.listenerFn();
    })
}