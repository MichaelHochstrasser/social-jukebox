export function createHeader(token: string, params?: any) {
    let options : any = {
        headers: {Authorization: 'Bearer ' + token}
    };

    if (params) {
        options.params = params;
    }

    return options;

}