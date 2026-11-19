import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import './paymenthistory.css'

const ROWS_PER_PAGE = 10
const tabs = ['Payment History', 'Invoice logs', 'Payment logs']
const initialFilters = { search: '', type: 'All', status: 'All', fromDate: '', toDate: '' }

const statusClass = {
  Success: 'status-text--success',
  Pending: 'status-text--warning',
  Failed: 'status-text--danger',
}

function PaymentSummary({ rows }) {
  const cards = [
    { label: 'Total Transactions', count: rows.length, tone: 'total' },
    { label: 'Successful Payments', count: rows.filter((row) => row.status === 'Success').length, tone: 'success' },
    { label: 'Pending Payments', count: rows.filter((row) => row.status === 'Pending').length, tone: 'pending' },
    { label: 'Failed Payments', count: rows.filter((row) => row.status === 'Failed').length, tone: 'failed' },
  ]

  return (
    <section className="payment-summary-cards" aria-label="Payment summary">
      {cards.map(({ label, count, tone }) => (
        <article className={`payment-summary-card payment-summary-card--${tone}`} key={label}>
          <span>{label}</span>
          <strong>{count}</strong>
        </article>
      ))}
    </section>
  )
}

function PaymentProfile({ user }) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <section className="payment-profile">
      <div className="member-avatar" aria-hidden="true">{initials}</div>
      <div>
        <p className="member-name">{user.name}</p>
        <p className="payment-customer-type">Customer</p>
        <div className="payment-contact">
          <span>{user.email}</span>
          <span>{user.mobile}</span>
          <span className={`status-text ${user.status === 'Active' ? 'status-text--success' : 'status-text--failed'}`}>{user.status}</span>
        </div>
      </div>
    </section>
  )
}

function PaymentFilters({ filters, setFilters, onReset, types, statuses }) {
  const updateDraft = (field) => (event) => {
    setFilters((current) => ({ ...current, [field]: event.target.value }))
  }

  return (
    <div className="payment-filters">
      <label className="management-search">
        <span aria-hidden="true">⌕</span>
        <input
          aria-label="Search payments by transaction, invoice or booking ID"
          className="management-input"
          onChange={updateDraft('search')}
          placeholder="Search transaction, invoice or booking ID..."
          type="search"
          value={filters.search}
        />
      </label>
      <label className="filter-field">
        Payment Type
        <select className="management-select" onChange={updateDraft('type')} value={filters.type}>
          <option value="All">All</option>
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <label className="filter-field">
        Payment Status
        <select className="management-select" onChange={updateDraft('status')} value={filters.status}>
          <option value="All">All</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <label className="filter-field payment-date">
        From date
        <input
          aria-label="Payment date from"
          className="management-input"
          max={filters.toDate || undefined}
          onChange={updateDraft('fromDate')}
          type="date"
          value={filters.fromDate}
        />
      </label>
      <label className="filter-field payment-date">
        To date
        <input
          aria-label="Payment date to"
          className="management-input"
          min={filters.fromDate || undefined}
          onChange={updateDraft('toDate')}
          type="date"
          value={filters.toDate}
        />
      </label>
      <div className="payment-filter-actions">
        <button className="reset-filter" onClick={onReset} type="button">Reset</button>
      </div>
    </div>
  )
}

function getTableRows(tab, rows) {
  if (tab === 'Invoice logs') {
    return {
      columns: ['S.no', 'Invoice ID', 'Transaction ID', 'Booking ID', 'Invoice Date', 'Amount', 'Status', 'Action'],
      rows: rows.map((row) => ({
        key: row.transaction,
        values: [row.invoice, row.transaction, row.bookingId, row.invoiceDate, `₹ ${row.amount}`, row.status],
        source: row,
      })),
    }
  }
  if (tab === 'Payment logs') {
    return {
      columns: ['S.no', 'Transaction ID', 'Payment Method', 'Payment Status', 'Date & Time', 'Action'],
      rows: rows.map((row) => ({
        key: row.transaction,
        values: [row.transaction, row.method, row.status, row.date],
        source: row,
      })),
    }
  }
  return {
    columns: ['S.no', 'Transaction ID', 'Invoice ID', 'Payment Type', 'Amount', 'Payment method', 'Status', 'Date & Time', 'Action'],
    rows: rows.map((row) => ({
      key: row.transaction,
      values: [row.transaction, row.invoice, row.type, `₹ ${row.amount}`, row.method, row.status, row.date],
      source: row,
    })),
  }
}

