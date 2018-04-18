/**
 * Created by huangw1 on 2018/4/17.
 */

const type = (o) => Object.prototype.toString.call(o).match(/\[object\s+(.*)\]/)[1].toLowerCase()
const required = (param) => {
	return () => { throw `${param} is required` }
}

// 类型判断
export const isString = (str) => type(str) == 'string'
export const isNumber = (str) => type(str) == 'number'
export const isFunction = (str) => type(str) == 'function'
export const isObject = (str) => type(str) == 'object'

// 元素类型
export const ELEMENT_TYPE = {
	TEXT: 3
}

// 节点类型
export const isSameType = (node, vnode) => {
	if(isString(vnode) || isNumber(vnode)) {
		if(node.nodeType == ELEMENT_TYPE.TEXT) {
			return true
		}
	}
	if(isString(vnode.tag)) {
		if(node.tagName.toLowerCase() == vnode.tag.toLowerCase()) {
			return true
		}
	}
	return node._component && node._component.constructor === vnode.tag
}

