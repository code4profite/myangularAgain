var _ = require('lodash');

 function initWatchVal (){}

function Scope() {
    this.$$watchers = [];
}
module.exports = Scope;

Scope.prototype.$watch = function (watchFn,listenerFn) {
    var watcher = {
        watchFn:watchFn,
        listenerFn:listenerFn || function(){},
        last : initWatchVal
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$$digestOnce = function () {
    var newValue, oldValue, dirty;
    var self = this;
    _.forEach(this.$$watchers,function (watcher) {
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if(oldValue !==newValue) {
            watcher.last = newValue;
            watcher.listenerFn(newValue,
                oldValue === initWatchVal ? newValue : oldValue,self);
            dirty = true;
        }    
    });
    return dirty;
};

Scope.prototype.$digest = function () {
    var dirty, ttl=10;
    do{
        dirty = this.$$digestOnce();
        if(dirty && !(ttl--)){
            throw Error('10 digest iterations reached');
        }
    }while(dirty) ;
};