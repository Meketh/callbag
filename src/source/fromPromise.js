export default promise => (start, sink) => {
  if (start !== 0) return
  let ended = false
  sink(0, t => {
    if (t === 2) ended = true
  })
  promise
    .then(d => {
      if (ended) return
      ended = true
      sink(1, d)
      sink(2)
    })
    .catch(e => {
      if (ended) return
      ended = true
      sink(2, e)
    })
}
