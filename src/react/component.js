/**
 * Created by huangw1 on 2018/4/17.
 */

import enqueueState from './state-queue'

export default class Component {

	constructor(props = {}) {
		this.isReactComponent = true
		this.props = props
		this.state = {}
	}

	setState(newState) {
		// Object.assign(this.state, newState)
		// renderComponent(this)
		enqueueState(newState, this)
	}
}