import CryptoJS from 'crypto-js';
export const encryptMessage = (message: string, secret: string = "secret") => {
    return CryptoJS.AES.encrypt(message, secret).toString();
};

export const decryptMessage = (ciphertext: string, secret: string = "secret") => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
};
