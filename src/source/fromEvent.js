export default (node, name) => (start, sink) => {
  if (start !== 0) return
  const callback = e => sink(1, e)
  sink(0, t => {
    if (t === 2)
      node.removeEventListener(name, callback)
  })
  node.addEventListener(name, callback)
}
