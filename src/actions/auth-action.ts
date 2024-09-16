'use server'
export const createMessage = async (formData: FormData) => {
    try {
        const res = await fetch('http://localhost:3000/api/messages', {
            body: formData, method: 'POST',
        })
        const resData = await res.json()
        return resData
    } catch (error) {
        return {
            error: 'unable to save message',
        }
    }
}

export async function getMessage(id: string) {
    try {
        const res = await fetch('http://localhost:3000/api/messages?id=' + id, { cache: 'no-store' })
        const resData = await res.json();
        return resData
    } catch (error) {
        return {
            error: 'unable to get message',
        }
    }
}
