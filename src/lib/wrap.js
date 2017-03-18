// Wrap function to catch exceptions and forward them to next (args[2] = next)
export default wrap => (...args) => wrap(...args).catch(args[2])
