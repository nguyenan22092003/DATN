var arrVoucher = [];
$(document).ready(function () {
    GetAll();
    var enddate;
    setInterval(function () {
        updateCountdown(enddate);
        GetAll();
    }, 1000);
});
function updateCountdown(endDate) {
    var nowDate = new Date();
    endDate = new Date(endDate);
    var timeRemaining = endDate - nowDate;

    if (timeRemaining <= 0) {
        countdowntext = 'Khuyến mại đã kết thúc';
        return countdowntext;
    } else {
        var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        var color = days >= 5 ? 'green' : (days > 3 ? '#e6b800' : 'red');
        countdowntext = `<span class="fw-bold" style="color: ${color};">${days}</span> ngày <span class="fw-bold" style="color: ${color};">${hours}</span> giờ <span class="fw-bold" style="color: ${color};">${minutes}</span> phút <span class="fw-bold" style="color: ${color};">${seconds}</span> giây`;
        return countdowntext;
    }
}
function GetAll() {
    var keyword = $('#voucher_keyword').val();
    $.ajax({
        url: '/admin/voucher/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrVoucher = result;
            var html = '';
            $.each(result, function (key, item) {
                var voucherType = item.voucherType == 0 ? "Giảm theo phần trăm" : "Giảm trực tiếp"
                var startDate = new Date(item.startDate);
                var endDate = new Date(item.endDate);
                var discountValue = item.voucherType === 0 ? `Giảm ${item.discountValue} %` : `Giảm ${item.discountValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
                enddate = item.endDate;
                countdowntext = updateCountdown(enddate);
                html += `<tr>
                           <td>
                                <button class="btn btn-success btn-sm" onclick="editVoucher(${item.voucherID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteVoucher(${item.voucherID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td>${item.voucherName}</td>
                            <td>${item.voucherCode}</td>
                            <td>${item.quantity}</td>
                            <td>${startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear()}</td>
                            <td>${endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear()}</td>
                            <td>${discountValue}</td>
                            <td>${countdowntext}</td>
                        </tr>`;
            });
            $('#tbody_voucher').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function validate() {
    var id = parseInt($('#voucher_id_voucher').val());
    var voucherName = $('#voucher_name_voucher').val();
    var voucherCode = $('#voucher_code_voucher').val();
    var quantity = parseInt($('#voucher_quantity_voucher').val());
    var startDate = $('#voucher_start_date_voucher').val();
    var endDate = $('#voucher_end_date_voucher').val();
    var type = $('#voucher_type_voucher').val();
    var discountValue = parseInt($("#voucher_discount_value_voucher").val());
    var minValue = parseInt($("#voucher_min_value_voucher").val());
    var maxValue = parseInt($("#voucher_max_value_voucher").val());
    if (voucherName == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập tên chương trình Voucher!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (voucherCode == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập mã Voucher!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (quantity == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập số lượng Vouhcher!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (isNaN(quantity) || quantity <= 0 || quantity.toString().length > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập lại số lượng Voucher!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (startDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày áp dụng Voucher!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (endDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày kết thúc Voucher!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (startDate >= endDate) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    //if (id == 0) {
    //    var nowDate = new Date();
    //    startDate = new Date(startDate);
    //    if (startDate < nowDate) {
    //        Swal.fire({
    //            icon: 'error',
    //            title: 'Oops...',
    //            text: 'Ngày bắt đầu phải lớn hơn hoặc bằng hiện tại!',
    //            showConfirmButton: false,
    //            timer: 3000
    //        })
    //        return false;
    //    }
    //}
    if (type == 0) {
        if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Vui lòng nhập lại giá trị giảm!',
                showConfirmButton: false,
                timer: 3000
            })
            return false;
        }
        if (isNaN(maxValue) || maxValue <= 0 || maxValue.toString().length > 10) {
            swal.fire({
                icon: 'error',
                title: 'oops...',
                text: 'Vui lòng nhập lại giá trị giảm tối đa!',
                showconfirmbutton: false,
                timer: 3000
            })
            return false;
        }
    }
    if (type == 1) {
        if (isNaN(discountValue) || discountValue <= 0 || discountValue.toString().length > 10) {
            swal.fire({
                icon: 'error',
                title: 'oops...',
                text: 'Vui lòng nhập lại giá trị giảm!',
                showconfirmbutton: false,
                timer: 3000
            })
            return false;
        }
    }
    
    return true;
}
function checkDiscountValue(value) {
    var discountType = $("#voucher_type_voucher").val();
    if (discountType == 0) {
        if (isNaN(value) || value <= 0 || value > 100) {
            $("#discountValueError").html("Giá trị giảm phải từ 0 đến 100");
            $("#discountValueError").show();
        } else {
            $("#discountValueError").hide();
        }
    //    $('#voucher_max_value_voucher').prop("disabled", false);
        $('#max_value').show();
    } else if (discountType == 1) {
        if (isNaN(value) || value <= 0) {
            $("#discountValueError").html("Giá trị giảm phải lớn hơn 0");
            $("#discountValueError").show();
        } else if (value.toString().length > 10) {
            $("#discountValueError").html("Giá trị giảm không vượt quá 10 ký tự");
            $("#discountValueError").show();
        } else {
            $("#discountValueError").hide();
        }
        //$('#voucher_max_value_voucher').prop("disabled", true);
        $('#max_value').hide();
    }
}
function check() {
    var discountValueFirst = parseInt($("#voucher_discount_value_voucher").val());
    checkDiscountValue(discountValueFirst);
    $("#voucher_discount_value_voucher").on("input", function () {
        var discountValue = parseInt($(this).val());
        checkDiscountValue(discountValue);
    });

    $("#voucher_type_voucher").on("change", function () {
        checkDiscountValue(parseInt($("#voucher_discount_value_voucher").val()));
    });
}
function createUpdate() {
    if (!validate()) return;
    var id = parseInt($('#voucher_id_voucher').val());
    var name = $('#voucher_name_voucher').val();
    var code = $('#voucher_code_voucher').val();
    var quantity = $('#voucher_quantity_voucher').val();
    var start_date = $('#voucher_start_date_voucher').val();
    var end_date = $('#voucher_end_date_voucher').val();
    var type = $('#voucher_type_voucher').val();
    var discount_value = parseInt($("#voucher_discount_value_voucher").val());
    var min_value = parseInt($("#voucher_min_value_voucher").val());
    var max_value = parseInt($("#voucher_max_value_voucher").val());
    var description = '';
    //var startDate = new Date(start_date);
    //var endDate = new Date(end_date);
    //if (type == 0) {
    //    description = `Giảm ${discount_value} % cho toàn bộ đơn hàng từ ngày ${startDate.getDate()}/${(startDate.getMonth() + 1)}/${startDate.getFullYear()} đến hết ngày ${endDate.getDate()}/${(endDate.getMonth() + 1)}/${endDate.getFullYear()}`;
    //} else {
    //    description = `Giảm ${discount_value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} VND cho toàn bộ đơn hàng từ ngày ${startDate.getDate()}/${(startDate.getMonth() + 1)}/${startDate.getFullYear()} đến hết ngày ${endDate.getDate()}/${(endDate.getMonth() + 1)}/${endDate.getFullYear()}`;
    //}

    var voucher = {
        VoucherID: id,
        VoucherName: name,
        VoucherCode: code,
        Quantity: quantity,
        StartDate: start_date,
        EndDate: end_date,
        VoucherType: type,
        DiscountValue: discount_value,
        MinValue: min_value,
        MaxValue: max_value,
        Description: description
    }
    if (start_date == "") {
        voucher.StartDate = null;
    }
    if (end_date == "") {
        voucher.EndDate = null;
    }
    var obj = {
        Vouchers: voucher
    }
    $.ajax({
        url: '/admin/voucher/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAll();
                $('#modal_voucher').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function addVoucher() {
    $('#voucher_id_voucher').val(0);
    $('#voucher_name_voucher').val('');
    const currentDate = new Date();
    const currentTick = currentDate.getTime();
    var code = "VC" + currentTick;
    $('#voucher_code_voucher').val(code);
    $('#voucher_quantity_voucher').val(0);
    $('#voucher_start_date_voucher').val('');
    $('#voucher_end_date_voucher').val('');
    $('#voucher_type_voucher').val(0);
    $('#voucher_discount_value_voucher').val(0);
    $('#voucher_min_value_voucher').val(0);
    $('#voucher_max_value_voucher').val(0);
    $('#voucher_max_value_voucher').prop("disabled", false);
    check();
    $('#modal_voucher').modal('show');
}

function editVoucher(id) {
    $('#voucher_id_voucher').val(id);
    var voucher = arrVoucher.find(p => p.voucherID == id);
    $('#voucher_name_voucher').val(voucher.voucherName);
    $('#voucher_code_voucher').val(voucher.voucherCode);
    $('#voucher_quantity_voucher').val(voucher.quantity);
    $('#voucher_start_date_voucher').val(voucher.startDate);
    $('#voucher_end_date_voucher').val(voucher.endDate);
    $('#voucher_type_voucher').val(voucher.voucherType);
    $('#voucher_discount_value_voucher').val(voucher.discountValue);
    $('#voucher_min_value_voucher').val(voucher.minValue);
    $('#voucher_max_value_voucher').val(voucher.maxValue);
    if (voucher.voucherType == 0) {
        $('#voucher_max_value_voucher').prop("disabled", false);
    } else {
        $('#voucher_max_value_voucher').prop("disabled", true);
    }
    check();
    $('#modal_voucher').modal('show');
}
function deleteVoucher(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',

    }).then((result) => {

        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/voucher/delete',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(id),
                success: function (result) {
                    if (result == 1) {
                        GetAll();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `${result}`,
                            showConfirmButton: false,
                            timer: 10000
                        });
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })


}
