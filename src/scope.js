var _ = require('lodash');

var initWatchVal = function(){}

function Scope() {
    this.$$watchers = [];
    this.last = initWatchVal;
}
module.exports = Scope;

Scope.prototype.$watch = function (watchFn,listenerFn) {
    var watcher = {
        watchFn:watchFn,
        listenerFn:listenerFn
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function () {
    var newValue, oldValue;
    var self = this;
    _.forEach(this.$$watchers,function (watcher) {
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if(oldValue !==newValue){
            watcher.last = newValue;
            watcher.listenerFn(newValue,oldValue,self);
        }
        
    });
}