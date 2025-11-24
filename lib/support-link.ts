export function getSupportShareLink(supportLinkId: string): string {
  if (!supportLinkId) {
    return "/"
  }

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
  if (botUsername) {
    return `https://t.me/${botUsername}?startapp=support_${supportLinkId}`
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/support/${supportLinkId}`
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    return `${siteUrl.replace(/\/$/, "")}/support/${supportLinkId}`
  }

  return `/support/${supportLinkId}`
}

export function getSupportPath(supportLinkId: string): string {
  if (!supportLinkId) {
    return "/support"
  }
  return `/support/${supportLinkId}`
}


