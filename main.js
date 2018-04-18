/**
 * Created by huangw1 on 2018/4/16.
 */

import React from './src/react'
import ReactDOM from './src/react-dom'


class Counter extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			num: 1
		}
		this.onClick = this.onClick.bind(this)
	}

	onClick() {
		this.setState({num: this.state.num + 1})
	}

	render() {
		return (
			<div>
				<h1>count: { this.state.num }</h1>
				<button onClick={this.onClick}>add</button>
			</div>
		)
	}
}

ReactDOM.render(<Counter />, document.getElementById('app'))

