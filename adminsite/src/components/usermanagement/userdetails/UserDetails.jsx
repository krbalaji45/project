import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import './userdetails.css'

const permissions = [
  'View Products',
  'Place Bookings',
  'Track Orders / Bookings',
  'Make Payments',
  'View Payment History',
  'Write Reviews',
  'Manage Profile',
]

const activityTypes = [
  'Login / Logout',
  'Profile Updated',
  'Booking Created',
  'Booking Cancelled',
  'Payment Completed',
  'Review Submitted',
  'Permission Changed',
  'Account Blocked / Unblocked',
  'Account Activated / Deactivated',
]

function localDateKey(value) {
  const date = new Date(value)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function ProfileSummary({ user, onStatusChange, onDelete }) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <>
      <section className="details-profile">
        <div className="details-person">
          <div className="details-avatar" aria-hidden="true">{initials}</div>
          <div className="details-identity">
            <div className="details-name-row">
              <h2>{user.name}</h2>
              <span className="role-badge">Customer</span>
            </div>
            <div className="details-contact">
              <p>{user.email}</p>
              <span aria-hidden="true">·</span>
              <p>{user.mobile}</p>
            </div>
          </div>
        </div>
        <div className="details-actions">
          <button
            className={`pill-button ${user.status === 'Blocked' ? 'pill-button--green' : 'pill-button--red'}`}
            onClick={onStatusChange}
            type="button"
          >
            {user.status === 'Blocked' ? 'Unblock' : 'Block'}
          </button>
          <button className="pill-button pill-button--pink" onClick={onDelete} type="button">Delete</button>
        </div>
      </section>
      <section className="details-meta" aria-label="User account overview">
        <div className="meta-card">
          <span className="meta-icon" aria-hidden="true">▦</span>
          <span><b>Registration Date</b><small>{user.joined}</small></span>
        </div>
        <div className="meta-card">
          <span className="meta-icon" aria-hidden="true">◷</span>
          <span><b>Last Login</b><small>{user.lastLogin}</small></span>
        </div>
        <div className="meta-card">
          <span className="meta-icon" aria-hidden="true">⌖</span>
          <span><b>Location</b><small>{user.location}</small></span>
        </div>
      </section>
    </>
  )
}

