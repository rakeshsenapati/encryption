export const calculateExpirationTime = (value: string): string => {
    if (!value) return '';
    const now = new Date();
    let expirationTime;
    if (value === '360') {
        expirationTime = new Date(now.getTime() + 360 * 24 * 60 * 60 * 1000); // Add 360 days
    } else {
        const hours = parseInt(value); // get the number of hours from the select value
        expirationTime = new Date(now.getTime() + hours * 60 * 60 * 1000); // Add hours to current time
    }
    return expirationTime.toISOString();
}