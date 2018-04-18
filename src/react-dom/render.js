/**
 * Created by huangw1 on 2018/4/17.
 */

import { Component } from '../react'
import { setAttribute } from './dom'
import { isString, isNumber, isFunction } from './util'
import { diff, diffNode } from './diff'

// 创建组件 - 兼容
export function createComponent(component, props) {
	if(component.prototype && component.prototype.render) {
		return new component(props)
	} else {
		const instance = new Component(props)
		instance.constructor = component
		instance.render = function() {
			return this.constructor()
		}
		return instance
	}
}

// 卸载组件
export function unmoutComponent(component) {
	if(component.componentWillUnmount) {
		component.componentWillUnmount()
	}
	if(component.base && component.base.parentNode) {
		component.base.parentNode.removeChild(component.base)
	}
}

// render 后生命周期
export function renderComponent(component) {
	const rendered = component.render()
	if(component.base && component.componentWillUpdate) {
		component.componentWillUpdate()
	}

	const base = diffNode(component.base, rendered)
	if(component.base) {
		if(component.componentDidUpdate) {
			component.componentDidUpdate()
		}
	} else if(component.componentDidMount) {
		component.componentDidMount()
	}

	// 使用 diff
	// if(component.base && component.base.parentNode) {
	// 	component.base.parentNode.replaceChild(base, component.base)
	// }

	component.base = base
	base._component = component
	return base
}

// render 前生命周期
export function setComponentProps(component, props) {
	if(!component.base) {
		if(component.componentWillMount) {
			component.componentWillMount()
		}
	} else if(component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props)
	}
	component.props = props
	renderComponent(component)
}

export function renderNode(node) {
	if(node == undefined || node == null) {
		node = ''
	}
	if(isString(node) || isNumber(node)) {
		return document.createTextNode(String(node))
	}
	if(isFunction(node.tag)) {
		let component = createComponent(node.tag, node.attrs)
		setComponentProps(component, node.attrs)
		return component.base
	}

	const dom = document.createElement(node.tag)
	if(node.attrs) {
		Object.keys(node.attrs).forEach((key) => {
			setAttribute(dom, key, node.attrs[key])
		})
	}
	if(node.children) {
		node.children.forEach((child) => {
			return render(child, dom)
		})
	}
	return dom
}

export function render(vnode, container, node) {
	return diff(node, vnode, container)
}