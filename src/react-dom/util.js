/**
 * Created by huangw1 on 2018/4/17.
 */

const type = (o) => Object.prototype.toString.call(o).match(/\[object\s+(.*)\]/)[1].toLowerCase()

export const isString = (str) => type(str) == 'string'
export const isNumber = (str) => type(str) == 'number'
export const isFunction = (str) => type(str) == 'function'
export const isObject = (str) => type(str) == 'object'