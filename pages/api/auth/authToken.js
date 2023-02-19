export function authToken(ctx){
    return new Promise((resolve, reject) => {
        if(ctx.req.cookies.token) {
            return ctx.res.writeHead(302, {
                location: "/"
                
        }).end()}
        else{
            return resolve("Unauthorize")
        }
    })
}

export function verifyToken(ctx){
    return new Promise((resolve) => {
        if(!ctx.req.cookies.token) return ctx.res.writeHead(302, {
            location: "/login"
        }).end()
        
        return resolve(ctx.req.cookies.token)
    })
}