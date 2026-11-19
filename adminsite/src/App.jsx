import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import UserManagementLayout from './components/usermanagement/UserManagementLayout.jsx'
import BookingHistory from './components/usermanagement/bookinghistory/BookingHistory.jsx'
import PaymentHistory from './components/usermanagement/paymenthistory/PaymentHistory.jsx'
import UserDetails from './components/usermanagement/userdetails/UserDetails.jsx'
import UserList from './components/usermanagement/userlist/userlist.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UserManagementLayout />}>
          <Route index element={<UserList />} />
          <Route path="details/:userId" element={<UserDetails />} />
          <Route path="details/:userId/bookings" element={<BookingHistory />} />
          <Route path="details/:userId/payments" element={<PaymentHistory />} />
        </Route>
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
