// const isTokenExpired = require("../utils/isTokenExpired")
// const refreshAccessToken = require("../utils/refreshAccessToken")
// const setTokensCookies = require("../utils/setTokenCookies")

// const accessTokenAutoRefresh=async(req,res,next)=>{
//     try {
//         const accessToken=req.cookies.accessToken
//         console.log(accessToken)
//         if(accessToken || !isTokenExpired(accessToken)){
//             //  Add the access token to the Authorization header
//             req.headers['authorization']=`Bearer ${accessToken}`
//         }
//         if(!accessToken || isTokenExpired(accessToken)){
//             const refreshToken=req.cookies.refreshToken;
//             if(!refreshToken){
//                 throw new Error('Refresh token is missing')
//             }
//             const {newAccessToken,newRefreshToken,newAccessTokenExp,newRefreshTokenExp}= await refreshAccessToken(req,res)
               
//             setTokensCookies(res,newAccessToken,newRefreshToken,newAccessTokenExp,newRefreshTokenExp)
//               //  Add the access token to the Authorization header
//               req.headers['authorization'] = `Bearer ${newAccessToken}`
//               console.log(req.headers['authorization'])
//             }
//             next()
//         }   
//      catch (error) {
//         console.error('Error adding access token to header:', error.message);
//         // Handle the error, such as returning an error response or redirecting to the login page
//         res.status(401).json({ error: 'Unauthorized', message: 'Access token is missing or invalid' });  
//     }

// }

// module.exports = accessTokenAutoRefresh


const isTokenExpired = require("../utils/isTokenExpired");
const refreshAccessToken = require("../utils/refreshAccessToken");
const setTokensCookies = require("../utils/setTokenCookies");

const accessTokenAutoRefresh = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log(accessToken);

        // If there is an access token and it is valid, add it to the header
        if (accessToken && !isTokenExpired(accessToken)) {
            req.headers['authorization'] = `Bearer ${accessToken}`;
            return next(); // If access token is valid, proceed to the next middleware
        }

        // If there is no access token or it is expired, attempt to refresh it
        if (!accessToken || isTokenExpired(accessToken)) {
        const refreshToken = req.cookies.refreshToken;
        // console.log("refreshgen", refreshToken)
        if (!refreshToken) {
            throw new Error('Refresh token is missing');
        }
        
        

        // Refresh the access token
        const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res);
        // console.log(newAccessToken,newRefreshToken)
        // Set the new tokens in cookies
        setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);

        // Add the new access token to the Authorization header
        req.headers['authorization'] = `Bearer ${newAccessToken}`;
        console.log(req.headers['authorization']);
    }
        // Continue to the next middleware
        next();
    
    } catch (error) {
        console.error('Error adding access token to header:', error.message);
        
        // Ensure that no response is sent after this block
        if (!res.headersSent) {
            // Handle the error, such as returning an error response or redirecting to the login page
            return res.status(401).json({ error: 'Unauthorized', message: 'Access token is missing or invalid' });
        }
    }
};

module.exports = accessTokenAutoRefresh;
