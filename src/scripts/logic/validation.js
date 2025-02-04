export const handleFormSubmit = async (callback, sweetAlert) => {
    const result = await sweetAlert.showAlert({
        title: 'Confirmation',
        text: 'Are you sure you want to update this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!'
    });

    if (result.isConfirmed) {
        await callback();
    }
};

export const groupNameRules = [
    val => val && val.length > 0 || 'Trường này không được trống!',
    val => val && val.length <= 200 || 'Tối đa 200 ký tự',
    val => val.match(/^\s*$/) == null || 'Không được nhập ký tự trống!'
];




const isRequired = (val) => {
    if (val === undefined || val === null || val === '')
        return "This field is required!";
    return true;
}

export const isArrayOfType = (val, type) => {
    if (!Array.isArray(val))
        return 'Value is not an array!';
    val.forEach(item => {
        if (!(item instanceof type)) {
            return 'Value contains some items not inheriting ' + type;
        }
    })
    return true;
}