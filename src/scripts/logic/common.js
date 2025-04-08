function ConvertTo_yyyy_mm_dd(date) {
    /*return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
        + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
        + '/' + date.getFullYear()*/
    return '' + date.getFullYear()
        + '-' + ((date.getMonth() > 8) ? ('' + (date.getMonth() + 1)) : ('0' + (date.getMonth() + 1)))
        + '-' + (((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())))
}

function ConvertToDateAndTime(isoDate) {

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






const zeroPad = (num, pad) => {
    return String(num).padStart(pad, '0')
}

const isSameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

export const parseTimestamp = (timestamp, format = '') => {
    if (!timestamp) return

    const date = timestamp.seconds
        ? new Date(timestamp.seconds * 1000)
        : timestamp

    if (format === 'HH:mm') {
        return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
    } else if (format === 'DD MMMM YYYY') {
        const options = { month: 'long', year: 'numeric', day: 'numeric' }
        return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`
    } else if (format === 'DD/MM/YY') {
        const options = { month: 'numeric', year: 'numeric', day: 'numeric' }
        return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`
    } else if (format === 'DD MMMM, HH:mm') {
        const options = { month: 'long', day: 'numeric' }
        return `${new Intl.DateTimeFormat('en-GB', options).format(
            date
        )}, ${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
    }

    return date
}

export const formatISODateWithDDMM = (isoDate) => {
    const date = new Date(isoDate);    
    return date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit' });
};

export const formatISODate = (isoDate) => {
    const date = new Date(isoDate);
    const timestampFormat = isSameDay(date, new Date()) ? 'HH:mm' : 'DD/MM/YY';
    
    let result;
    if (timestampFormat === 'HH:mm') {
        result = date.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `Today, ${result}`;
    } else {
        result = date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
        return result;
    }
};

export const formatISODateWithHMS = (isoDate) => {
    const date = new Date(isoDate);
    
    if (isNaN(date)) {
        throw new Error('Invalid date format');
    }
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    return date.toLocaleString('en-US', options);;
}

export const reactionMap = {
    'U+1F601': '😁',
    'U+1F970': '🥰'
}

export { ConvertTo_yyyy_mm_dd, readErr }