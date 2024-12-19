import { DOMAIN } from "./config"


export const registerApi = async(bodyObject) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObject)
    };

    // try {
    //     const response = await fetch(`${DOMAIN}/users`, requestOptions);
    //    // response = await response.json();

    //     // if (response.ok) {
    //     //     return [result, ''];
    //     // }

    //     // return ['', result.errors || 'Unknown server error'];
    //     if (response.ok) {
    //        const response = await response.json();

    //         return [response, ''];
    //     }
    //     const errorJson = JSON.parse(response); 
    //     const errorMessage = errorJson.errors || errorJson.message || 'An unknown error occurred';
    //     console.log(errorMessage)
    //     return ['', `Server side error: ${errorMessage} `];
    // } catch (error){
    //     return ['',`Server down: ${error}`]
    // }
    try {
        const response = await fetch(`${DOMAIN}/users`, requestOptions);
    
        if (response.ok) {
            
            return [response, ''];
        }
    
        const errorText = await response.text(); 
        let errorMessage = '';
    
        try {
            const errorJson = JSON.parse(errorText); 
            errorMessage = errorJson.errors || errorJson.message || 'An unknown error occurred';
        } catch (parseError) {
            errorMessage = 'Failed to parse server error'; 
        }
    
        console.error(errorMessage); 
        return ['', `Server side error: ${errorMessage}`];
    
    } catch (networkError) {
        console.error(`Network error: ${networkError}`);
        return ['', `Server down: ${networkError.message}`];
    }
    
}