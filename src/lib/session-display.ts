type SessionReadError = { status?: number } | null;
export function temporarySessionError(error: SessionReadError) {
  return Boolean(error && (error.status === undefined || error.status === 429 || error.status >= 500));
}

// Presentation only: private pages and Express always verify the real session.
// A successful null response or unauthorized response must clear the old user.
export function sessionUserForDisplay<T>(initialUser: T | null, state: { data: { user: T } | null; isPending: boolean; error: SessionReadError }): T | null {
  if (state.isPending || temporarySessionError(state.error)) return initialUser;
  if (state.error) return null;
  return state.data?.user ?? null;
}
