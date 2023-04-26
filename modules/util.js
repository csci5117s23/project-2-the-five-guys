export function formatDate(isoDateString) {
  const formattedDate = new Date(isoDateString);
  return formattedDate.toLocaleDateString()
}

// From https://github.com/vercel/next.js/discussions/18550#discussioncomment-1248384
export function avoidRateLimit(delay = 1000) {
  if (!process.env.IS_BUILD) {
    return
  }

  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
