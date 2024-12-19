import { DOMAIN } from "./config"


export const logoutApi = async(jwtToken) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken
        }
    };

    // try {
    //     const response = await fetch(`${DOMAIN}/users/sign_in`, requestOptions);
    //     // const result = await response.json();

    //     // console.log(result)
    //     // if (response.ok) {
    //     //     return [result, ''];
    //     // }

    //     // return ['', result.errors || 'Unknown server error'];
    //     if (response.ok) {
    //         const response = await response.json();

    //         return [response, ''];
    //     }
    //     const errorMessage = await response.text();
    //     return ['', `Server side error: ${errorMessage} `];
    // } catch (error){
    //     return ['',`Server down: ${error}`]
    // }
    try {
        const response = await fetch(`${DOMAIN}/users/sign_out`, requestOptions);
    
        if (response.ok) {
            
            return [response, ''];
        }
    
        const errorText = await response.text(); 
        return ['', `Server side error: ${errorText}`];
    
    } catch (networkError) {
        return ['', `Server down: ${networkError.message}`];
    }
    
}