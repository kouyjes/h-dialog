class Http{
    static getText(url){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',url,true);
        var resolve,reject;
        var promise =  new Promise(function (resolve,reject) {
            resolve = resolve;
            reject = reject;
        });
        xhr['onreadystatechange'] = function () {
            var status = xhr.status;
            var isSuccess = status >= 200 && status < 300 || status === 304;
            if(isSuccess){
                resolve(xhr.responseText);
            }else{
                reject();
            }
        };
        xhr.onerror = function (e) {
            reject(e);
        };
        return promise;
    }
}