import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import './bookinghistory.css'

const BOOKINGS_PER_PAGE = 10

const statusClass = {
  Complete: 'status-text--success',
  Completed: 'status-text--success',
  Pending: 'status-text--warning',
  Confirmed: 'status-text--purple',
  Cancelled: 'status-text--danger',
}

const initialFilters = { search: '', type: 'All', status: 'All', fromDate: '', toDate: '' }
const monthNumbers = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
}

function bookingDateKey(date) {
  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/.exec(date)
  if (!match || !monthNumbers[match[2]]) {
    return ''
  }

  return `${match[3]}-${monthNumbers[match[2]]}-${match[1].padStart(2, '0')}`
}

function BookingFilters({ draft, setDraft, onReset, types, statuses }) {
  const updateDraft = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }))
  }

  return (
    <div className="booking-filters">
      <label className="management-search">
        <span aria-hidden="true">⌕</span>
        <input
          aria-label="Search by booking ID, customer name or vendor name"
          className="management-input"
          onChange={updateDraft('search')}
          placeholder="Search booking ID, customer or vendor..."
          type="search"
          value={draft.search}
        />
      </label>
      <label className="filter-field">
        Booking type
        <select className="management-select" onChange={updateDraft('type')} value={draft.type}>
          <option value="All">All</option>
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <label className="filter-field">
        Status
        <select className="management-select" onChange={updateDraft('status')} value={draft.status}>
          <option value="All">All</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <label className="filter-field date-filter">
        From date
        <input
          aria-label="Booking date from"
          className="management-input"
          max={draft.toDate || undefined}
          onChange={updateDraft('fromDate')}
          type="date"
          value={draft.fromDate}
        />
      </label>
      <label className="filter-field date-filter">
        To date
        <input
          aria-label="Booking date to"
          className="management-input"
          min={draft.fromDate || undefined}
          onChange={updateDraft('toDate')}
          type="date"
          value={draft.toDate}
        />
      </label>
      <div className="booking-filter-actions">
        <button className="reset-filter" onClick={onReset} type="button">Reset</button>
      </div>
    </div>
  )
}

function BookingSummary({ items }) {
  const counts = [
    { label: 'Total Bookings', count: items.length, tone: 'total' },
    { label: 'Completed Bookings', count: items.filter((booking) => ['Complete', 'Completed'].includes(booking.status)).length, tone: 'completed' },
    { label: 'Pending Bookings', count: items.filter((booking) => booking.status === 'Pending').length, tone: 'pending' },
    { label: 'Cancelled Bookings', count: items.filter((booking) => booking.status === 'Cancelled').length, tone: 'cancelled' },
  ]

  return (
    <section className="booking-summary-cards" aria-label="Booking summary">
      {counts.map(({ label, count, tone }) => (
        <article className={`booking-summary-card booking-summary-card--${tone}`} key={label}>
          <span className="booking-summary-label">{label}</span>
          <strong>{count}</strong>
        </article>
      ))}
    </section>
  )
}

