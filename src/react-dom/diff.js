/**
 * Created by huangw1 on 2018/4/17.
 */

import { isString, isNumber, isFunction, isSameType } from './util'
import { createComponent, setComponentProps, unmoutComponent } from './render'
import { setAttribute } from './dom'

/**
 * 更新策略：
 * 1. 保存上次渲染的虚拟 DOM，对比虚拟 DOM 前后变化，应用到真实 DOM
 * 2. 直接对比虚拟 DOM 和真实 DOM，不需额外保存上次渲染的虚拟 DOM
 * 3. diff 使用 2 策略
 * @param node 真实节点
 * @param vnode 虚拟节点
 * @param container 容器
 * @returns {*}
 */
export function diff(node, vnode, container) {
	const dom = diffNode(node, vnode)
	if(container && dom.parentNode != container) {
		container.appendChild(dom)
	}
	return dom
}

export function diffNode(node, vnode) {
	if(!vnode) {
		vnode = ''
	}
	if(isNumber(vnode)) {
		vnode = String(vnode)
	}
	if(isString(vnode)) {
		return diffText(node, vnode)
	}
	if(isFunction(vnode.tag)) {
		return diffComponent(node, vnode)
	}

	let dom = node
	if(!node || !isSameType(node, vnode)) {
		dom = document.createElement(vnode.tag)
		if(node) {
			Array.from(node.childNodes).forEach((childNode) => {
				dom.appendChild(childNode)
			})
			if(node.parentNode) {
				node.parentNode.replaceChild(dom, node)
			}
		}
	}
	if((vnode.children && vnode.children.length) || (dom.childNodes && dom.childNodes.length)) {
		diffChildren(dom, vnode)
	}
	diffAttributes(dom, vnode)

	return dom
}

// 文本节点
function diffText(node, vnode) {
	if(node && isSameType(node, vnode)) {
		if(node.textContent != vnode) {
			node.textContent = vnode
		}
		return node
	} else {
		const dom = document.createTextNode(vnode)
		if(node && node.parentNode) {
			node.parentNode.replaceChild(dom, node)
		}
		return dom
	}
}

// 组件节点
function diffComponent(node, vnode) {
	const prevComponent = node && node._component
	// 相同节点
	if(node && isSameType(node, vnode)) {
		setComponentProps(prevComponent, vnode.attrs)
		return prevComponent.base
	}

	if(prevComponent) {
		unmoutComponent(prevComponent)
	}

	const newComponent = createComponent(vnode.tag, vnode.attrs)
	setComponentProps(newComponent, vnode.attrs)
	return newComponent.base
}

// 组件子元素
function diffChildren(node, vnode) {
	const childNodes = node.childNodes || []
	const vchildren = vnode.children || []
	const children = [] // 未标记
	const keyChildren = {} // 已标记

	Array.from(childNodes).forEach((childNode) => {
		const key = childNode.key
		if(key) {
			keyChildren[key] = childNode
		} else {
			children.push(childNode)
		}
	})

	if(vchildren.length) {
		let min = 0
		let vchildrenLength = vchildren.length
		vchildren.forEach((vchild, index) => {
			let child = null
			const key = vchild.key
			if(key) {
				if(keyChildren[key]) {
					child = keyChildren[key]
					keyChildren[key] = undefined
				} else if(min < vchildrenLength) {
					// 尝试从现有的孩子节点中找出类型相同的节点
					for(let i = min; i < vchildrenLength; i++) {
						let c = children[i]
						if(c && isSameType(c, vchild)) {
							child = c
							children[i] = undefined
							if (i == vchildrenLength - 1) {
								vchildrenLength--
							}
							if(i == min) {
								min++
							}
							break
						}

					}

				}
			}
			child = diff(child, vchild)
			if(child && childNodes[index] != child) {
				if(!childNodes[index]) {
					node.appendChild(child)
				} else if(childNodes[index].nextSibling == child) {
					if(child.parentNode) {
						child.parentNode.removeChild(childNodes[index])
					}
				} else {
					node.insertBefore(child, childNodes[index])
				}
			}
		})
	}
}

// 收集属性
const diffProps = (node, vnode) => {
	let index = 0
	const oldProps = node.attributes
	const newProps = vnode.attrs
	const propsPatches = {}

	Object.keys(oldProps).forEach((key) => {
		if(newProps[key] != oldProps[key]) {
			propsPatches[key] = newProps[key]
			index++
		}
	})

	Object.keys(newProps).forEach((key) => {
		if(!oldProps.hasOwnProperty(key)) {
			propsPatches[key] = newProps[key]
			index++
		}
	})

	if(!index) {
		return null
	}
	return propsPatches
}

// 应用属性
function diffAttributes(node, vnode) {
	const propsPatches = diffProps(node, vnode)
	if(propsPatches) {
		Object.keys(propsPatches).forEach((key) => {
			setAttribute(node, key, propsPatches[key])
		})
	}
}
