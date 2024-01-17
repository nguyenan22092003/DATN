var arrCoupon = [];
$(document).ready(function () {
    GetAll();
    var enddate;
    // Cập nhật lại sau mỗi ngày
    //setinterval(function () {
    //    updateCountdown(endDate);
    //}, 24 * 60 * 60 * 1000);

    //// Cập nhật lại sau mỗi phút
    //setInterval(function () {
    //    updateCountdown(endDate);
    //}, 60 * 1000);

    // Cập nhật thời gian còn lại mỗi giây
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
        countdowntext = 'Giảm giá đã kết thúc';
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
    var keyword = $('#coupon_keyword').val();
    $.ajax({
        url: '/admin/coupon/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCoupon = result;
            var html = '';
            $.each(result, function (key, item) {
                var couponType = item.couponType == 0 ? "Giảm theo phần trăm" : "Giảm trực tiếp"
                var startDate = new Date(item.startDate);
                var endDate = new Date(item.endDate);
                var discountValue = item.couponType === 0 ? `Giảm ${item.discountValue} %` : `Giảm ${item.discountValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
                enddate = item.endDate;
                countdowntext = updateCountdown(enddate);
                html += `<tr>
                           <td>
                                <button class="btn btn-success btn-sm" onclick="editCoupon(${item.couponID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteCoupon(${item.couponID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>

                            <td>${item.couponName}</td>
                            <td>${item.couponCode}</td>
                            <td>${item.quantity}</td>
                            <td>${startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear()}</td>
                            <td>${endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear()}</td>
                            <td>${discountValue}</td>
                            <td>${countdowntext}</td>
                        </tr>`;
            });
            $('#tbody_coupon').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function validate() {
    var id = parseInt($('#coupon_id_coupon').val());
    var couponName = $('#coupon_name_coupon').val();
    var couponCode = $('#coupon_code_coupon').val();
    var quantity = parseInt($('#coupon_quantity_coupon').val());
    var startDate = $('#coupon_start_date_coupon').val();
    var endDate = $('#coupon_end_date_coupon').val();
    var type = $('#coupon_type_coupon').val();
    var discountValue = parseInt($("#coupon_discount_value_coupon").val());
    if (couponName == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập tên chương trình Coupon!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (couponCode == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập mã Coupon!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (quantity == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập số lượng Coupon!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (isNaN(quantity) || quantity <= 0 || quantity.toString().length > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập lại số lượng Coupon!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (startDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày áp dụng Coupon!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (endDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày kết thúc Coupon!',
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
    }
    if (type == 1) {
        if (isNaN(discountValue) || discountValue <= 0 || discountValue.toString().length > 10) {
            swal.fire({
                icon: 'error',
                title: 'oops...',
                text: 'vui lòng nhập lại giá trị giảm!',
                showconfirmbutton: false,
                timer: 3000
            })
            return false;
        }
    }
    return true;
}
function checkDiscountValue(value) {
    var discountType = $("#coupon_type_coupon").val();
    if (discountType == 0) {
        if (isNaN(value) || value <= 0 || value > 100) {
            $("#discountValueError").html("Giá trị giảm phải từ 0 đến 100");
            $("#discountValueError").show();
        } else {
            $("#discountValueError").hide();
        }
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
    }
}
function check() {
    var discountValueFirst = parseInt($("#coupon_discount_value_coupon").val());
    checkDiscountValue(discountValueFirst);
    $("#coupon_discount_value_coupon").on("input", function () {
        var discountValue = parseInt($(this).val());
        checkDiscountValue(discountValue);
    });

    $("#coupon_type_coupon").on("change", function () {
        checkDiscountValue(parseInt($("#coupon_discount_value_coupon").val()));
    });
}
function createUpdate() {
    if (!validate()) return;
    var id = parseInt($('#coupon_id_coupon').val());
    var name = $('#coupon_name_coupon').val();
    var code = $('#coupon_code_coupon').val();
    var quantity = $('#coupon_quantity_coupon').val();
    var start_date = $('#coupon_start_date_coupon').val();
    var end_date = $('#coupon_end_date_coupon').val();
    var type = $('#coupon_type_coupon').val();
    var discount_value = parseInt($("#coupon_discount_value_coupon").val());
    var description = '';
        var startDate = new Date(start_date);
        var endDate = new Date(end_date);
        if (type == 0) {
            description = `Giảm ${discount_value} % cho toàn bộ đơn hàng từ ngày ${startDate.getDate()}/${(startDate.getMonth() + 1)}/${startDate.getFullYear()} đến hết ngày ${endDate.getDate()}/${(endDate.getMonth() + 1)}/${endDate.getFullYear()}`;
        } else {
            description = `Giảm ${discount_value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} VND cho toàn bộ đơn hàng từ ngày ${startDate.getDate()}/${(startDate.getMonth() + 1)}/${startDate.getFullYear()} đến hết ngày ${endDate.getDate()}/${(endDate.getMonth() + 1)}/${endDate.getFullYear()}`;
    }

    var coupon = {
        CouponID: id,
        CouponName: name,
        CouponCode: code,
        Quantity: quantity,
        StartDate: start_date,
        EndDate: end_date,
        CouponType: type,
        DiscountValue: discount_value,
        Description: description
    }
    if (start_date == "") {
        coupon.StartDate = null;
    }
    if (end_date == "") {
        coupon.EndDate = null;
    }
    var obj = {
        Coupon: coupon
    }
    $.ajax({
        url: '/admin/coupon/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAll();
                $('#modal_coupon').modal('hide');
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

function addCoupon() {
    $('#coupon_id_coupon').val(0);
    $('#coupon_name_coupon').val('');
    const currentDate = new Date();
    const currentTick = currentDate.getTime();
    var code = "CP" + currentTick;
    $('#coupon_code_coupon').val(code);
    $('#coupon_quantity_coupon').val(0);
    $('#coupon_start_date_coupon').val('');
    $('#coupon_end_date_coupon').val('');
    $('#coupon_type_coupon').val(0);
    $('#coupon_discount_value_coupon').val(0);
    check();
    $('#modal_coupon').modal('show');
}

function editCoupon(id) {
    $('#coupon_id_coupon').val(id);
    var coupon = arrCoupon.find(p => p.couponID == id);
    $('#coupon_name_coupon').val(coupon.couponName);
    $('#coupon_code_coupon').val(coupon.couponCode);
    $('#coupon_quantity_coupon').val(coupon.quantity);
    $('#coupon_start_date_coupon').val(coupon.startDate);
    $('#coupon_end_date_coupon').val(coupon.endDate);
    $('#coupon_type_coupon').val(coupon.couponType);
    $('#coupon_discount_value_coupon').val(coupon.discountValue);
    check();
    $('#modal_coupon').modal('show');
}
function deleteCoupon(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',

    }).then((result) => {

        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/coupon/delete',
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
