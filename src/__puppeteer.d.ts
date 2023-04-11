export type Browser = {
  close(): void
  // Closes browser with all the pages (if any were opened). The browser object itself is considered to be disposed and could not be used anymore.
  newPage(): Promise<Page>
  version(): Promise<string>
  wsEndpoint(): string
}
