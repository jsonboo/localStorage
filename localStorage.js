/**
 * copy@
 */
'use strict';
var localStorage = window.localStorage;
var splitStrStart = '<#lsvalid#>';
var splitStrEnd = '</#lsvalid#>';
var splitReg = new RegExp("^(\<#lsvalid#\>)(.*)(\<\/#lsvalid#\>)$");

/**
 * 数据库模块
 */
var Storage = function() {};
var storagePrototype = Storage.prototype;

/**
 * deleteData() 删除记录
 * @param {String}       // 需要被删除的记录的name
 * @param options = {         //可选参数
 *    success : function(){} ,   //操作成功时的操作
 *    error : function(){}     //操作失败时的操作
 *  }
 */
storagePrototype.deleteData = function(key, options) {
    if (!localStorage) {
        return;
    }
    options = options || {};
    try {
        localStorage.removeItem(key);
        options.success && options.success();
    } catch (e) {
        options.error && options.error();
    }
};
/**
 * addData() 添加记录
 * @param key String  //key
 * @param  value = [        //需要添加的value
 *    {"v" : "......", "n" : "......", "c" : "......"}
 *  ]
 * @param options = {         //可选参数
 *    success : function(){} ,   //操作成功时的操作
 *    error : function(){}     //操作失败时的操作
 *  }
 */
storagePrototype.addData = function(key, value, options) {
    if (!localStorage) {
        return;
    }

    options = options || {};
    try {
        // 保证存储完整性
        localStorage.setItem(key, splitStrStart + JSON.stringify(value) + splitStrEnd);
        options.success && options.success();
    } catch (e) {
        options.error && options.error();
    }
};
/**
 * getData() 返回记录
 * @param key String
 * @param {string} value //key对应的value
 */
storagePrototype.getData = function(key) {
    if (!localStorage) {
        return;
    }
    var value = localStorage.getItem(key);

    if (value === null) {
        return null;
    }

    //检查完整性
    var match = null;
    if (match = value.match(splitReg)) {
        value = match[2];
        return JSON.parse(value);
    }
};
/**
 * selectData() 查找记录
 * @param n {String} //需要查询的记录的n字段
 * @param op = {          //可选参数
 *    s : function(){} ,   //操作成功时的操作
 *    f : function(){}     //操作失败时的操作
 *  }
 */
storagePrototype.selectData = function(key, options) {
    if (!localStorage) {
        return;
    }
    var value = localStorage.getItem(key);

    var result;
    options = options || {};
    if (value === null) {
        options.success && options.success(value);
        return;
    }
    //检查完整性
    var match = null;
    if (match = value.match(splitReg)) {
        value = match[2];
        try {
            result = JSON.parse(value);
            options.success && options.success(result);
        } catch (e) {
            options.error && options.error();
        }
    } else {
        options.error && options.error();
    }
};

module.exports = new Storage();

