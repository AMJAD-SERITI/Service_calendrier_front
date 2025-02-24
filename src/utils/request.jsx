import axios, {AxiosRequestConfig} from "axios";

const baseurl = 'http://localhost:8080';

export const apiEndPoint = (endPoint) => {
    return `${baseurl}${endPoint}`;
}

const _post = async (url, data, config) => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    return axios.post(apiEndPoint(url), data, config);
}

const _get = async (url, config) => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    return axios.get(apiEndPoint(url), config);
}

const _put = async (url, data, config) => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    return axios.put(apiEndPoint(url), data, config);
};

const _delete = async (url, config) => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    return axios.delete(apiEndPoint(url), config);
}

export const HttpClient = {_post, _get, _put, _delete};
