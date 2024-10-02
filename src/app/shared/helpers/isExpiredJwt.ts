
export function isEpiredToken(token: string): boolean{
  let payload
 if (token) {
   payload = JSON.parse(atob(token.split('.')[1]))
 }
  if (payload?.exp) {
    const expireTime = payload.exp * 1000

    if (expireTime > Date.now()) return false

    console.warn('token is expired')
    return true
  }

  console.warn("token dont have expiration time")
  return false
}
