/**
 * Created by huangw1 on 2018/4/19.
 */

import { isFunction} from '../react-dom/util'
import { renderComponent} from '../react-dom/render'

const stateQueue = []
const componentQueue = []

const defer = (fn) => {
	Promise.resolve().then(fn)
}

const flush = () => {
	let stateQueueItem
	let component
	while(stateQueueItem = stateQueue.shift()) {
		const { newState, component } = stateQueueItem
		if(!component.prevState) {
			component.prevState = Object.assign({}, component.state)
		}
		if(isFunction(newState)) {
			Object.assign(component.state, newState(component.prevState, component.props))
		} else {
			Object.assign(component.state, newState)
		}
		component.prevState = component.state
	}
	while(component = componentQueue.shift()) {
		renderComponent(component)
	}
}

const enqueueState = (newState, component) => {
	if(!stateQueue.length) {
		defer(flush)
	}
	stateQueue.push({
		newState,
		component
	})
	if(!componentQueue.find((item) => item == component)) {
		componentQueue.push(component)
	}
}

export default enqueueState