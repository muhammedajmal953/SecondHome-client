
export function isEpiredToken(role:string,token: string): boolean {
  try {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload?.exp) {
      const expireTime = payload.exp * 1000;
      return expireTime <= Date.now();
    }

    return true;
  } catch (error) {
    console.error('Invalid token format:', error);
    return true;
  }
}
