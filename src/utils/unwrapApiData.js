/**
 * Unwrap API responses — handles both raw arrays/objects and { success, data } wrappers.
 */
export const unwrapApiData = (response, fallback = null) => {
  const payload = response?.data

  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data ?? fallback
  }

  return payload ?? fallback
}

export const getPeriodDateRange = (period = 'today') => {
  const now = new Date()
  const start = new Date()

  switch (period.toLowerCase()) {
    case 'week':
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      break
    case 'month':
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      break
    case 'today':
    default:
      start.setHours(0, 0, 0, 0)
      break
  }

  return {
    dateFrom: start.toISOString(),
    dateTo: now.toISOString(),
  }
}

export const getPeriodLabel = (period = 'today') => {
  switch (period.toLowerCase()) {
    case 'week':
      return 'Sales This Week'
    case 'month':
      return 'Sales This Month'
    case 'today':
    default:
      return 'Sales Today'
  }
}
