export function getAreaValue(dataList, t){
	console.log(t)
	if(!t){
		return {}
	}

	var nameObj = {}
	var name = '';
	var code = '';

	if (t[0]) {
		let e = dataList.value.filter(res => res.code === t[0])[0];
		nameObj[0] = e.name;
		name = name + e.name;
		code=t[0]
		if (t[1]) {
			let f = e.children.filter(res => res.code === t[1])[0];
			code=t[1]

			nameObj[1] = f.name;
			name = name + f.name;

			if (t[2]) {
				let g = f.children.filter(res => res.code === t[2])[0];
				code=t[2]

				nameObj[2] = g.name;
				name = name + g.name;

			}
		}
	}

	return {
		value: t, nameObj: nameObj, name: name,code:code
	}
}


