var countdowntext = '';
var coupon = [];
var voucher = [];
var couponID = 0;
var voucherID = 0;
var enddate;
//function formatCurrency(value) {
//    return value.toLocaleString('en-US', {
//        style: 'currency',
//        currency: 'VND',
//        minimumFractionDigits: 0,
//        maximumFractionDigits: 0
//    });
//}

var totalMoney = 0;
function GetCartCheckOut() {
    $.ajax({
        url: '/Cart/GetProductInCart',
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { customerID: GetUserId() },
        success: function (result) {
            console.log(result)
            totalMoney = 0;
            var html = '';
            $.each(result, (key, item) => {
                html += `<tr class="cart-item">
                            <td class="product-name">${item.ProductSkuName} <span class="product-quantity"> x${item.QuantityCart} </span></td>
                            <td class="product-total">${formatCurrency.format(item.TotalPrice)}</td>
                        </tr>`;
                totalMoney += item.TotalPrice;
            })
            $('#tbody_checkout_product').html(html);
            $('#subtotal_checkout').text(formatCurrency.format(totalMoney));
            $('#total_value').text(formatCurrency.format(totalMoney));
            $('#total_hidden').val(totalMoney);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
$(document).ready(function () {

    //var customerID = 1;
    //if (customerID != undefined) {
    //    GetVoucher(customerID);

    //    var enddate;
    //    setInterval(function () {
    //        updateCountdown(enddate);
    //        GetVoucher(customerID);
    //    }, 1000 * 60 * 60);
    //}
    GetCartCheckOut();
    $('#provin').change(function () {
        //loadTotal();
        var id_provin = this.value;
        $('#district option').remove();
        $('#district').append(new Option("-- Chọn quận/huyện --", 0));

        $('#ward option').remove();
        $('#ward').append(new Option("-- Chọn phường/xã --", 0));

        if (this.value != 0) {

            $.ajax({
                url: '/Checkout/GetListDistrict',
                type: 'GET',
                dataType: 'json',
                data: {
                    idProvin: id_provin

                },
                contentType: 'application/json',
                success: function (result) {

                    $.each(result.data, function (key, val) {
                        $("#district").append(new Option(val.DistrictName, val.DistrictID));
                    });

                }

            });


        }

    });
    //Chọn quận huyện
    $('#district').change(function () {
        //loadTotal();
        var id_ward = this.value;
        $('#ward option').remove();
        $('#ward').append(new Option("-- Chọn phường/xã --", 0));

        if (this.value != 0) {

            $.ajax({
                url: '/Checkout/GetListWard',
                type: 'GET',
                dataType: 'json',
                data: {
                    idWard: id_ward

                },
                contentType: 'application/json',
                success: function (result) {

                    $.each(result.data, function (key, val) {
                        $("#ward").append(new Option(val.WardName, val.WardCode));
                    });

                }

            });


        }

    });
    //Tính phí ship
    //Chọn xã
    $('#ward').change(function () {
        var id_ward = this.value;
        sessionStorage.removeItem('shiptotal');
        $("#total_ship").text('');

        if (this.value != 0) {


            var districtID = parseInt($('#district').val());
            var urlService = `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services?shop_id=4189080&from_district=3440&to_district=${districtID}`
            $.ajax({
                url: urlService,
                type: 'GET',
                dataType: 'json',
                //data: JSON.stringify(obj),
                //contentType: 'application/json',
                headers: { 'token': '4984199c-febd-11ed-8a8c-6e4795e6d902' },
                success: function (result1) {
                    var obj = {
                        service_id: result1.data[0].service_id,
                        insurance_value: 10000,
                        service_type_id: null,
                        coupon: null,
                        from_district_id: 3440,
                        to_ward_code: id_ward,
                        to_district_id: parseInt($('#district').val()),
                        weight: 200,
                        length: 15,
                        height: 15,
                        width: 15,

                    }
                    $.ajax({
                        url: 'Checkout/GetTotalShipping',
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify(obj),
                        contentType: 'application/json',
                        success: function (result) {

                            $("#total_ship").html(`<span class="font-weight-bold">${formatCurrency.format(result.data.total)}</span> `);

                            $("#total_value").html(`<p class="font-weight-bold">${formatCurrency.format(result.data.total + totalMoney)}</p> `);

                            let adress = "," + $("#ward option:selected").text() + "," + $("#district option:selected").text() + "," + $("#provin option:selected").text();
                            //add địa chỉ
                            $("#adress_detail").val(adress);
                            $("#total_hidden").val(result.data.total + totalMoney);
                            if (couponID > 0) {
                                addCoupon();
                            }
                            if (voucherID > 0) {
                                addVoucher();
                            }
                            //Id địa chỉ
                            //$("#WardID").val($("#ward option:selected").val());
                            //$("#ProvinID").val($("#provin option:selected").val());
                            //$("#DistrictID").val($("#district option:selected").val());
                        }

                    });
                }

            });

        }
    });
    GetCartCheckOut();
});
function updateCountdown(endDate) {
    var nowDate = new Date();
    endDate = new Date(endDate);
    var timeRemaining = endDate - nowDate;

    if (timeRemaining <= 0) {
        countdowntext = 'Đã hết hạn';
        return countdowntext;
    } else {
        var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        if (days > 0) {
            countdowntext = '';
        } else if (hours > 0) {
            countdowntext = `Hết hạn sau ${hours} giờ nữa`;
        } else {
            countdowntext = `<span clas="text_denger">Chỉ còn chưa tới 1 giờ nữa<span>`;
        }
        return countdowntext;
    }
}
function addCoupon() {
    var code = $('#coupon_code').val();
    var total = $('#total_hidden').val();
    var phone = $("#phone_ck").val();
    if (voucher.length > 0) {
        alert("Bạn chỉ áp dụng được 1 chương trình khuyến mãi. Đơn hàng của bạn đã áp dụng Voucher!");
        return;
    }
    $.ajax({
        url: '/checkout/addcoupon',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: {
            couponCode: code,
            total: total,
            phone: phone
        },

        success: function (result) {
            if (result !== null) {
                if (result.coupon !== null) {
                    coupon.push(result.coupon);
                } else {
                    coupon = [];
                }
                var value = result.value === 0 ? '0' : `-${result.value.toLocaleString({ style: 'currency', currency: 'VND' })} ₫`;
                $('#value').text(value);
                $('#discount_hidden').val(result.value);
                if (result.coupon === null) {
                    couponID = 0;
                } else {
                    couponID = result.coupon.couponID;
                }
                $('#total_value').text(`${result.totalValue.toLocaleString({ style: 'currency', currency: 'VND' })} ₫`);
                $('#coupon_note').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    ${result.note}
                                </div>`);
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}
function GetVoucher(customerID) {
    $.ajax({
        url: '/checkout/getvoucher-by-customer',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: { customerID: customerID },

        success: function (result) {
            var html = '';
            var total = $('#total_hidden').val();
            $.each(result, function (key, item) {
                var disabled = '';
                if (customerID === 0 || total <= 0 || total < item.minValue) {
                    disabled = 'disabled';
                }
                var notifi = customerID === 0 ? 'Vui lòng đăng nhập để áp dụng Voucher!' : (total <= 0 ? 'Vui lòng mua sản phẩm để áp dụng Voucher!' : (total < item.minValue ? `<a href="#">Mua thêm <span class="fw-bold">${(item.minValue - total).toLocaleString({ style: 'currency', currency: 'VND' })} ₫</span> để áp dụng được Voucher!</a>` : ''));
                var discount = item.voucherType === 0 ? `Giảm ${item.discountValue} %` : `Giảm ${item.discountValue.toLocaleString({ style: 'currency', currency: 'VND' })} ₫`;
                var condition = item.voucherType === 0 ? `Đơn tối thiểu ${item.minValue.toLocaleString({ style: 'currency', currency: 'VND' })} ₫, giảm tối đa ${item.maxValue.toLocaleString({ style: 'currency', currency: 'VND' })} ₫` : `Đơn tối thiểu ${item.minValue.toLocaleString({ style: 'currency', currency: 'VND' })} ₫`;
                var percentuse = item.useQuantity / item.quantity * 100;
                var endDate = new Date(item.endDate);
                enddate = item.endDate;
                countdowntext = updateCountdown(enddate) === '' ? `HSD: ${endDate.getDate()}.${(endDate.getMonth() + 1)}.${endDate.getFullYear()}` : updateCountdown(enddate);
                html += `<div class="card" data-bg-img=" assets /images/photos/bg1.webp" style="background-image: url('assets/images/photos/bg1.webp'); background-size: 200%;">
                                 <div class="card-body">
                                 <input hidden id="voucherID" value="${item.voucherID}"/>
                                     <div class="row">
                                         <div class="col-md-10">
                                             <h5 class="card-title">${discount}</h5>
                                         </div>
                                         <div class="col-md-2">
                                             <input id="input_voucher_${item.voucherID}" type="radio" name="voucher" class="form-check-input" ${disabled}>
                                         </div>
                                         <p class="card-text">${condition}</p>
                                         <div class="d-flex justify-content-between align-items-center">
                                             <span class="text-muted">Đã dùng ${parseInt(percentuse)}%</span>
                                             <span class="text-muted">${countdowntext}</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <div class="bg-danger text-white">
                                ${notifi}                           
                             </div>
                             <br />`
            });
            $('#checkout_voucher').html(html);
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}
function onVoucher() {
    GetVoucher(GetUserId());
    setInterval(function () {
        updateCountdown(enddate);
        GetVoucher(GetUserId());
    }, 1000 * 60 * 60);

    $('input[name="voucher"]').prop('checked', false);
    $(`#input_voucher_${voucherID}`).prop('checked', true);
    $('#modal_voucher').modal('show');
}
function addVoucher() {
    var total = $('#total_hidden').val();
    if (coupon.length > 0) {
        alert("Bạn chỉ áp dụng được 1 chương trình khuyến mãi. Đơn hàng của bạn đã áp dụng Coupon!");
        $('#modal_voucher').modal('hide');
        return;
    }
    var checkedRadio = $('input[type="radio"][name="voucher"]:checked');
    if (checkedRadio.length > 0) {
        voucherID = checkedRadio.closest('.card').find('#voucherID').val();
    }
    $.ajax({
        url: '/checkout/addvoucher',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: {
            voucherID: voucherID,
            total: total
        },
        success: function (result) {
            if (result !== null) {
                if (result.voucher !== null) {
                    voucher.push(result.voucher);
                } else {
                    voucher = [];
                }
                var value = result.value === 0 ? '0' : `-${result.value.toLocaleString({ style: 'currency', currency: 'VND' })} ₫`;
                $('#value').text(value);
                $('#discount_hidden').val(result.value);
                $('#total_value').text(`${result.totalValue.toLocaleString({ style: 'currency', currency: 'VND' })} ₫`);
                $('#voucher_note').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                            ${result.note}
                                        </div>`);
                if (result.note === null) {
                    $('#voucher_note').hide();
                }
                $('#modal_voucher').modal('hide');
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}
function clearVoucher() {
    if (coupon.length > 0) {
        $('#modal_voucher').modal('hide');
        return;
    }
    voucherID = 0;
    var total = $('#total_hidden').val();
    $.ajax({
        url: '/checkout/addvoucher',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: { voucherID: voucherID, total: total },
        success: function (result) {
            if (result !== null) {
                voucher = [];
                $('#value').text(result.value);
                //$('#total_value').text(`${result.totalValue} ₫`);
                $('#total_value').text(`${formatCurrency.format(result.totalValue)}`);
                $('#voucher_note').hide();
                $('#modal_voucher').modal('hide');
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}



function CreateOrder() {
    var useVNPay = $("#flexRadioDefault2").is(":checked");
    var discount = $('#discount_hidden').val();
    var obj = {
        FullName: $("#fullname_ck").val(),
        Email: $("#email_ck").val(),
        Phone: $("#phone_ck").val(),
        Address: $("#adress_detail").val(),
        Note: $("#note_ck").val(),
        UseVNPay: useVNPay,
        CouponID: parseInt(couponID),
        VoucherID: parseInt(voucherID),
        Discount: parseInt(discount),
        CustomerID: GetUserId()
    }
    $.ajax({
        url: '/checkout/create-order',
        type: 'POST',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                MessageSucces("Thanh toán thành công!");
                window.location.href = `/`
            } else if (result == 0) {

                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            } else {
                window.location.href = `${result}`;
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}


