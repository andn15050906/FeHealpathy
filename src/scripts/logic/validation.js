const handleFormSubmit = async (callback, sweetAlert) => {
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

const groupNameRules = [
    val => val && val.length > 0 || 'Trường này không được trống!',
    val => val && val.length <= 200 || 'Tối đa 200 ký tự',
    val => val.match(/^\s*$/) == null || 'Không được nhập ký tự trống!'
];




const isRequired = (val) => {
    if (!val)
        return "This field is required!";
    return true;
}

export {
    handleFormSubmit,
    groupNameRules
};