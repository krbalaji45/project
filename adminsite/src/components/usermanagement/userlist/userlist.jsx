import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import './userlist.css'

function SearchField({ value, onChange }) {
  return (
    <label className="user-search">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="search-icon">
        <circle cx="8.5" cy="8.5" r="5.5" />
        <path d="m13 13 4 4" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, email or mobile number..."
        aria-label="Search users by name, email or mobile number"
      />
    </label>
  )
}

function StatusFilter({ value, onChange }) {
  return (
    <label className="status-filter">
      <span className="sr-only">Filter by status</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="All">All statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Blocked">Blocked</option>
      </select>
      <svg aria-hidden="true" viewBox="0 0 20 20">
        <path d="m5 7 5 5 5-5" />
      </svg>
    </label>
  )
}

function DateRangeFilter({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <fieldset className="user-date-range">
      <legend>Joined date range</legend>
      <label className="date-range-field">
        <span>From</span>
        <input
          aria-label="Joined from date"
          max={endDate || undefined}
          onChange={(event) => onStartDateChange(event.target.value)}
          type="date"
          value={startDate}
        />
      </label>
      <label className="date-range-field">
        <span>To</span>
        <input
          aria-label="Joined to date"
          min={startDate || undefined}
          onChange={(event) => onEndDateChange(event.target.value)}
          type="date"
          value={endDate}
        />
      </label>
    </fieldset>
  )
}

function UserToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  return (
    <div className="user-toolbar">
      <SearchField value={search} onChange={onSearchChange} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    </div>
  )
}

function joinedDateKey(joined) {
  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(joined.trim())
  if (!match) {
    return ''
  }

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  const monthIndex = months.indexOf(match[2].toLowerCase())
  if (monthIndex < 0) {
    return ''
  }

  return `${match[3]}-${String(monthIndex + 1).padStart(2, '0')}-${match[1].padStart(2, '0')}`
}

function UserAvatar({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return <span className="user-avatar" aria-hidden="true">{initials}</span>
}

function UserRow({ user, onSelect }) {
  return (
    <tr className="user-row">
      <td className="user-name-cell">
        <UserAvatar name={user.name} />
        <span>{user.name}</span>
      </td>
      <td className="user-email">{user.email}</td>
      <td>{user.mobile}</td>
      <td>
        <span className={`user-status user-status--${user.status.toLowerCase()}`}>
          {user.status}
        </span>
      </td>
      <td>{user.joined}</td>
      <td className="user-action-cell">
        <button
          className="view-user-button"
          onClick={(event) => {
            event.stopPropagation()
            onSelect(user)
          }}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M2 10s2.9-5 8-5 8 5 8 5-2.9 5-8 5-8-5-8-5Z" />
            <circle cx="10" cy="10" r="2.2" />
          </svg>
          View Details
        </button>
      </td>
    </tr>
  )
}

function UserTable({ users: visibleUsers, onSelect }) {
  return (
    <div className="user-table-scroll">
      <table className="user-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Status</th>
            <th scope="col">Joined on</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user) => <UserRow key={user.id} user={user} onSelect={onSelect} />)}
        </tbody>
      </table>
      {visibleUsers.length === 0 && (
        <p className="empty-users">No users match your search.</p>
      )}
    </div>
  )
}

function UserList() {
  const navigate = useNavigate()
  const { data } = useOutletContext()
  const users = data.users
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(1)
  const userCounts = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.status === 'Active').length,
    inactive: users.filter((user) => user.status === 'Inactive').length,
  }), [users])
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.mobile]
        .some((value) => value.toLowerCase().includes(query))
      const matchesStatus = status === 'All' || user.status === status
      const joined = joinedDateKey(user.joined)
      const matchesStartDate = !startDate || (joined && joined >= startDate)
      const matchesEndDate = !endDate || (joined && joined <= endDate)

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate
    })
  }, [endDate, search, startDate, status, users])
  const pageCount = Math.ceil(visibleUsers.length / pageSize)

  useEffect(() => {
    if (pageCount > 0 && page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const pagedUsers = visibleUsers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <main className="user-list-page">
      <header className="user-list-header">
        <h1>User Management</h1>
        <p>View and manage all users in system</p>
      </header>
      <UserToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        status={status}
        onStatusChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(value) => {
          setStartDate(value)
          setPage(1)
        }}
        onEndDateChange={(value) => {
          setEndDate(value)
          setPage(1)
        }}
      />
      <section className="user-summary-cards" aria-label="User summary">
        <article className="user-summary-card user-summary-card--total">
          <span className="user-summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3" />
              <path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20z" />
              <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14a4.5 4.5 0 0 1 3.5 4.4V20h-3" />
            </svg>
          </span>
          <span className="user-summary-copy">
            <span className="user-summary-label">Total Users</span>
            <strong>{userCounts.total}</strong>
          </span>
        </article>
        <article className="user-summary-card user-summary-card--active">
          <span className="user-summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 2.5 2.5L16 9" />
            </svg>
          </span>
          <span className="user-summary-copy">
            <span className="user-summary-label">Active Users</span>
            <strong>{userCounts.active}</strong>
          </span>
        </article>
        <article className="user-summary-card user-summary-card--inactive">
          <span className="user-summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8" />
            </svg>
          </span>
          <span className="user-summary-copy">
            <span className="user-summary-label">Inactive Users</span>
            <strong>{userCounts.inactive}</strong>
          </span>
        </article>
      </section>
      <UserTable
        users={pagedUsers}
        onSelect={(user) => navigate(`/users/details/${user.id}`)}
      />
      {visibleUsers.length > 0 && (
        <nav className="user-pagination" aria-label="User list pagination">
          <label className="pagination-page-size">
            Rows per page
            <select
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
              value={pageSize}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </label>
          <span className="pagination-range">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, visibleUsers.length)} of {visibleUsers.length}
          </span>
          <div className="pagination-controls">
            <button
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              type="button"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                aria-current={page === pageNumber ? 'page' : undefined}
                className={page === pageNumber ? 'pagination-page--active' : ''}
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </main>
  )
}

export default UserList