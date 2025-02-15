const setTokensCookies=(res,accessToken,refreshToken,newAccessTokenExp,newRefreshTokenExp)=>{
   const accessTokenMaxAge= (newAccessTokenExp - Math.floor(Date.now()/1000)) * 1000;
   const refreshTokenMaxAge= (newRefreshTokenExp-Math.floor(Date.now()/1000)) * 1000;

 // Set Cookie for Access Token
    res.cookie('accessToken', accessToken,{
        maxAge:accessTokenMaxAge,
        httpOnly:true,
        secure:true
    })

//  Set Cookie for Refresh Token
    res.cookie('refreshToken', refreshToken, {
       maxAge:refreshTokenMaxAge,
       httpOnly: true,
       secure:true
    })

// Set Cookie for is_auth
    res.cookie('isLoggedin', true,{
        maxAge:refreshTokenMaxAge,
        httpOnly:false,
        secure:true
    }) 
}

module.exports = setTokensCookies

// const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
//     const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
//     const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  
//     // Set Cookie for Access Token
//     res.cookie('accessToken', accessToken, {
//       maxAge: accessTokenMaxAge,
//       httpOnly: true,
//       secure: true,           // cookie is only sent over HTTPS
//       sameSite: 'None'        // for cross-origin requests
//     });
  
//     // Set Cookie for Refresh Token
//     res.cookie('refreshToken', refreshToken, {
//       maxAge: refreshTokenMaxAge,
//       httpOnly: true,
//       secure: true,           // cookie is only sent over HTTPS
//       sameSite: 'None'        // for cross-origin requests
//     });
  
//     // Set Cookie for is_auth (non-HTTP only, may be used client-side)
//     res.cookie('isLoggedin', true, {
//       maxAge: refreshTokenMaxAge,
//       httpOnly: false,        // accessible client-side
//       secure: true,          // not required for non-secure cookies
//        sameSite: 'None' 
//     });
//   };
  
//   module.exports = setTokensCookies;

// const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
//   console.log("newAccessTokenExp:",newAccessTokenExp)
//     const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
//     console.log("accessTokenMaxAge", accessTokenMaxAge)
//     const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  
//     // Set Cookie for Access Token
//     res.cookie('accessToken', accessToken, {
//       maxAge: accessTokenMaxAge,
//       httpOnly: true,
//       secure: true,           // cookie is only sent over HTTPS
//       sameSite: 'None',        // for cross-origin requests
//       path: '/',
//     });
  
//     // Set Cookie for Refresh Token
//     res.cookie('refreshToken', refreshToken, {
//       maxAge: refreshTokenMaxAge,
//       httpOnly: true,
//       secure: true,           // cookie is only sent over HTTPS
//       sameSite: 'None',        // for cross-origin requests
//       path: '/',
//     });
  
//     // Set Cookie for is_auth (non-HTTP only, may be used client-side)
//     res.cookie('isLoggedin', true, {
//       maxAge: refreshTokenMaxAge,
//     httpOnly: false,            // Accessible by client-side
//     secure: true, // HTTPS in production
//     sameSite: 'None',  
//     path: '/',
//     });
//   };
  
//   module.exports = setTokensCookies;