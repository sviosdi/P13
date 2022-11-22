import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api/v1'

class AuthService {
    authenticate = async ({ username, password }) => {
        console.log('( ', username, ';', password, ' )')
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
}

export default new AuthService()