function BookingTable({ rows, page, onAction }) {
  return (
    <div className="management-table-wrap">
      <table className="management-table booking-table">
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Booking ID</th>
            <th scope="col">Customer Details</th>
            <th scope="col">Vendor Details</th>
            <th scope="col">Booking Type</th>
            <th scope="col">Booking Date &amp; Time</th>
            <th scope="col">Amount</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((booking, index) => (
            <tr key={booking.id}>
              <td>{(page - 1) * BOOKINGS_PER_PAGE + index + 1}</td>
              <td className="booking-id">{booking.id}</td>
              <td><b>{booking.customer}</b><small>{booking.phone}</small></td>
              <td><b>{booking.vendor}</b><small>{booking.vendorType}</small></td>
              <td className={`booking-type booking-type--${booking.type.toLowerCase().replaceAll(' ', '-')}`}>{booking.type}</td>
              <td><b>{booking.date.split(' ').slice(0, 3).join(' ')}</b><small>{booking.date.split(' ').slice(3).join(' ')}</small></td>
              <td><span className="rupee">₹</span> {booking.amount}</td>
              <td><span className={`status-text ${statusClass[booking.status] || ''}`}>{booking.status}</span></td>
              <td className="booking-action-cell">
                <button
                  aria-expanded={booking.menuOpen}
                  aria-label={`Actions for ${booking.id}`}
                  className="table-menu-button"
                  onClick={() => onAction('toggle', booking)}
                  type="button"
                >
                  ⋮
                </button>
                {booking.menuOpen && (
                  <div className="booking-action-menu">
                    <button onClick={() => onAction('booking', booking)} type="button">View Booking Details</button>
                    <button onClick={() => onAction('payment', booking)} type="button">View Payment Details</button>
                    <button onClick={() => onAction('invoice', booking)} type="button">Download Invoice</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td className="empty-state" colSpan="9">No bookings match your filters.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function BookingDetailsModal({ details, onClose }) {
  if (!details) {
    return null
  }

  const { booking, type } = details
  const isPayment = type === 'payment'
  const title = isPayment ? 'Payment Details' : 'Booking Details'
  const fields = isPayment
    ? [
      ['Booking ID', booking.id],
      ['Customer', booking.customer],
      ['Vendor', booking.vendor],
      ['Payment amount', `₹ ${booking.amount}`],
      ['Booking status', booking.status],
      ['Booking date', booking.date],
    ]
    : [
      ['Booking ID', booking.id],
      ['Customer', `${booking.customer} · ${booking.phone}`],
      ['Vendor', `${booking.vendor} · ${booking.vendorType}`],
      ['Booking type', booking.type],
      ['Booking date & time', booking.date],
      ['Amount', `₹ ${booking.amount}`],
      ['Status', booking.status],
    ]

  return (
    <div className="booking-modal-backdrop" onClick={onClose}>
      <section
        aria-labelledby="booking-modal-title"
        aria-modal="true"
        className="booking-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="booking-modal-header">
          <h2 id="booking-modal-title">{title}</h2>
          <button aria-label="Close dialog" className="booking-modal-close" onClick={onClose} type="button">×</button>
        </header>
        <dl className="booking-detail-list">
          {fields.map(([label, value]) => (
            <div className="booking-detail-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

function downloadInvoice(booking) {
  const invoice = [
    'CITYSPACE - BOOKING INVOICE',
    '--------------------------------',
    `Booking ID: ${booking.id}`,
    `Customer: ${booking.customer}`,
    `Phone: ${booking.phone}`,
    `Vendor: ${booking.vendor} (${booking.vendorType})`,
    `Booking type: ${booking.type}`,
    `Booking date: ${booking.date}`,
    `Status: ${booking.status}`,
    `Amount: INR ${booking.amount}`,
  ].join('\n')
  const url = URL.createObjectURL(new Blob([invoice], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `invoice-${booking.id}.txt`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function BookingHistory() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { data } = useOutletContext()
  const user = data.users.find((item) => item.id === userId)
  const userBookings = useMemo(
    () => data.bookings.filter((booking) => booking.userId === userId),
    [data.bookings, userId],
  )
  const [draft, setDraft] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState('')
  const [details, setDetails] = useState(null)
  const types = useMemo(() => [...new Set(data.bookings.map((booking) => booking.type))], [data.bookings])
  const statuses = useMemo(() => [...new Set(data.bookings.map((booking) => booking.status))], [data.bookings])
  const filteredBookings = useMemo(() => {
    const query = draft.search.trim().toLowerCase()

    return userBookings.filter((booking) => {
      const matchesSearch = [booking.id, booking.customer, booking.vendor]
        .some((value) => value.toLowerCase().includes(query))
      const date = bookingDateKey(booking.date)
      const matchesFromDate = !draft.fromDate || (date && date >= draft.fromDate)
      const matchesToDate = !draft.toDate || (date && date <= draft.toDate)

      return matchesSearch
        && (draft.type === 'All' || booking.type === draft.type)
        && (draft.status === 'All' || booking.status === draft.status)
        && matchesFromDate
        && matchesToDate
    })
  }, [draft, userBookings])
  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE))
  const pageBookings = filteredBookings.slice((page - 1) * BOOKINGS_PER_PAGE, page * BOOKINGS_PER_PAGE)

  function resetFilters() {
    setDraft(initialFilters)
    setPage(1)
  }

  function updateDraft(updater) {
    setDraft(updater)
    setPage(1)
  }

  function handleAction(action, booking) {
    if (action === 'toggle') {
      setOpenMenuId((current) => current === booking.id ? '' : booking.id)
      return
    }

    setOpenMenuId('')
    if (action === 'invoice') {
      downloadInvoice(booking)
    } else {
      setDetails({ booking, type: action })
    }
  }

  if (!user) {
    return <Navigate to="/users" replace />
  }

  return (
    <main className="booking-page">
      <button
        className="history-back-button"
        onClick={() => navigate(`/users/details/${user.id}`)}
        type="button"
      >
        Back to User Details
      </button>
      <h1 className="page-heading">Booking History</h1>
      <p className="page-subtitle">Bookings for {user.name}.</p>
      <BookingSummary items={userBookings} />
      <BookingFilters
        draft={draft}
        onReset={resetFilters}
        setDraft={updateDraft}
        statuses={statuses}
        types={types}
      />
      <div className="section-strip">
        <span>Booking History</span>
        <button type="button" onClick={() => window.print()}>Export &nbsp; ⇩</button>
      </div>
      <BookingTable
        onAction={(action, booking) => handleAction(action, { ...booking, menuOpen: openMenuId === booking.id })}
        page={page}
        rows={pageBookings.map((booking) => ({ ...booking, menuOpen: openMenuId === booking.id }))}
      />
      <nav aria-label="Booking history pagination" className="booking-pagination">
        <span className="booking-pagination-count">
          {filteredBookings.length === 0
            ? '0 bookings'
            : `${(page - 1) * BOOKINGS_PER_PAGE + 1}–${Math.min(page * BOOKINGS_PER_PAGE, filteredBookings.length)} of ${filteredBookings.length} bookings`}
        </span>
        <div className="booking-pagination-controls">
          <button
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            Previous
          </button>
          {filteredBookings.length > 0 && Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              aria-current={page === pageNumber ? 'page' : undefined}
              className={page === pageNumber ? 'booking-pagination-page--active' : ''}
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
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      </nav>
      <BookingDetailsModal details={details} onClose={() => setDetails(null)} />
    </main>
  )
}

export default BookingHistory