function InfoRows({ user }) {
  const userInfo = [
    ['User ID', user.id],
    ['Full Name', user.name],
    ['Email Address', user.email],
    ['Phone Number', user.mobile],
    ['Role', 'Customer'],
    ['Account Status', user.status],
    ['Register Date', user.joined],
    ['Last Login', user.lastLogin],
    ['Location', user.location],
  ]

  return (
    <section className="personal-info">
      <h2>Personal Information</h2>
      <dl>
        {userInfo.map(([label, value]) => (
          <div className="info-row" key={label}>
            <dt>{label}</dt>
            <dd className={label === 'Account Status' ? `info-status info-status--${user.status.toLowerCase()}` : ''}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function PermissionPanel({ draft, message, onChange, onSave }) {
  return (
    <section className="permission-panel">
      <header className="permission-panel-heading">
        <div>
          <h2>Role &amp; Permissions</h2>
          <p>Customer access settings</p>
        </div>
        <p className="permission-role"><span>Role</span><strong>Customer</strong></p>
      </header>
      <fieldset className="permission-list">
        <legend>Customer permissions</legend>
        {permissions.map((permission) => (
          <label className="permission-option" key={permission}>
            <input
              checked={Boolean(draft[permission])}
              onChange={(event) => onChange(permission, event.target.checked)}
              type="checkbox"
            />
            <span>{permission}</span>
          </label>
        ))}
      </fieldset>
      <div className="permission-footer">
        {message && <p className="permission-success" role="status">{message}</p>}
        <button className="pill-button pill-button--purple save-permissions" onClick={onSave} type="button">
          Save Changes
        </button>
      </div>
    </section>
  )
}

function ActivityLogs({ user, activities }) {
  const [typeFilter, setTypeFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const filteredActivities = useMemo(() => activities
    .filter((activity) => activity.userId === user.id)
    .filter((activity) => typeFilter === 'All' || activity.type === typeFilter)
    .filter((activity) => !dateFilter || localDateKey(activity.timestamp) === dateFilter)
    .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp)), [activities, dateFilter, typeFilter, user.id])

  return (
    <section className="activity-section">
      <div className="activity-heading">
        <div>
          <h2>Activity Logs</h2>
          <p>Recent account activity for {user.name}</p>
        </div>
        <div className="activity-filters">
          <label className="filter-field">
            Activity Type
            <select className="management-select" onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}>
              <option value="All">All activity</option>
              {activityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="filter-field">
            Date
            <input
              className="management-input activity-date"
              onChange={(event) => setDateFilter(event.target.value)}
              type="date"
              value={dateFilter}
            />
          </label>
        </div>
      </div>
      <div className="activity-list-scroll">
        {filteredActivities.length ? (
          <ol className="activity-timeline">
            {filteredActivities.map((activity) => (
              <li className="activity-item" key={activity.id}>
                <span className="activity-marker" aria-hidden="true" />
                <div className="activity-card">
                  <div className="activity-card-heading">
                    <h3>{activity.type}</h3>
                    <time dateTime={activity.timestamp}>
                      {new Date(activity.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>
                  <p>{activity.description}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-activities">No activities match the selected filters.</p>
        )}
      </div>
    </section>
  )
}

function UserDetails() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { data, updateUser, deleteUser, addActivity } = useOutletContext()
  const user = data.users.find((item) => item.id === userId)
  const [activeTab, setActiveTab] = useState('User Information')
  const [permissionDraft, setPermissionDraft] = useState({})
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const tabs = ['User Information', 'Role & Permissions', 'Activity Logs']
  const userBookings = data.bookings.filter((booking) => booking.userId === userId)
  const userPayments = data.payments.filter((payment) => payment.userId === userId)
  const userActivities = data.activities.filter((activity) => activity.userId === userId)

  useEffect(() => {
    if (user) {
      setPermissionDraft(user.permissions || {})
    }
  }, [user])

  if (!user) {
    return <Navigate to="/users" replace />
  }

  const changeStatus = async () => {
    const blocking = user.status !== 'Blocked'
    const nextStatus = blocking ? 'Blocked' : 'Active'
    const action = blocking ? 'block' : 'unblock'
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}'s account?`)) {
      return
    }

    setErrorMessage('')
    try {
      await updateUser(user.id, { status: nextStatus })
      setMessage(`Account ${action}ed successfully.`)
      try {
        await addActivity({
          userId: user.id,
          type: 'Account Blocked / Unblocked',
          description: `Account was ${action}ed by an administrator.`,
        })
      } catch (error) {
        setErrorMessage(`Account status was updated, but its activity could not be recorded: ${error.message}`)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Could not update account status.')
    }
  }

  const handleDeleteUser = async () => {
    if (!window.confirm(`Permanently delete ${user.name}? This action cannot be undone.`)) {
      return
    }

    setErrorMessage('')
    try {
      await deleteUser(user.id)
      navigate('/users')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Could not delete user.')
    }
  }

  const savePermissions = async () => {
    setErrorMessage('')
    try {
      await updateUser(user.id, { permissions: permissionDraft })
      setMessage('Permission changes saved successfully.')
      try {
        await addActivity({
          userId: user.id,
          type: 'Permission Changed',
          description: 'Customer permissions were updated by an administrator.',
        })
      } catch (error) {
        setErrorMessage(`Permissions were saved, but the activity could not be recorded: ${error.message}`)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Could not save permissions.')
    }
  }

  return (
    <main className="details-page">
      <button
        className="history-back-button"
        onClick={() => navigate('/users')}
        type="button"
      >
        Back to User List
      </button>
      <header className="details-heading">
        <h1 className="page-heading">User Details</h1>
        <p className="page-subtitle">View and manage the details of the selected user</p>
      </header>
      <ProfileSummary
        user={user}
        onStatusChange={changeStatus}
        onDelete={handleDeleteUser}
      />
      <nav className="details-history-actions" aria-label="User history">
        <button
          className="pill-button pill-button--purple"
          onClick={() => navigate(`/users/details/${user.id}/bookings`)}
          type="button"
        >
          Booking History
        </button>
        <button
          className="pill-button pill-button--purple"
          onClick={() => navigate(`/users/details/${user.id}/payments`)}
          type="button"
        >
          Payment History
        </button>
      </nav>
      {message && !(activeTab === 'Role & Permissions' && message === 'Permission changes saved successfully.') && (
        <p className="details-message" role="status">{message}</p>
      )}
      {errorMessage && <p className="details-message" role="alert">{errorMessage}</p>}
      <nav className="details-tabs" aria-label="User detail sections">
        {tabs.map((tab) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? 'details-tab details-tab--active' : 'details-tab'}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="details-tab-content">
        {activeTab === 'User Information' && (
          <div className="user-information-content">
            <section className="account-summary" aria-label="User activity summary">
              <article className="account-summary-card">
                <span>Bookings</span>
                <strong>{userBookings.length}</strong>
                <small>{userBookings.filter((booking) => ['Complete', 'Completed'].includes(booking.status)).length} completed</small>
              </article>
              <article className="account-summary-card">
                <span>Successful payments</span>
                <strong>{userPayments.filter((payment) => payment.status === 'Success').length}</strong>
                <small>{userPayments.length} total transactions</small>
              </article>
              <article className="account-summary-card">
                <span>Recorded activities</span>
                <strong>{userActivities.length}</strong>
                <small>Account events on file</small>
              </article>
            </section>
            <InfoRows user={user} />
          </div>
        )}
        {activeTab === 'Role & Permissions' && (
          <PermissionPanel
            draft={permissionDraft}
            message={message === 'Permission changes saved successfully.' ? message : ''}
            onChange={(permission, enabled) => setPermissionDraft((current) => ({ ...current, [permission]: enabled }))}
            onSave={savePermissions}
          />
        )}
        {activeTab === 'Activity Logs' && <ActivityLogs user={user} activities={data.activities} />}
      </div>
    </main>
  )
}

export default UserDetails
