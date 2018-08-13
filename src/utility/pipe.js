export default (data, ...operations) => {
  return operations.reduce(
    (prev, op) => op(prev), data
  )
}
