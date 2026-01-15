const LoginInformation =({ user }) => {

  const handleLogout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  return (
    <div>
      <form onSubmit={handleLogout}>
        {user.name} logged in
        <button type="submit">logout</button>
      </form>
    </div>
  )
}

export default LoginInformation