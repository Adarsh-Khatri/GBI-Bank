import axios from "axios";

// const baseURL = 'http://localhost:2100';
const baseURL = 'https://gbi-bank-ucw3.onrender.com';

function get(url) {
    return axios.get(baseURL + url)
}

function post(url, obj) {
    return axios.post(baseURL + url, obj)
}

function put(url, obj) {
    return axios.put(baseURL + url, obj)
}

function deleteApi(url) {
    return axios.delete(baseURL + url)
}


export { get, post, put, deleteApi }; 