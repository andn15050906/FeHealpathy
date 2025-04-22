export const handleFormSubmit = async (callback, sweetAlert) => {
    const result = await sweetAlert.showAlert({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn cập nhật thông tin này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, cập nhật!',
        cancelButtonText: 'Không, hủy bỏ!'
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
        return "Trường này không được trống!";
    return true;
}

export const isArrayOfType = (val, type) => {
    if (!Array.isArray(val))
        return 'Giá trị không phải là mảng!';
    val.forEach(item => {
        if (!(item instanceof type)) {
            return 'Giá trị chứa một số phần tử không kế thừa ' + type;
        }
    })
    return true;
}