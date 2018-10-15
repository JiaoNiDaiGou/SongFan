const SERVER = 'https://dev-dot-songfan-dot-fluid-crane-200921.appspot.com'

export const callBackend = (verb, path, body) => {
    var url = SERVER + path
    console.log('CALL: ' + verb + ': ' + url)
    return new Promise((resolve, reject) => {
        fetch(url, {
                method: verb,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null
            })
            .then(res => {
                if (res.status >= 400) {
                    console.log('CALL FAIL:' + verb + ': ' + url)
                    throw Error(res.message)
                }
                console.log('CALL OK:' + verb + ': ' + url)
                resolve(res.json())
            })
    })
}