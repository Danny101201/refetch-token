import { customConfig } from "../config/default"
import jwt, { SignOptions } from 'jsonwebtoken'

const privite_key = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQzJMTWxTVHE4czU3YS8KcUlsOE9VWWxYeFFSRmQxUHNrckE3Vi8xRjdhY0hZVGRCRUIxM2Z6aHRXQlpsVnY1QTFQcS9DekVPajJEV2E1MQpUK0dObkE3THlFdUYyZi9vYzB6c21xTGlsdDBkRzd0L2daZTVyNUt2WmwwRGY4YitsR25ib2t1UDlvVDlvam1SCmhKZTc0RDBoU2xwRXdPa3NtbnNMU1lNcGpFaGVxdElybzY4U250N2Fqd2RxM0ZGUUg3TVFVS3RSQTV4M3ZFVWQKZHBFRlBoYnFKWDIrSHpuR01HZThONkY5RVdQNnVvTVlNL3ZnRHRaRitjYWhjWVVsYnkxUDlDdlNaMWJuNXRWcApBT0hicmovMFNVNVl0WmlTOXNZZE5rSjhmRHdGQjhKMmpWRUVuOHVPRk5yOWY2aXFHdm1nK2I0bFFrOERSS05HCjBWYzZnb3h0QWdNQkFBRUNnZ0VBTHlDaTdESUN5MEVlVzdLRDdxajZab3lVS2w5WG8xaGlVa3FXT2xkcUhEVGUKdkRadlhvNlE3dXIzQS9YSmx6K3ZJK2tjdzU2MWJ4ZHlORkwzN0tSa2gzOUhXbGN0QnJ0ZE9SQS85eEpFSFZXaApTYmtDd1R5VVc5L0ZURFJ3REVma29yYjNpVVNpM3VKcXRpUnhCRjljTVJLRkM2aEVLZy9FcVFUWmM1UWczS3d2CjdCdFFLbTdJRXJLUFpXbXVOOEFGVXh4UjBnR1NXY3g2UEVYeUxrS3JqRHA1akJKbjlOUWx3UitVRTNCY24ySEUKWkR4ejQ4bElqM2Q3U3BLRUlvRjN4bWtLYnlxK3dKWURBenlJb2JqNmtvQU50a25TVkJKMzJVZEtYOWl1TUw0dQp4UHRrUTNJTmRxWUJ3RmNOM1N3WUIyWmxyY0daT1I1L0pEMFh2c0JCd1FLQmdRRHVuenNQUFJFZDhoSlREZ0NGCksxQXFVVG8yeXRiWWdQdWhWTEJwbW1Bek1rQnBWa2xkcVc2UUdHNkFYOEd6NEo3UmFyOUc2YTFkZHZad0ViTXYKREtrb1d5Q003dHJNaXZiRnF3bksvUGs4NlY3MWxWT3dNaU5IOUR3WWxzM1RZOWN2Y1AwRCtHOVhFRk5BeUpYbwp1UHVrQmZNblRkM0Ziek5ZSysxOHpuTkdPUUtCZ1FERGNTNHZPWC9TOGU0U1VEZ1A0N282TmdTbldFQTFYenJUCmJYTE1BRGhQTHk2V25mUVBDajVRdUZUUVFXU1Z2ZWRVNzIzQ1ZrNXc2bEFJZHhMU3pnR0NBNFY3Ym9JMnFSYkkKZTUvQk9IN2o0bi9NMkNxcDdYUGFSWjZEaXJ3dDF4Y0ljeEJyQmQ5eVZpU0hpY3FVdVNJbnJoTTUrZHh4dllGYgorYktKczVvWDFRS0JnQ1A3Q3BLL3FJY1ZhMEh1eUpGTCtLaUkydmhNR1oxSHhhbUw5WlhXMjA2Yzh5MXUvMTBLCklVdkZBMVNFRzljZHRaVHFQYkZacHZTQzdhSDBhVXBjNUZ6YmNNc1BjUnFLa2E4NG5SOW9pY1J2aEF3UDJqQ2wKUHNDb3lTOEQva0V6dXN6Q2dzUklmN0ZuR3NhWCtGTEJJZUNYclJSdUgxU1g4ZXdIbzZYQUU0MnhBb0dBZUFGWgorM05SOG9QTXkvL252SkgzT21FSzBIcFd5cTdUbnhqNFFSenRkbW1oTUtpQ1FHM292NFcveGpRdy8rVWdVejNFCjVtdzZOQWtiNVdhLzd5TEJPRVRUUkd3aGxsQ1RCYjBxNWVpN3VVL05hMGxjUVFUbGV5UCtaZ1RjOFVTK0J0a28KUHA3WGlnd3MxL0NhckdGVkFJcFprZUxESWkvYmEwOVIrazJHazVVQ2dZRUFwUVVvNW9TTS9UZjlmNEZ2VWFJYwpBSWZscDFnOWwvZGY2dTJHV3pleWpyUnUvQmtJL1U0MmJsUmJXdkFxVzdpUGhOS0FQY2FlOU1CNm5NTWd5MzJMCnlDb2w3aFpYelBxVkNRTE9yZDFRUVR1U2VBdFBWcjBsT3l2YWo1RDd3cDRtSzB2cnlrUzQ2NUdadTJ2bzdVSlEKUmh1SzBsZEthWWNQRUVHZ1lVSHNNUUE9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K'
const public_key = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF0aXpKVWs2dkxPZTJ2NmlKZkRsRwpKVjhVRVJYZFQ3Skt3TzFmOVJlMm5CMkUzUVJBZGQzODRiVmdXWlZiK1FOVDZ2d3N4RG85ZzFtdWRVL2hqWndPCnk4aExoZG4vNkhOTTdKcWk0cGJkSFJ1N2Y0R1h1YStTcjJaZEEzL0cvcFJwMjZKTGovYUUvYUk1a1lTWHUrQTkKSVVwYVJNRHBMSnA3QzBtREtZeElYcXJTSzZPdkVwN2UybzhIYXR4UlVCK3pFRkNyVVFPY2Q3eEZIWGFSQlQ0Vwo2aVY5dmg4NXhqQm52RGVoZlJGaitycURHRFA3NEE3V1JmbkdvWEdGSlc4dFQvUXIwbWRXNStiVmFRRGgyNjQvCjlFbE9XTFdZa3ZiR0hUWkNmSHc4QlFmQ2RvMVJCSi9MamhUYS9YK29xaHI1b1BtK0pVSlBBMFNqUnRGWE9vS00KYlFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=='

