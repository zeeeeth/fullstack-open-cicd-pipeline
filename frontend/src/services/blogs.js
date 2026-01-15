import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${newBlog.id}`, newBlog, config)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const blog = await axios.get(`${baseUrl}/${id}`)

  if (window.confirm(`Remove blog ${blog.data.title} by ${blog.data.author}?`)) {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, setToken, create, update, remove }