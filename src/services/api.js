import axios from 'axios'

const api = axios.create({
    baseURL: 'http://dcid.semsa/nobre/api'
})

export default api