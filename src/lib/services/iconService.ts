export const addIcon = async (data: any) => {
  try {
    const res = await fetch('/api/icons/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create icon')
    return await res.json()
  } catch (e) {
    console.error('addIcon error:', e)
  }
}

export const updateIcon = async (data: any) => {
  try {
    const res = await fetch('/api/icons/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update icon')
    return await res.json()
  } catch (e) {
    console.error('updateIcon error:', e)
  }
}

export const deleteIcon = async (id: number) => {
  try {
    const res = await fetch(`/api/icons/delete?id=${id}`, { method: 'DELETE' })
    return res.ok
  } catch (e) {
    console.error('deleteIcon error:', e)
    return false
  }
}

export const getIcon = async (id: number) => {
  try {
    const res = await fetch(`/api/icons/${id}`)
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    console.error('getIcon error:', e)
  }
}

export const listIcons = async (portfolioId: number) => {
  try {
    const res = await fetch(`/api/icons/list?portfolioId=${portfolioId}`)
    if (!res.ok) return { icons: [] as any[] }
    return await res.json()
  } catch (e) {
    console.error('listIcons error:', e)
    return { icons: [] as any[] }
  }
}

