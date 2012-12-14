function route(handle, pathname, response, request) {
    
    console.log("Almost routing " + pathname) 
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request)
    } else {
        handle["serve"](response,request,pathname)
    }

}

exports.route = route;
