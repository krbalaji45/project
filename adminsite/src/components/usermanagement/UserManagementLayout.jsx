import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  createActivity as createActivityRequest,
  deleteUser as deleteUserRequest,
  fetchUserManagementData,
  updateUser as updateUserRequest,
} from '../../api/userManagementApi'
import './usermanagement.css'

const emptyData = { users: [], activities: [], bookings: [], payments: [] }

const pageLinks = [
  { to: '/users', label: 'User List', end: true },
]

function ManagementNavigation() {
  return (
    <header className="management-topbar">
      <nav className="management-tabs" aria-label="User management pages">
        {pageLinks.map(({ to, label, end }) => (
          <NavLink
            className={({ isActive }) => isActive ? 'management-tab management-tab--active' : 'management-tab'}
            end={end}
            key={to}
            to={to}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

function UserManagementLayout() {
  const { pathname } = useLocation()
  const [data, setData] = useState(emptyData)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    let active = true

    fetchUserManagementData()
      .then((loadedData) => {
        if (active) {
          setData(loadedData)
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.response?.data?.message || error.message || 'Could not load data from the backend.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [loadAttempt])

  const retryLoading = () => {
    setLoading(true)
    setLoadError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  const updateUser = async (userId, changes) => {
    const savedUser = await updateUserRequest(userId, changes)
    setData((current) => ({
      ...current,
      users: current.users.map((user) => user.id === userId
        ? { ...user, ...changes, ...(savedUser || {}) }
        : user),
    }))
  }

  const deleteUser = async (userId) => {
    await deleteUserRequest(userId)
    setData((current) => ({
      ...current,
      users: current.users.filter((user) => user.id !== userId),
    }))
  }

  const addActivity = async (activity) => {
    const savedActivity = await createActivityRequest(activity)
    setData((current) => ({
      ...current,
      activities: [savedActivity, ...current.activities],
    }))
  }

  if (loading) {
    return <div className="storage-error" role="status">Loading data from the backend...</div>
  }

  if (loadError) {
    return (
      <div className="storage-error" role="alert">
        <p>Could not connect to the backend: {loadError}</p>
        <button onClick={retryLoading} type="button">Retry</button>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-main">
        <div className="admin-page-content">
          {pathname === '/users' && <ManagementNavigation />}
          <Outlet context={{ data, updateUser, deleteUser, addActivity }} />
        </div>
      </div>
    </div>
  )
}

export default UserManagementLayout
