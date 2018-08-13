export default operation => source => {
  let talkback = false
  source(0, (t, d) => {
    if (t === 1 && talkback) {
      operation(d)
      talkback(1)
    } else if (t === 0) {
      talkback = d
      talkback(1)
    } else if (t === 2) {
      talkback = false
    }
  })
}
