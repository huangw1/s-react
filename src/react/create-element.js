/**
 * Created by huangw1 on 2018/4/17.
 */

const createElement = (tag, attrs, ...children) => {
	attrs = attrs || { key: undefined }
	return {
		tag,
		attrs,
		key: attrs.key,
		children
	}
}

export default createElement