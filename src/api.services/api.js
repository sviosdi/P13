import axios, { Axios } from 'axios'

const BASE_URL = 'http://localhost:3001/api/v1'

class BackendService {
    authenticate = async ({ username, password }) => {
        return axios
            .post(BASE_URL + '/user/login', {
                email: username,
                password,
            })
            .then((response) => {
                return {
                    posted: true,
                    ok: true,
                    token: response.data.body.token,
                }
            })
            .catch(function (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.status === 400
                )
                    return {
                        posted: true,
                        ok: false,
                        msg: error.response.data.message,
                    }
                else return { posted: false }
            })
    }

    getProfile = async (token) => {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        return axios
            .post(BASE_URL + '/user/profile', {}, config)
            .then(({ data }) => {
                return {
                    ok: true,
                    firstname: data.body.firstName,
                    lastname: data.body.lastName,
                    email: data.body.email,
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.status === 401 // invalid token
                )
                    return {
                        ok: false,
                        msg: error.response.data.message,
                    }
                else return { posted: false } // server down
            })
    }

    udpateName = async (token, body) => {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        return axios
            .put(BASE_URL + '/user/profile', body, config)
            .then(({ data }) => {
                return data.status === 200
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.status === 401 // invalid token
                )
                    return {
                        ok: false,
                        msg: error.response.data.message,
                    }
                else return { posted: false } // server down
            })
    }

    getBalance = async (token, body) => {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        return axios
            .post(BASE_URL + '/transactions/balance', body, config)
            .then(({ data }) => {
                return {
                    ok: true,
                    balance: data.body.balance,
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.status === 401 // invalid token
                )
                    return {
                        ok: false,
                        msg: error.response.data.message,
                    }
                else return { posted: false } // server down
            })
    }

    getTransactions = async (token, body) => {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        return axios
            .post(BASE_URL + '/transactions/getall', body, config)
            .then(({ data }) => {
                return {
                    ok: true,
                    transactions: data.body,
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.status === 401 // invalid token
                )
                    return {
                        ok: false,
                        msg: error.response.data.message,
                    }
                else return { posted: false } // server down
            })
    }

    updateTransac = async (token, body) => {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        return axios
            .put(BASE_URL + '/transactions/update', body, config)
            .then(({ data }) => {
                console.log(data)
                return data.status === 200
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.status === 401 // invalid token
                )
                    return {
                        ok: false,
                        msg: error.response.data.message,
                    }
                else return { posted: false } // server down
            })
    }
}

export default new BackendService()
