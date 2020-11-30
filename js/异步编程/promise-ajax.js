const ajax = url => {
    let xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = function() {
            if(this.status === 200) {
                resolve(this.response)
            } else {
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })

}

export default ajax