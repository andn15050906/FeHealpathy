function ConvertTo_yyyy_mm_dd(date) {
    /*return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
        + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
        + '/' + date.getFullYear()*/
    return '' + date.getFullYear()
        + '-' + ((date.getMonth() > 8) ? ('' + (date.getMonth() + 1)) : ('0' + (date.getMonth() + 1)))
        + '-' + (((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())))
}

export { ConvertTo_yyyy_mm_dd }