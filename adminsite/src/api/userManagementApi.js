import axiosInstance from './axiosInstance'

async function getCollection(path) {
  const { data } = await axiosInstance.get(`/${path}`)
  if (!Array.isArray(data)) {
    throw new Error(`The GET /${path} endpoint must return an array.`)
  }

  return data
}

export async function fetchUserManagementData() {
  const [users, activities, bookings, payments] = await Promise.all([
    getCollection('users'),
    getCollection('activities'),
    getCollection('bookings'),
    getCollection('payments'),
  ])

  return { users, activities, bookings, payments }
}

export async function updateUser(userId, changes) {
  const { data } = await axiosInstance.patch(`/users/${encodeURIComponent(userId)}`, changes)
  return data
}

export async function deleteUser(userId) {
  await axiosInstance.delete(`/users/${encodeURIComponent(userId)}`)
}

export async function createActivity(activity) {
  const newActivity = {
    ...activity,
    id: `ACT-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  const { data } = await axiosInstance.post('/activities', newActivity)

  return data || newActivity
}
