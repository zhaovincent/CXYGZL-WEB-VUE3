import moment from 'moment'

export function isBlank(s) {
	if (s === undefined || s === null || ((typeof s) === 'string' && s.trim().length == 0)) {
		return true;
	}
	return false;
}


export function isNotBlank(s) {
	return !isBlank(s);
}

export function isNode(obj) {
	return isNotBlank(obj) && isNotBlank(obj.id);

}

export function getRandomId() {
	return `cxygzl_${new Date().getTime().toString().substring(5)}${Math.round(
		Math.random() * 9000 + 1000
	)}`;

}

export function getNumberRadixNum(s) {
	let strings = s.toString().split(".");
	if(strings.length<=1){
		return 0;
	}
	return strings[1].toString().length;

}

export function deepCopy(s) {
	return JSON.parse(JSON.stringify(s));

}

export function momentFunc(a,b) {
	return  moment(a,b)

}