export const fetchPosts = async () => {
  const res = await fetch('http://localhost:8083/posts')
  return res.json()
}

export const fetchUserById = async (id) => {
  const res = await fetch(`http://localhost:8083/users/${id}`)
  return res.json()
}
