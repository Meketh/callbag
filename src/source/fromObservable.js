export default observable => (start, sink) => {
  if (start !== 0) return
  const subscription = observable.subscribe({
    next: x => sink(1, x),
    error: e => sink(2, e),
    complete: () => sink(2)
  })
  sink(0, t => {
    if (t === 2 && subscription) {
      if (subscription.unsubscribe)
        subscription.unsubscribe()
      else subscription()
    }
  })
}
