const API_URL = 'http://localhost:5000/api/'

export function makeHTTPGETRequest(endpoint, queryParams ={}){
    const token = localStorage.getItem('token');
    const url = new URL(API_URL + endpoint); //route url
    Object.entries(queryParams).forEach(([key, value])=>{
        url.searchParams.append(key,value);
    }); //if have parameters, if not, go to routes in backend
    return fetch(url, {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    }).then((response)=>{
        return response.json();
    }).catch((error)=>{
        console.error("Error Fetching Data:", error);
    })
}

export function makeHTTPPOSTRequest(endpoint, bodyParams={}, tokenOverride = null){
    const token = tokenOverride || localStorage.getItem('token');
    const url = new URL(API_URL + endpoint);
    console.log(`POST Request to ${url}`, token);
    const headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type" : "application/json",
    });
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bodyParams),
    }
    return fetch(url, options).then(
        (response) =>{
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        }).catch((error)=>{
            console.error("Error Posting:", error);
            throw error;
        })
}

export function makeHTTPPUTRequest(endpoint, bodyParams={}){
    const token = localStorage.getItem('token');
    const url = new URL(API_URL + endpoint);
    // console.log(`POST Request to ${url}`);
    const headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type" : "application/json",
    });
    const options = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(bodyParams),
    }
    return fetch(url, options).then(
        (response) =>{
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        }).catch((error)=>{
            console.error("Error PUting:", error);
            throw error;
        })
}

export function makeHTTPDELETERequest(endpoint, queryParams ={}){
    const token = localStorage.getItem('token');
    const url = new URL(API_URL + endpoint); //route url

    const headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type" : "application/json",
    });

    const options = {
        method: "DELETE",
        headers: headers
    }

    Object.entries(queryParams).forEach(([key, value])=>{
        url.searchParams.append(key,value);
    }); //if have parameters, if not, go to routes in backend

    return fetch(url, options).then(
        (response) =>{
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        }).catch((error)=>{
            console.error("Error PUting:", error);
            throw error;
        })
}
