'use strict';
var _ = require('lodash');

function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}

module.exports = Scope;

function initWatchVal (){}

Scope.prototype.$watch = function (watchFn,listenerFn,valueEq) {
    var watcher = {
        watchFn:watchFn,
        listenerFn:listenerFn || function(){},
        valueEq: !!valueEq,
        last : initWatchVal
    };
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch = null;
};

Scope.prototype.$$digestOnce = function () {
    var newValue, oldValue, dirty;
    var self = this;
    _.forEach(this.$$watchers,function (watcher) {
        try {
            newValue = watcher.watchFn(self);
            oldValue = watcher.last;
            if(!self.$$areEqual(newValue,oldValue,watcher.valueEq)) {
                self.$$lastDirtyWatch = watcher;
                watcher.last = (watcher.valueEq)?_.cloneDeep(newValue):newValue;
                watcher.listenerFn(newValue,
                    oldValue === initWatchVal ? newValue : oldValue,self);
                dirty = true;
            }
            else if (self.$$lastDirtyWatch == watcher){
                return false;
            }
        } catch (e) {
            console.log(e)
        }
    });
    return dirty;
};

Scope.prototype.$digest = function () {
    var dirty, ttl=10;
    this.$$lastDirtyWatch = null;
    do{
        dirty = this.$$digestOnce();
        if(dirty && !(ttl--)){
            throw '10 digest iterations reached';
        }
    }while(dirty) ;
};

Scope.prototype.$$areEqual = function(newValue,oldValue,valueEq){
    if(valueEq){
        return _.isEqual(newValue,oldValue);
    } else {
        return newValue === oldValue || (typeof newValue === 'number' && typeof oldValue === 'number'
        && isNaN(oldValue) && isNaN(newValue)); 
    }
};