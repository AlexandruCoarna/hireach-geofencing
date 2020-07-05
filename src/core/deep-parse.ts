const deepParse = (input: string | object): any => {
    let obj;

    if (typeof input === "string" && input) {
        try {
            obj = JSON.parse(input);
        } catch (e) {
            return input;
        }
    } else if (typeof input === "object") {
        obj = input;
    } else {
        return input;
    }

    if (Array.isArray(obj)) {
        return obj;
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = deepParse(obj[key]);
        }
    }

    return obj;
}

export default deepParse;