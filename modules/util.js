export function formatDate(isoDateString) {
  const formattedDate = new Date(isoDateString);
  return formattedDate.toLocaleDateString()
}

// From https://github.com/vercel/next.js/discussions/18550#discussioncomment-1248384
export function avoidRateLimit(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
