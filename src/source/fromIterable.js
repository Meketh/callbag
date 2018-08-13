export default iterable => (start, sink) => {
  if (start !== 0) return
  let ended = false
  const iterator = iterable[Symbol.iterator]()
  sink(0, t => {
    if (t === 1 && !ended) {
      const { value, done } = iterator.next()
      if (done) {
        ended = true
        sink(2)
      } else sink(1, value)
    } else if (t === 2) {
      ended = true
    }
  })
}
