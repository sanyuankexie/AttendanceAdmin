export class Utils {
  static decrypt(base64Str: string, key: string){
    // Base64解码
    const binaryStr = atob(base64Str)
    const encryptedBytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      encryptedBytes[i] = binaryStr.charCodeAt(i)
    }

    // 准备密钥字节
    const keyBytes = new TextEncoder().encode(key)

    // 循环异或解密
    const decryptedBytes = new Uint8Array(encryptedBytes.length)
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length]
    }

    // 转回UTF-8字符串
    return new TextDecoder().decode(decryptedBytes)
  }
}
