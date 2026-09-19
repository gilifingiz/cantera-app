export function exportarExcel(viajes) {
  const header = 'Fecha,Hora Salida,Hora Llegada,Material,Patente,Interno,Chofer,M3,Destino'
  const rows = viajes.map((v) =>
    [v.fecha, v.horaSalida, v.horaLlegada, v.material, v.patente, v.interno, v.chofer, v.m3, v.destino || '']
      .map((field) => `"${field}"`)
      .join(','),
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const today = new Date()
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`
  const link = document.createElement('a')
  link.href = url
  link.download = `cantera_${localDate}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}