export function generateSupportLinkId(): string {
  // Use a browser-safe method to generate random IDs
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function generateTransactionId(): string {
  // Use a browser-safe method to generate random IDs
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
