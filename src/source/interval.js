export default period => (start, sink) => {
  if (start !== 0) return
  let count = 0
  const interval = setInterval(t => sink(1, count++), period)
  sink(0, t => {
    if (t === 2)
      clearInterval(interval)
  })
}
