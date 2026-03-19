/**
 * Utility to export data to CSV (Excel compatible with UTF-8 BOM)
 */
export const exportToCSV = (data: any[], headers: { key: string; label: string }[], filename: string) => {
  if (!data || data.length === 0) {
    alert('Không có dữ liệu để xuất!')
    return
  }

  // Create header row
  const headerRow = headers.map(h => h.label).join(',')

  // Create data rows
  const rows = data.map(item => {
    return headers.map(h => {
      let value = item[h.key]
      
      // Handle nested objects or arrays if needed
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value).replace(/"/g, '""')
      }
      
      // Wrap in quotes and escape existing quotes for CSV safety
      const stringValue = String(value ?? '').replace(/"/g, '""')
      return `"${stringValue}"`
    }).join(',')
  })

  const csvContent = [headerRow, ...rows].join('\n')
  
  // Add UTF-8 BOM for Excel to recognize Vietnamese characters
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