function PaymentActionMenu({ tab, row, onAction }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="payment-action-cell">
      <button
        aria-expanded={open}
        aria-label={`Actions for ${row.transaction}`}
        className="table-menu-button"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        ⋮
      </button>
      {open && (
        <div className="payment-action-menu">
          {tab === 'Invoice logs' ? (
            <button onClick={() => { setOpen(false); onAction('invoice', row) }} type="button">Download Invoice</button>
          ) : (
            <>
              <button onClick={() => { setOpen(false); onAction('details', row) }} type="button">View Payment Details</button>
              {tab === 'Payment History' && (
                <button onClick={() => { setOpen(false); onAction('invoice', row) }} type="button">Download Invoice</button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function PaymentTable({ tab, rows, page, onAction }) {
  const table = getTableRows(tab, rows)

  return (
    <div className="management-table-wrap">
      <table className={`management-table payment-table payment-table--${tab === 'Payment History' ? 'history' : tab === 'Invoice logs' ? 'invoices' : 'logs'}`}>
        <thead><tr>{table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>
          {table.rows.map(({ key, values, source }, index) => {
            const statusIndex = tab === 'Payment History' ? 5 : tab === 'Invoice logs' ? 5 : 2
            const dateIndex = tab === 'Payment History' ? 6 : tab === 'Payment logs' ? 3 : -1
            const transactionIndex = tab === 'Payment History' ? 0 : tab === 'Invoice logs' ? 1 : 0

            return (
              <tr key={key}>
                <td>{(page - 1) * ROWS_PER_PAGE + index + 1}</td>
                {values.map((value, valueIndex) => (
                  <td
                    className={tab === 'Payment History' && valueIndex === 2
                      ? `payment-type payment-type--${String(value).toLowerCase().replaceAll(' ', '-')}`
                      : ''}
                    key={`${key}-${valueIndex}`}
                  >
                    {valueIndex === statusIndex
                      ? <span className={`status-text ${statusClass[value] || ''}`}>{value}</span>
                      : valueIndex === dateIndex
                        ? <>{String(value).split(' ').slice(0, 3).join(' ')}<small>{String(value).split(' ').slice(3).join(' ')}</small></>
                        : (tab === 'Payment logs' && valueIndex === transactionIndex)
                          ? <button className="payment-record-link" onClick={() => onAction('details', source)} type="button">{value}</button>
                          : value}
                  </td>
                ))}
                <td><PaymentActionMenu onAction={onAction} row={source} tab={tab} /></td>
              </tr>
            )
          })}
          {table.rows.length === 0 && <tr><td className="empty-state" colSpan={table.columns.length}>No payment records match your filters.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function PaymentDetailsModal({ payment, onClose }) {
  if (!payment) {
    return null
  }

  const fields = [
    ['Transaction ID', payment.transaction],
    ['Invoice ID', payment.invoice],
    ['Booking ID', payment.bookingId],
    ['Payment type', payment.type],
    ['Payment method', payment.method],
    ['Amount', `₹ ${payment.amount}`],
    ['Payment status', payment.status],
    ['Date & time', payment.date],
  ]

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <section
        aria-labelledby="payment-modal-title"
        aria-modal="true"
        className="payment-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="payment-modal-header">
          <h2 id="payment-modal-title">Payment Details</h2>
          <button aria-label="Close dialog" className="payment-modal-close" onClick={onClose} type="button">×</button>
        </header>
        <dl className="payment-detail-list">
          {fields.map(([label, value]) => (
            <div className="payment-detail-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

function downloadInvoice(payment) {
  const invoice = [
    'CITYSPACE - PAYMENT INVOICE',
    '--------------------------------',
    `Invoice ID: ${payment.invoice}`,
    `Transaction ID: ${payment.transaction}`,
    `Booking ID: ${payment.bookingId}`,
    `Invoice date: ${payment.invoiceDate}`,
    `Payment type: ${payment.type}`,
    `Payment method: ${payment.method}`,
    `Payment status: ${payment.status}`,
    `Amount: INR ${payment.amount}`,
  ].join('\n')
  const url = URL.createObjectURL(new Blob([invoice], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `invoice-${payment.invoice}.txt`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function PaymentHistory() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { data } = useOutletContext()
  const user = data.users.find((item) => item.id === userId)
  const userPayments = useMemo(
    () => data.payments.filter((payment) => payment.userId === userId),
    [data.payments, userId],
  )
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const types = useMemo(() => {
    const uniqueTypes = new Map()
    data.payments.forEach((payment) => {
      const normalizedType = payment.type.toLowerCase()
      if (!uniqueTypes.has(normalizedType)) {
        uniqueTypes.set(normalizedType, normalizedType.replace(/\b\w/g, (letter) => letter.toUpperCase()))
      }
    })
    return [...uniqueTypes.values()]
  }, [data.payments])
  const statuses = useMemo(() => [...new Set(data.payments.map((payment) => payment.status))], [data.payments])
  const visibleRows = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    return userPayments.filter((row) => {
      const searchableFields = [row.transaction, row.invoice, row.bookingId, row.type, row.method, row.status, row.date]
      const matchesSearch = searchableFields.some((value) => value.toLowerCase().includes(query))
      const date = row.dateKey
      const matchesFromDate = !filters.fromDate || date >= filters.fromDate
      const matchesToDate = !filters.toDate || date <= filters.toDate

      return matchesSearch
        && (filters.type === 'All' || row.type.toLowerCase() === filters.type.toLowerCase())
        && (filters.status === 'All' || row.status === filters.status)
        && matchesFromDate
        && matchesToDate
    })
  }, [filters, userPayments])
  const pageCount = Math.max(1, Math.ceil(visibleRows.length / ROWS_PER_PAGE))
  const pagedRows = visibleRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  function resetFilters() {
    setFilters(initialFilters)
    setPage(1)
  }

  function updateFilters(updater) {
    setFilters(updater)
    setPage(1)
  }

  function changeTab(tab) {
    setActiveTab(tab)
    setPage(1)
  }

  function handleAction(action, payment) {
    if (action === 'invoice') {
      downloadInvoice(payment)
    } else {
      setSelectedPayment(payment)
    }
  }

  if (!user) {
    return <Navigate to="/users" replace />
  }

  return (
    <main className="payment-page">
      <button
        className="history-back-button"
        onClick={() => navigate(`/users/details/${user.id}`)}
        type="button"
      >
        Back to User Details
      </button>
      <h1 className="page-heading">Payment History</h1>
      <p className="page-subtitle">Payment records for {user.name}.</p>
      <PaymentProfile user={user} />
      <PaymentSummary rows={userPayments} />
      <nav className="history-tabs" aria-label="Payment records">
        {tabs.map((tab) => (
          <button
            aria-current={activeTab === tab ? 'page' : undefined}
            className={activeTab === tab ? 'history-tab history-tab--active' : 'history-tab'}
            key={tab}
            onClick={() => changeTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>
      <PaymentFilters
        filters={filters}
        onReset={resetFilters}
        setFilters={updateFilters}
        statuses={statuses}
        types={types}
      />
      <PaymentTable onAction={handleAction} page={page} rows={pagedRows} tab={activeTab} />
      <nav aria-label="Payment records pagination" className="payment-pagination">
        <span>
          {visibleRows.length === 0
            ? '0 transactions'
            : `${(page - 1) * ROWS_PER_PAGE + 1}–${Math.min(page * ROWS_PER_PAGE, visibleRows.length)} of ${visibleRows.length} transactions`}
        </span>
        <div className="payment-pagination-controls">
          <button
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            Previous
          </button>
          {visibleRows.length > 0 && Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              aria-current={page === pageNumber ? 'page' : undefined}
              className={page === pageNumber ? 'payment-pagination-page--active' : ''}
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
      <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </main>
  )
}

export default PaymentHistory
