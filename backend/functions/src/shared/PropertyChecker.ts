
export function checkParamsExist(objToCheck: any, properties: string[]) {
    const keys: string[] = Object.keys(objToCheck);
    return properties.every((prop) => keys.includes(prop));
}