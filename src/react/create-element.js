/**
 * Created by huangw1 on 2018/4/17.
 */

const createElement = (tag, attrs, ...children) => {
	return {
		tag,
		attrs,
		children
	}
}

export default createElement