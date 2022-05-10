// api protecter api by express-jwt
const express_jwt = require('express-jwt')
require('dotenv').config()
function apiProtecter() {
    const secret = process.env.Secret
    return express_jwt({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    })
        .unless({
            path: [
                // Restrict the users only they could have to able to get those product with out token
                { url: '/\/api\/v1\/product(.*)/', methods: ['GET', 'OPTIONS'] },
                { url: '/\/api\/v1\/category(.*)/', methods: ['GET', 'OPTIONS'] },
                { url: '/\/public\/uploads/', methods: ['GET', 'OPTIONS'] },//this route should'nt have to access token because all the images are store in it
                '/api/v1/user/login',
                '/api/v1/user/register',
            ]
        })
}
// role for the admin by checking its access token and give apermis jwt and  
async function isRevoked(payload, done, req) {
    if (!payload.isAdmin) {
        done(null, true)
    }
    done()
}
module.exports = apiProtecter