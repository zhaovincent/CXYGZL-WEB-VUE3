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
    if (strings.length <= 1) {
        return 0;
    }
    return strings[1].toString().length;

}

export function deepCopy(s) {
    return JSON.parse(JSON.stringify(s));

}

export function sameJson(o1, o2) {
	o1=deepCopy(o1)
	o2=deepCopy(o2)
    if (typeof o1 != typeof o2) {
        return false;
    }
    if (o1 instanceof Array) {
        let l1 = o1.length;
        let l2 = o2.length;
        if (l1 != l2) {
            return false;
        }
        for (var k = 0; k < l1; k++) {
            let b = sameJsonObj(o1[k], o2[k]);
            if (!b) {
                return false;
            }
        }
        return true;
    }
    return sameJsonObj(o1, o2)
}

export function sameJsonObj(o1, o2) {
    if (typeof o1 != typeof o2) {
        return false;
    }

    var object1 = deepCopy(o1)
    var object2 = deepCopy(o2)

    const keys1 = Object.keys(object1).sort();

    const keys2 = Object.keys(object2).sort();

    if (keys1.length !== keys2.length) {

        return false;
    }

    for (let index = 0; index < keys1.length; index++) {
        let val1 = object1[keys1[index]];

        let val2 = object2[keys2[index]];

        let type1 = typeof val1;
        let type2 = typeof val2;


        if (type1 != type2) {
            return false;
        }
        if (type1 instanceof Object) {
            let b = sameJsonObj(val1, val2);
            if (!b) {
                return false;
            }
        } else if (val1 instanceof Array) {
            let l1 = val1.length;
            let l2 = val2.length;
            if (l1 != l2) {
                return false;
            }
            for (var k = 0; k < l1; k++) {
                let b = sameJsonObj(val1[k], val2[k]);
                if (!b) {
                    return false;
                }
            }

        } else if (val1 !== val2) {

            return false;
        }

    }
    return true;
}

export function momentFunc(a, b) {
    return moment(a, b)

}
