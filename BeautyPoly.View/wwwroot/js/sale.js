var arrSale = [];
var arrOption = [];
var arrOptionValue = [];
var arrProductSkus = [];
var arrProductSkuItems = [];
$(document).ready(function () {
    GetAll();
    GetOption();
    GetAllOptionValue();
    $('#select_option_value_productsku').hide();
    // Cập nhật thời gian
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
        countdowntext = 'Khuyến mãi đã kết thúc';
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
    var keyword = $('#sale_keyword').val();
    $.ajax({
        url: '/admin/sale/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrSale = result;
            var html = '';
            var countdowntext = '';
            $.each(result, function (key, item) {
                //var saleType = item.saleType == 0 ? "Giảm theo phần trăm" : "Giảm trực tiếp"
                var startDate = new Date(item.startDate);
                var endDate = new Date(item.endDate);
                var discountValue = item.saleType === 0 ? `${item.discountValue} %` : `${item.discountValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
                enddate = item.endDate;
                countdowntext = updateCountdown(enddate);
                if (item.isDelete == false) {
                    html += `<tr>
                           <td>
                                <button class="btn btn-success btn-sm" onclick="editSale(${item.saleID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteSale(${item.saleID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td>${item.saleName}</td>
                            <td>${item.saleCode}</td>
                            <td>${item.quantity}</td>
                            <td>${startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear()}</td>
                            <td>${endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear()}</td>
                            <td>${discountValue}</td>
                            <td>${countdowntext}</td>
                        </tr>`;
                }
            });
            $('#tbody_sale').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetAllProductSkus() {
    var keyword = $('#productsku_keyword').val();
    var optionID = $('#select_option').val();
    var optionValueID = $('#select_option_value').val();
    $.ajax({
        url: '/admin/productskus/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: {
            filter: keyword,
            optionID: optionID,
            optionValueID: optionValueID
        },
        success: function (result) {
            arrProductSkus = result;
            var html = '';
            $.each(result, function (key, item) {
                var checked = arrProductSkuItems.some(obj => obj.productSkusID === item.productSkusID) ? 'checked' : '';
                var table = checked === 'checked' ? 'table-primary' : '';
                html += `<tr class="${table}">
                           <td class="align-middle text-center">
                                <input id="status_product" class="form-check-input" type="checkbox" onchange="ChangeProductSku(${item.productSkusID} ,this.checked)" ${checked}/>
                            </td>
                            <td class="align-middle"><img src="/images/${item.image}" style="height: 100px !important;"/></td>
                            <td class="align-middle">${item.sku}</td>
                            <td class="align-middle">${item.productVariantName}</td>
                        </tr>`;
            });
            $('#tbody_product_sale').html(html);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetAllProductSkusSelectSale() {
    var keyword = $('#productsku_keyword_productsku').val();
    var optionID = $('#select_option_productsku').val();
    var optionValueID = $('#select_option_value_productsku').val();
    $.ajax({
        url: '/admin/productskus/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: {
            filter: keyword,
            optionID: optionID,
            optionValueID: optionValueID
        },
        success: function (result) {
            arrProductSkus = result;
            var html = '';
            var stt = 1;
            $.each(result, function (key, item) {
                html += `<tr>
                           <td class="align-middle text-center">
                                ${stt}
                            </td>
                            <td class="align-middle"><img src="/images/${item.image}" style="height: 100px !important;"/></td>
                            <td class="align-middle">${item.sku}</td>
                            <td class="align-middle">${item.productVariantName}</td>
                            <td class="align-middle text-center">
                                <button class="btn btn-success btn-sm" onclick="OnSaleOfProductSku(${item.productSkusID})">
                                <i class="bx bx-pencil"></i>
                                </button>
                            </td>
                        </tr>`;
                stt++;
            });
            $('#tbody_product').html(html);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function formatCurrency(value) {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}
function OnSaleOfProductSku(id) {
    $('#productsku_id').val(id);
    $.ajax({
        url: '/admin/saleproductsku/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { productSkuID: id },
        success: function (result) {
            var html = `<tr class="table-secondary">
                   <td>Không áp dụng chương trình nào</td>
                   <td>0</td>
                   <td>0</td>
                   <td>0</td>
                   <td>
                       <div class="form-check form-switch d-flex justify-content-center">
                         <input class="form-check-input" type="radio" role="switch" name="sale" value="0" checked>  
                       </div>
                   </td>
                   <td>
                   </td>
                </tr>`
            $.each(result, (key, item) => {
                var value = item.saleType == 0 ? `${item.discountValue}%` : formatCurrency(parseInt(item.discountValue));
                var salePrice = item.saleType == 0 ? formatCurrency(parseInt(item.price - item.price * item.discountValue / 100)) : formatCurrency(parseInt(item.price - item.discountValue));
                var disabled = '';
                var note = '';
                var checked = item.isSelect ? 'checked' : '';
                var nowDate = new Date();
                var endDate = new Date(item.endDate);
                var timeRemaining = endDate - nowDate;
                if (timeRemaining <= 0) {
                    disabled = 'disabled';
                    salePrice = 0;
                    note = `<span class="text-danger">Chương trình đã kết thúc</span>`;
                    checked = '';
                } else {
                    note = `Áp dụng chương trình giảm <span class="text-danger">${value}</span>`;
                    if (item.saleType == 1) {
                        if (item.price <= item.discountValue) {
                            disabled = 'disabled';
                            salePrice = 0;
                            note = `Giá không phù hợp với giá trị giảm <span class="text-danger">${value}</span>`;
                            checked = '';
                        }
                    }
                }
                html += `<tr>
                            <td>${item.saleName}</td>
                            <td>${formatCurrency(parseInt(item.price))}</td>
                            <td>${salePrice}</td>
                            <td>${note}</td>
                            <td>
                                <div class="form-check form-switch d-flex justify-content-center">
                                  <input class="form-check-input" type="radio" role="switch" name="sale" value="${item.saleID}" ${checked} ${disabled}>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteSaleItem(${item.saleID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                         </tr>`;
                $('#productsku_title').html(`Thông tin các chương trình Sale áp dụng đối với sản phẩm: <span class="text-danger">${item.productVariantName}</span>`);
            });
            $('#list_sale').html(html);
        }
    });
    $('#modal_sale_productsku').modal('show');  
}
function deleteSaleItem(saleID) {
    var productSkuID = parseInt($('#productsku_id').val());
    Swal.fire({
        title: 'Thông báo',
        text: 'Bạn có chắc muốn xóa không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/saleitems/delete',
                type: 'DELETE',
                dataType: 'json',
                /*contentType: 'application/json;charset=utf-8',*/
                data: {
                    productSkuID: productSkuID,
                    saleID: saleID
                },
                success: function (result) {
                    if (result == 1) {
                        onSaveSaleOfProductSku(productSkuID);
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
                    console.log(err);
                }
            });
        }
    });
}
function onSaveSaleOfProductSku() {
    var productSkuID = parseInt($('#productsku_id').val());
    var saleIDSelect = parseInt($('input[name="sale"]:checked').val());
    $.ajax({
        url: '/admin/saleitems/update',
        type: 'POST',
        dataType: 'json',
        /*contentType: 'application/json;charset=utf-8',*/
        data: {
            productSkuID: productSkuID,
            saleIDSelect: saleIDSelect
        },
        success: function (result) {
            if (result === 1) {
                $('#modal_sale_productsku').modal('hide');
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
function GetOption() {
    $.ajax({
        url: '/admin/product/get-option',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrOption = result;
            var htmlOption = `<option value="0" selected> --Chọn thuộc tính--</option>`;
            $.each(arrOption, function (key, item) {
                htmlOption += `<option value="${item.OptionID}">${item.OptionName}</option>`
            });
            $('#select_option').html(htmlOption);
            $('#select_option_productsku').html(htmlOption);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetAllOptionValue() {
    $.ajax({
        url: '/admin/product/get-option-value',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrOptionValue = result;
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function ChangeOption(id) {
    var result = arrOptionValue.filter(p => p.OptionID == id);
    if (result.length !== 0) {
        var htmlOptionValue = `<option value="0" selected> --Chọn giá trị--</option>`;
        $.each(result, function (key, item) {
            htmlOptionValue += `<option value="${item.OptionValueID}">${item.OptionValueName}</option>`
        });
        $('#select_option_value').html(htmlOptionValue);
        $('#select_option_value').show();
        $('#select_option_value_productsku').html(htmlOptionValue);
        $('#select_option_value_productsku').show();
    } else {
        $('#select_option_value').hide();
        $('#select_option_value_productsku').hide();
    }
}
function GetSaleItemsBySaleID(id) {
    $.ajax({
        url: '/admin/saleitems/get-by-sale-id',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { saleID: id },
        success: function (result) {
            arrProductSkuItems = result;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function validate() {
    var id = parseInt($('#sale_id_sale').val());
    var saleName = $('#sale_name_sale').val();
    var saleCode = $('#sale_code_sale').val();
    var quantity = parseInt($('#sale_quantity_sale').val());
    var startDate = $('#sale_start_date_sale').val();
    var endDate = $('#sale_end_date_sale').val();
    var type = $('#sale_type_sale').val();
    var discountValue = parseInt($("#sale_discount_value_sale").val());
    if (saleName == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập tên chương trình Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (saleCode == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập mã Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (quantity == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập số lượng Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (isNaN(quantity) || quantity <= 0 || quantity.toString().length > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập lại số lượng Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (startDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày áp dụng Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (endDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày kết thúc Sale!',
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
            Swal.fire({
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
    var discountType = $("#sale_type_sale").val();
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
    var discountValueFirst = parseInt($("#sale_discount_value_sale").val());
    checkDiscountValue(discountValueFirst);
    $("#sale_discount_value_sale").on("input", function () {
        var discountValue = parseInt($(this).val());
        checkDiscountValue(discountValue);
    });

    $("#sale_type_sale").on("change", function () {
        checkDiscountValue(parseInt($("#sale_discount_value_sale").val()));
    });
}

function ChangeProductSku(productSkusID, isCheck) {
    var obj = { productSkusID: productSkusID };
    if (isCheck) {
        arrProductSkuItems.push(obj);
    } else {
        arrProductSkuItems = arrProductSkuItems.filter(item => item.productSkusID !== productSkusID);
    }
    GetAllProductSkus();
}
function ChangeProductSkuAllSelect(isCheck) {
    if (isCheck) {
        arrProductSkuItems = arrProductSkus;
    } else {
        arrProductSkuItems = [];
    }
    GetAllProductSkus();
}
function createUpdate() {
    if (!validate()) return;
    var id = parseInt($('#sale_id_sale').val());
    var name = $('#sale_name_sale').val();
    var code = $('#sale_code_sale').val();
    var quantity = $('#sale_quantity_sale').val();

    var start_date = $('#sale_start_date_sale').val();
    var end_date = $('#sale_end_date_sale').val();
    var type = $('#sale_type_sale').val();
    var discount_value = parseInt($("#sale_discount_value_sale").val());

    var sale = {
        SaleID: id,
        SaleName: name,
        SaleCode: code,
        Quantity: quantity,
        StartDate: start_date,
        EndDate: end_date,
        SaleType: type,
        DiscountValue: discount_value
    }
    if (start_date == "") {
        sale.StartDate = null;
    }
    if (end_date == "") {
        sale.EndDate = null;
    }

    var obj = {
        Sale: sale,
        arrSaleItems: arrProductSkuItems
    }
    $.ajax({
        url: '/admin/sale/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAll();
                $('#modal_sale').modal('hide');
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
function addSale() {
    $('#sale_id_sale').val(0);
    $('#sale_name_sale').val('');
    const currentDate = new Date();
    const currentTick = currentDate.getTime();
    var code = "S" + currentTick;
    $('#sale_code_sale').val(code);
    $('#sale_quantity_sale').val(0);
    $('#sale_start_date_sale').val('');
    $('#sale_end_date_sale').val('');
    $('#sale_type_sale').val(0);
    $('#sale_discount_value_sale').val(0);
    arrProductSkuItems = [];
    $('#productsku_keyword').val('');
    $('#select_option').val(0);
    $('#select_option_value').val(0);
    GetAllProductSkus();
    check();
    $('#select_option_value').hide();
    $('#modal_sale').modal('show');
}
function editSale(id) {
    $('#sale_id_sale').val(id);
    var sale = arrSale.find(p => p.saleID == id);
    $('#sale_name_sale').val(sale.saleName);
    $('#sale_code_sale').val(sale.saleCode);
    $('#sale_quantity_sale').val(sale.quantity);
    $('#sale_start_date_sale').val(sale.startDate);
    $('#sale_end_date_sale').val(sale.endDate);
    $('#sale_type_sale').val(sale.saleType);
    $('#sale_discount_value_sale').val(sale.discountValue);
    GetSaleItemsBySaleID(id);
    $('#productsku_keyword').val('');
    $('#select_option').val(0);
    $('#select_option_value').val(0);
    GetAllProductSkus();
    check();
    $('#select_option_value').hide();
    $('#modal_sale').modal('show');
}
function deleteSale(id) {
    var countcate = 0;
    var countproduct = 0;
    $.each(arrCate, function (index, item) {
        var checkExistsCate = arrSaleItemCate.some(p => p.cateID !== item.cateId && p.saleID === id);
        if (checkExistsCate) {
            countcate++;
        }

    });
    $.each(arrProduct, function (index, item) {
        var checkExistsProduct = arrSaleItemProduct.some(p => p.productID !== item.productID && p.saleID === id);
        if (checkExistsProduct) {
            countproduct++;
        }
    });
    var tb = countcate > 0 ? 'Đã có thể loại áp dụng Sale này' : (countproduct > 0 ? 'Đã có sản phẩm áp dụng Sale này' : '');
    Swal.fire({
        title: tb,
        text: 'Bạn có chắc muốn xóa không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/sale/delete',
                type: 'DELETE',
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
                    console.log(err);
                }
            });
        }
    });
}


