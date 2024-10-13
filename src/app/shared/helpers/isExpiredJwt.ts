
export function isEpiredToken(token: string): boolean{
  let payload
 if (token) {
   payload = JSON.parse(atob(token.split('.')[1]))
 }
  if (payload?.exp) {
    const expireTime = payload.exp * 1000

    if (expireTime > Date.now()) return false
    return true
  }
  return false
}
