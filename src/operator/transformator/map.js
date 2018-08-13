export default operation => source => (start, sink) => {
  if (start !== 0) return
  source(0, (t, d) => {
    sink(t, t === 1 ? operation(d) : d)
  })
}
