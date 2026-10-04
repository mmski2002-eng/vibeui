export const ETHEREUM_PAYOUT_MARKER = "USDC_ETHEREUM"

export const ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export function isEthereumPayout(marker: string | null | undefined): boolean {
  return marker === ETHEREUM_PAYOUT_MARKER
}
