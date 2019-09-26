import React from 'react'
import auth from '../../Auth';

export default function Home() {
  const isAuthenticated = auth.isAuthenticated();

  return (
    <div>
      { isAuthenticated
        ? (<p>You're logged in! Check out the profile page.</p>)
        : (<p>Welcome! Please log in to the application.</p>)
      }
    </div>

  )
}
