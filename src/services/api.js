import axios from 'axios'

const api = axios.create({
    baseURL: 'http://dcid.semsa:3001'
})

export default api