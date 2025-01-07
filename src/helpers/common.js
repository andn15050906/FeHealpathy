function ConvertTo_yyyy_mm_dd(date) {
    /*return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
        + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
        + '/' + date.getFullYear()*/
    return '' + date.getFullYear()
        + '-' + ((date.getMonth() > 8) ? ('' + (date.getMonth() + 1)) : ('0' + (date.getMonth() + 1)))
        + '-' + (((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())))
}

function readErr(error) {
    if (!error.response) {
        console.log(error);
        return 'An Error Occured!';
    }

    let data = error.response.data;
    let errorMessage;
    if (data.status == 400 && data.title == "One or more validation errors occurred.") {
        // return the first ASP.NET validation error
        let firstProp = Object.values(data.errors)[0]
        errorMessage = firstProp[0];
    }
    else {
        errorMessage = error.response.data;
    }

    console.log(errorMessage);

    let startsWith3digits = /^\d{3}/;
    if (startsWith3digits.test(errorMessage)) {
        // if starts with status code, skip 'xxx: '
        return errorMessage.substring(5);
    }

    return 'An Error Occured!';
}

export { ConvertTo_yyyy_mm_dd, readErr }