const pri_key = Buffer.from(privite_key, 'base64')
const pub_key = Buffer.from(public_key, 'base64')

// algorithm: 'HS256' symmetric Key( 對稱加密 ) 用法是一個 key 用在 decode 跟 encode ， 不一樣會有 invalid signature
// algorithm: 'PS256' Asymmetric Key ( 非對稱加密 ) 用法是一組私鑰加密一組公鑰（ symmetric Key ）解密，這邊比較特別的是在 PS256 算法中可以用私鑰（ Asymmetric Key ）當作加密跟解密的鑰匙，但公鑰只能用於解密，原因是 PS256 始於非對稱加密算法但公鑰通常會是一個對稱加密，所以不能使用公鑰去加密。

// const token = jwt.sign({ name: 'danny' }, pri_key, {
//   algorithm: 'PS256'
// })
// console.log(token)
// console.log(jwt.verify(token, pub_key))
export const signJwt = (
  payload: Object,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: SignOptions
) => {
  const priviteKey = Buffer.from(customConfig[key], 'base64')
  return jwt.sign(payload, priviteKey, {
    ...options,
    algorithm: 'PS256' // PS256 用於驗證 RSA 算法的密鑰，通常這類演算法的場景是一組私鑰 ( sign ) 和一組公鑰 ( verify )
  })
}
export const verifyJwt = <T>(
  token: string,
  key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
  try {
    const publicKey = Buffer.from(customConfig[key], 'base64') // 將 base64 轉乘 ascii 字元
    return jwt.verify(token, publicKey) as T
  } catch (e) {
    console.error(e)
    return null
  }
}

