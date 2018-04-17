/**
 * Created by huangw1 on 2018/4/17.
 */

import { isString, isNumber, isObject } from './util'

const EVENT_REGEXP = /on(\w+)/

export const setAttribute = (node, key, value) => {
	if(key == 'className') {
		key = 'class'
	}
	if(EVENT_REGEXP.test(key) && value) {
		return node.addEventListener(key.match(EVENT_REGEXP)[1].toLowerCase(), value)
	} else if(key == 'style' && value) {
		if(isString(value)) {
			node.style.cssText = value
		} else if(isObject(value)) {
			Object.keys(value).forEach((key) => {
				node.style[key] = isNumber(value[key])? (value[key] + 'px'): value[key]
			})
		}
	} else if(value) {
		node.setAttribute(key, value)
	} else {
		node.removeAttribute(key)
	}
}