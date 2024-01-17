var _sttContentPayment = 1;

$(document).ready(function () {

    //$('#modal_paymentorder').modal('show');
    //SetFlatpickr('#dateStart');
    //SetFlatpickr('#dateEnd');
    SetFlatpickr('#PaymentOrder_DateOrder');
    GetAllPaymentOrder();
})

function SetFlatpickr(id) {
    flatpickr(id, {
        enableTime: false,
        noCalendar: false,
        time_24hr: true,
        dateFormat: "d/m/Y",
        disableMobile: "true",
        minDate: moment(new Date()).format("DD/MM/YYYY"),
        locale: {
            firstDayOfWeek: 1
        }
    });
}

//Sự kiện get all danh sách đề nghị thanh toán
function GetAllPaymentOrder() {

    //var dateStart = $('#dateStart').val();
    //dateStart = `${dateStart.slice(6, 10)}-${dateStart.slice(3, 5)}-${dateStart.slice(0, 2)}`;
    //var dateEnd = $('#dateEnd').val();
    //dateEnd = `${dateEnd.slice(6, 10)}-${dateEnd.slice(3, 5)}-${dateEnd.slice(0, 2)}`;

    $.ajax({
        url: '/PaymentOrder/GetAll',
        type: 'GET',
        dataType: 'json',
        data: {
            typeOrder: parseInt($('#typeOrder').val()),
            paymentOrderTypeID: parseInt($('#paymentOrderTypeID').val()),
            dateStart: $('#dateStart').val(),
            dateEnd: $('#dateEnd').val(),
            keyword: $('#keyword').val(),

        },
        contentType: 'application/json',
        success: function (result) {
            console.log(result);
            var html = '';
            $.each(result, function (key, item) {
                html += `<tr>
                            <td>${item.RowNum}</td>
                            <td>${moment(item.DateOrder).format("DD/MM/YYYY")}</td>
                            <td class="text-left"><a href="#" onclick="return onPaymentOrderDetail(${item.Id},event);">${item.Code}</a></td>
                            <td class="text-left">${item.FullName}</td>
                            <td class="text-left">${item.DepartmentName}</td>
                            <td class="text-left">${item.TypeOrderText}</td>
                            <td class="text-left">${item.TypeName}</td>
                            <td class="text-left">${item.StatusOrder}</td>
                            <td class="text-left">${item.ReasonCancel}</td>
                            <td class="text-left">${item.Note}</td>
                        </tr>`;
            });

            $('#tbl_payment_order').find('tbody').html(html);
        },

        error: function (err) {
            MessageError(err.responseText);
        }
    });
}

//Sự kiện xem chi tiết phiếu
function onPaymentOrderDetail(id, event) {
    var html = `<tr class="payment-order-details" id="payment_order_details_${id}" style="border-left: 2px solid red; border-right: 2px solid red; border-bottom: 2px solid red;">
                    <td colspan="10">
                        <div class="table-responsive p-2" style="height:250px !important;">
                            <table class="table table-hover table-bordered table-sm m-0">
                                <thead>
                                    <tr class="sticky-top-table">
                                        <th>STT</th>
                                        <th>Nội dung thanh toán</th>
                                        <th>ĐVT</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                        <th>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>@tbody</tbody>
                            </table>
                        </div>
                    </td>
                </tr>`;
    $('.payment-order-details').remove();

    var isShowDetail = $(`#payment_order_details_${id}`).length;
    if (isShowDetail > 0) {
        //$(`#payment_order_details_${id}`).remove();
    } else {
        $.ajax({
            url: '/PaymentOrder/GetDetail',
            type: 'GET',
            dataType: 'json',
            data: {
                paymentOrderID: id
            },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                var htmlBody = ''
                $.each(result, function (key, item) {
                    var styleText = item.ParentId == 0 ? 'font-weight-bold' : '';
                    htmlBody += `<tr>
                                <td class="${styleText}">${item.Stt}</td>
                                <td class="text-left ${styleText}">${item.ContentPayment}</td>
                                <td class="text-left">${item.Unit}</td>
                                <td class="text-right">${item.Quantity}</td>
                                <td class="text-right">${item.UnitPrice}</td>
                                <td class="text-right">${item.TotalMoney}</td>
                                <td class="text-left">${item.Note}</td>
                            </tr>`;
                });

                //$('#tbl_payment_order').find('tbody').html(html);
                html = html.replace('@tbody', htmlBody);
                var el = $(event.target).parent();
                //console.log(event.target);
                $(html).insertAfter($(el).parent());
                $('.selectedrow').each(function (i, el) {
                    $(el).removeClass('selectedrow');
                })
                $(el).parent().addClass('selectedrow');
            },

            error: function (err) {
                MessageError(err.responseText);
            }
        });
    }

}

//Sự kiện click thêm mới đề nghị
function onAddPaymentOrder() {
    $('#modal_paymentorder').modal('show');
}


//Sự kiện khi chọn loại đề nghị
function onChangePaymentOrderType(event) {
    var html = '';
    var htmltable = '';

    $('.modal-title').text($(event.target).find(":selected").text());

    var dateNow = moment(new Date()).format("YYYY-MM-DD");
    var value = parseInt($(event.target).val());
    if (value == 1) { //Đề nghị tạm ứng
        _sttContentPayment = 1;
        $('.PaymentOrderDetail_TotalAdvance').show();

        html = `<div class="form-group col-md-3 m-0 p-1">
                        <label class="m-0">Thời gian thanh quyết toán <span class="text-danger">(*)</span></label>
                        <input id="PaymentOrder_DatePayment" type="text" value="${dateNow}" class="form-control form-control-sm" />
                    </div>
                    <div class="form-group col-md-3 m-0 p-1">
                        <label class="m-0">Hình thức thanh toán</label>
                        <div class="form-control form-control-sm" style="border-color:transparent !important;">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="PaymentOrder_TypePayment_1" name="PaymentOrder_TypePayment" class="custom-control-input" value="1" checked onclick="return onChangeTypePayment();">
                                <label class="custom-control-label" for="PaymentOrder_TypePayment_1">Chuyển khoản</label>
                            </div>

                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="PaymentOrder_TypePayment_2" name="PaymentOrder_TypePayment" class="custom-control-input" value="2" onclick="return onChangeTypePayment();">
                                <label class="custom-control-label" for="PaymentOrder_TypePayment_2">Tiền mặt</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group col-md-3 m-0 p-1">
                        <label class="m-0">Số tài khoản <span class="text-danger validate-typepayment">(*)</span></label>
                        <input id="PaymentOrder_AccountNumber" type="text" value="" class="form-control form-control-sm" />
                    </div>
                    <div class="form-group col-md-3 m-0 p-1">
                        <label class="m-0">Ngân hàng <span class="text-danger validate-typepayment">(*)</span></label>
                        <input id="PaymentOrder_Bank" type="text" value="TPBank" class="form-control form-control-sm" />
                    </div>`;
        htmltable = `<tr>
                        <td class="sticky-left text-nowrap"></td>
                        <td class="PaymentOrderDetail_Stt">1</td>
                        <td class="text-left PaymentOrderDetail_ContentPayment" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-left PaymentOrderDetail_Unit" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_Quantity" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-left PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">0</td>
                    </tr>`;

    } else if (value == 2) {//Đề nghị thanh toán
        _sttContentPayment = 1;
        $('.PaymentOrderDetail_TotalAdvance').hide();

        html = `<div class="form-group col-md-4 m-0 p-1">
                    <label class="m-0">Hình thức thanh toán</label>
                    <div class="form-control form-control-sm" style="border-color:transparent !important;">
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="PaymentOrder_TypePayment_1" name="PaymentOrder_TypePayment" class="custom-control-input" value="1" checked onclick="return onChangeTypePayment();">
                            <label class="custom-control-label" for="PaymentOrder_TypePayment_1">Chuyển khoản</label>
                        </div>

                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="PaymentOrder_TypePayment_2" name="PaymentOrder_TypePayment" class="custom-control-input" value="2" onclick="return onChangeTypePayment();">
                            <label class="custom-control-label" for="PaymentOrder_TypePayment_2">Tiền mặt</label>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-4 m-0 p-1">
                    <label class="m-0">Số tài khoản <span class="text-danger validate-typepayment">(*)</span></label>
                    <input id="PaymentOrder_AccountNumber" type="text" value="" class="form-control form-control-sm" />
                </div>
                <div class="form-group col-md-4 m-0 p-1">
                    <label class="m-0">Ngân hàng <span class="text-danger validate-typepayment">(*)</span></label>
                    <input id="PaymentOrder_Bank" type="text" value="TPBank" class="form-control form-control-sm" />
                </div>`;

        htmltable = `<tr class="fixed-content-payment">
                        <td class="sticky-left text-nowrap"></td>
                        <td class="font-weight-bold PaymentOrderDetail_Stt">I</td>
                        <td class="text-left font-weight-bold PaymentOrderDetail_ContentPayment">Số tiền đã tạm ứng</td>
                        <td class="text-left PaymentOrderDetail_Unit" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_Quantity" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">0</td>
                    </tr>

                    <tr class="fixed-content-payment">
                        <td class="sticky-left text-nowrap"></td>
                        <td class="font-weight-bold PaymentOrderDetail_Stt">II</td>
                        <td class="text-left font-weight-bold PaymentOrderDetail_ContentPayment">Số tiền thanh toán</td>
                        <td class="text-left PaymentOrderDetail_Unit"></td>
                        <td class="text-right PaymentOrderDetail_Quantity"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" id="PaymentOrderDetail_TotalMoney_2"></td>
                        <td class="text-right PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">0</td>
                    </tr>

                    <tr class="edit-content-payment">
                        <td class="sticky-left text-nowrap"></td>
                        <td class="PaymentOrderDetail_Stt">1</td>
                        <td class="text-left PaymentOrderDetail_ContentPayment" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-left PaymentOrderDetail_Unit" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_Quantity" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-left PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">2</td>
                    </tr>

                    <tr class="fixed-content-payment">
                        <td class="sticky-left text-nowrap"></td>
                        <td class="font-weight-bold PaymentOrderDetail_Stt">III</td>
                        <td class="text-left font-weight-bold PaymentOrderDetail_ContentPayment">Chênh lệch</td>
                        <td class="text-left PaymentOrderDetail_Unit"></td>
                        <td class="text-right PaymentOrderDetail_Quantity"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" id="PaymentOrderDetail_TotalMoney_3"></td>
                        <td class="text-right PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">0</td>
                    </tr>
                    <tr class="fixed-content-payment">
                        <td class="sticky-left text-nowrap"></td>
                        <td class="PaymentOrderDetail_Stt">1</td>
                        <td class="text-left PaymentOrderDetail_ContentPayment">Tạm ứng chi không hết (I-II)</td>
                        <td class="text-left PaymentOrderDetail_Unit"></td>
                        <td class="text-right PaymentOrderDetail_Quantity"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" id="PaymentOrderDetail_TotalMoney_31"></td>
                        <td class="text-right PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">3</td>
                    </tr>
                    <tr class="fixed-content-payment">
                        <td class="sticky-left text-nowrap"></td>
                        <td class="PaymentOrderDetail_Stt">2</td>
                        <td class="text-left PaymentOrderDetail_ContentPayment">Số chi quá tạm ứng (II-I)</td>
                        <td class="text-left PaymentOrderDetail_Unit"></td>
                        <td class="text-right PaymentOrderDetail_Quantity"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" id="PaymentOrderDetail_TotalMoney_32"></td>
                        <td class="text-right PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">3</td>
                    </tr>`;
    }


    $('#form').html(html);
    $('#tbl_content_payment').find('tbody').html(htmltable);

    SetFlatpickr('#PaymentOrder_DatePayment');
}

//Sự kiện chọn hình thức thanh toán
function onChangeTypePayment() {
    var value = parseInt($('input[name="PaymentOrder_TypePayment"]:checked').val());
    if (value == 1) {
        $('.validate-typepayment').show();
    } else {
        $('.validate-typepayment').hide();
    }

    $('#PaymentOrder_AccountNumber').prop('disabled', (value == 2));
    $('#PaymentOrder_Bank').prop('disabled', (value == 2));
}

//Sự kiện add nội dung thanh toán
function onAddContentPayment() {
    var html = '';
    var type = parseInt($('#PaymentOrder_TypeOrder').val());
    if (type == 0) {
        _sttContentPayment = 1;
        return false;
    }
    _sttContentPayment++;
    if (type == 1) {//Đề nghị tạm ứng

        html = `<tr>
                     <td class="sticky-left text-nowrap">
                        <button class="btn btn-danger btn-sm" title="Delete" onclick="return onDeleteContentPayment(0,event);"><i class="fas fa-trash"></i></button>
                        <button class="btn btn-warning btn-sm" title="Clear content" onclick="return onDeleteContentPayment(1,event);"><i class="fas fa-times"></i></button>
                    </td>
                    <td class="PaymentOrderDetail_Stt">${_sttContentPayment}</td>
                    <td class="text-left PaymentOrderDetail_ContentPayment" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                    <td class="text-left PaymentOrderDetail_Unit" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                    <td class="text-right PaymentOrderDetail_Quantity" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                    <td class="text-right PaymentOrderDetail_UnitPrice" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                    <td class="text-right PaymentOrderDetail_TotalMoney" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                    <td class="text-left PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                    <td class="PaymentOrderDetail_ParentID">0</td>
                </tr>`;

        $('#tbl_content_payment').find('tbody').append(html);
    } else {//Đề nghị thanh toán
        html = `<tr class="edit-content-payment">
                        <td class="sticky-left text-nowrap">
                            <button class="btn btn-danger btn-sm" title="Delete" onclick="return onDeleteContentPayment(0,event);"><i class="fas fa-trash"></i></button>
                            <button class="btn btn-warning btn-sm" title="Clear content" onclick="return onDeleteContentPayment(1,event);"><i class="fas fa-times"></i></button>
                        </td>
                        <td class="PaymentOrderDetail_Stt">${_sttContentPayment}</td>
                        <td class="text-left PaymentOrderDetail_ContentPayment" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-left PaymentOrderDetail_Unit" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_Quantity" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_UnitPrice" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-right PaymentOrderDetail_TotalMoney" contenteditable="true" data-type="numeric" oninput="return onInputContentPayment(event);"></td>
                        <td class="text-left PaymentOrderDetail_Note" contenteditable="true" data-type="string" oninput="return onInputContentPayment(event);"></td>
                        <td class="PaymentOrderDetail_ParentID">2</td>
                    </tr>`;

        var lastChild = $('.edit-content-payment').last();
        $(html).insertAfter($(lastChild));
    }
}

//Sự kiện xoá nội dung thanh toán
function onDeleteContentPayment(type, event) {
    event.stopPropagation();
    var td = $(event.currentTarget).parent();
    var tr = $(td).parent();

    //console.log(tr);
    var contentPayment = $($(tr).find('.PaymentOrderDetail_ContentPayment')).html();
    if (type == 0) {//Delete

        Swal.fire({
            title: "Are you sure?",
            html: `Bạn có chắc muốn xoá nội dung thanh toán<br>${contentPayment}<br>không?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                $(tr).remove();
            }
        });

    } else {//Clear content
        Swal.fire({
            title: "Are you sure?",
            html: `Bạn có chắc muốn xoá nội dung thanh toán<br>${contentPayment}<br>không?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                $(tr).children().each((i, el) => {
                    if (i >= 2 && i <= 7) {
                        //var content = $(el).html();
                        $(el).html('');
                    }
                })
            }
        });

    }
}

//Sự kiện nhập nội dung thanh toán
function onInputContentPayment(event) {
    var el = event.currentTarget;
    var editContent = $(el).attr('contenteditable');
    var datatype = $(el).attr('data-type');
    //var className = $(el).attr('class');
    //console.log(className, typeof editContent, datatype);

    var value = $(el).html().trim();
    value = value.replace(/,/g, '');
    var regexNummeric = /^[0-9]*$/;

    //Check validate
    if (editContent === 'true') {
        var isNumeric = regexNummeric.test(value);
        $('#btn_savepaymentorder').prop('disabled', (datatype === 'numeric' && !isNumeric));
        if (datatype === 'numeric' && !isNumeric) {
            $(el).addClass('bg-danger text-light');
        } else if (datatype === 'numeric' && isNumeric) {
            $(el).removeClass('bg-danger text-light');
            $(el).html(new Intl.NumberFormat("en-UK").format(value));
        }
    }

    CalculatorTotalPayment();
}

//Sự kiện tính tổng
function CalculatorTotalPayment() {
    var type = parseInt($('#PaymentOrder_TypeOrder').val());

    var paymentdetails = [];
    $('#tbl_content_payment > tbody  > tr').each(function (i, el) {

        var quantity = $($(el).find('.PaymentOrderDetail_Quantity')).html();
        quantity = isNaN(parseInt(quantity.replace(/,/g, ''))) ? 0 : parseInt(quantity.replace(/,/g, ''));
        var unitPrice = $($(el).find('.PaymentOrderDetail_UnitPrice')).html();
        unitPrice = isNaN(parseInt(unitPrice.replace(/,/g, ''))) ? 0 : parseInt(unitPrice.replace(/,/g, ''));
        var totalPrice = $($(el).find('.PaymentOrderDetail_TotalMoney')).html();
        totalPrice = isNaN(parseInt(totalPrice.replace(/,/g, ''))) ? 0 : parseInt(totalPrice.replace(/,/g, ''));

        var objDetail = {
            Stt: $($(el).find('.PaymentOrderDetail_Stt')).html(),
            ContentPayment: $($(el).find('.PaymentOrderDetail_ContentPayment')).html(),
            Unit: $($(el).find('.PaymentOrderDetail_Unit')).html(),
            Quantity: quantity,
            UnitPrice: unitPrice,
            TotalMoney: totalPrice,
            Note: $($(el).find('.PaymentOrderDetail_Note')).html(),
            ParentID: parseInt($($(el).find('.PaymentOrderDetail_ParentID')).html()),
        };
        paymentdetails.push(objDetail);
    });

    if (type == 1) {
        var totalQuantity = paymentdetails.reduce((accum, item) => accum + item.Quantity, 0);
        var totalUnitPrice = paymentdetails.reduce((accum, item) => accum + item.UnitPrice, 0);
        var totalPrice = paymentdetails.reduce((accum, item) => accum + item.TotalMoney, 0);
        console.log(totalPrice);

        $('#PaymentOrderDetail_TotalQuantity').text(new Intl.NumberFormat("en-UK").format(totalQuantity));
        $('#PaymentOrderDetail_TotalUnitPrice').text(new Intl.NumberFormat("en-UK").format(totalUnitPrice));
        $('#PaymentOrderDetail_TotalTotalMoney').text(new Intl.NumberFormat("en-UK").format(totalPrice));
        $('#PaymentOrderDetail_TotalMoneyText').text(ConvertNumberToText(totalPrice));
    } else {
        var moneyPayments = paymentdetails.filter(x => x.ParentID == 2);
        var totalMoneyPaymentII = moneyPayments.reduce((accum, item) => accum + item.TotalMoney, 0);
        var totalMoneyPaymentI = paymentdetails.filter(x => x.Stt == 'I').reduce((accum, item) => accum + item.TotalMoney, 0);

        var totalMoneyPaymentIII1 = totalMoneyPaymentI - totalMoneyPaymentII;
        var totalMoneyPaymentIII2 = totalMoneyPaymentII - totalMoneyPaymentI;

        $('#PaymentOrderDetail_TotalMoney_2').html(new Intl.NumberFormat("en-UK").format(totalMoneyPaymentII));
        $('#PaymentOrderDetail_TotalMoney_31').html(new Intl.NumberFormat("en-UK").format(totalMoneyPaymentIII1 > 0 ? totalMoneyPaymentIII1 : 0));
        $('#PaymentOrderDetail_TotalMoney_32').html(new Intl.NumberFormat("en-UK").format(totalMoneyPaymentIII2 > 0 ? totalMoneyPaymentIII2 : 0));

        $('#PaymentOrderDetail_TotalMoney_3').html(Math.abs(totalMoneyPaymentIII1));
        $('#PaymentOrderDetail_TotalMoneyText').text(ConvertNumberToText(Math.abs(totalMoneyPaymentIII1)));
    }
}

//Sự kiện chuyển số tiền thành chữ
function ConvertNumberToText(number) {
    const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';
    const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
    const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
    const chuHangTram = ('không một' + defaultNumbers).split(' ');
    const dvBlock = '1 nghìn triệu tỷ'.split(' ');

    function convert_block_three(number) {
        if (number == '000') return '';
        var _a = number + ''; //Convert biến 'number' thành kiểu string

        //Kiểm tra độ dài của khối
        switch (_a.length) {
            case 0: return '';
            case 1: return chuHangDonVi[_a];
            case 2: return convert_block_two(_a);
            case 3:
                var chuc_dv = '';
                if (_a.slice(1, 3) != '00') {
                    chuc_dv = convert_block_two(_a.slice(1, 3));
                }
                var tram = chuHangTram[_a[0]] + ' trăm';
                return tram + ' ' + chuc_dv;
        }
    }

    function convert_block_two(number) {
        var dv = chuHangDonVi[number[1]];
        var chuc = chuHangChuc[number[0]];
        var append = '';

        // Nếu chữ số hàng đơn vị là 5
        if (number[0] > 0 && number[1] == 5) {
            dv = 'lăm'
        }

        // Nếu số hàng chục lớn hơn 1
        if (number[0] > 1) {
            append = ' mươi';

            if (number[1] == 1) {
                dv = ' mốt';
            }
        }

        return chuc + '' + append + ' ' + dv;
    }

    var str = parseInt(number) + '';
    var i = 0;
    var arr = [];
    var index = str.length;
    var result = [];
    var rsString = '';

    if (index == 0 || str == 'NaN') {
        return '';
    }

    // Chia chuỗi số thành một mảng từng khối có 3 chữ số
    while (index >= 0) {
        arr.push(str.substring(index, Math.max(index - 3, 0)));
        index -= 3;
    }

    // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
    for (i = arr.length - 1; i >= 0; i--) {
        if (arr[i] != '' && arr[i] != '000') {
            result.push(convert_block_three(arr[i]));

            // Thêm đuôi của mỗi khối
            if (dvBlock[i]) {
                result.push(dvBlock[i]);
            }
        }
    }

    // Join mảng kết quả lại thành chuỗi string
    rsString = result.join(' ');

    // Trả về kết quả kèm xóa những ký tự thừa
    return rsString.replace(/[0-9]/g, '').replace(/ /g, ' ').replace(/ $/, '');
}

//Sụ kiện lưu đề nghị
function SavePaymentOrder() {

    var paymentdetails = [];
    $('#tbl_content_payment > tbody  > tr').each(function (i, el) {

        var quantity = $($(el).find('.PaymentOrderDetail_Quantity')).html();
        quantity = isNaN(parseInt(quantity.replace(/,/g, ''))) ? 0 : parseInt(quantity.replace(/,/g, ''));
        var unitPrice = $($(el).find('.PaymentOrderDetail_UnitPrice')).html();
        unitPrice = isNaN(parseInt(unitPrice.replace(/,/g, ''))) ? 0 : parseInt(unitPrice.replace(/,/g, ''));
        var totalPrice = $($(el).find('.PaymentOrderDetail_TotalMoney')).html();
        totalPrice = isNaN(parseInt(totalPrice.replace(/,/g, ''))) ? 0 : parseInt(totalPrice.replace(/,/g, ''));

        var objDetail = {

            Stt: $($(el).find('.PaymentOrderDetail_Stt')).html(),
            ContentPayment: $($(el).find('.PaymentOrderDetail_ContentPayment')).html(),
            Unit: $($(el).find('.PaymentOrderDetail_Unit')).html(),
            Quantity: quantity,
            UnitPrice: unitPrice,
            TotalMoney: totalPrice,
            Note: $($(el).find('.PaymentOrderDetail_Note')).html(),
            ParentID: parseInt($($(el).find('.PaymentOrderDetail_ParentID')).html()),
        };
        paymentdetails.push(objDetail);
    });


    var dateOrder = $('#PaymentOrder_DateOrder').val();
    var datePayment = parseInt($('#PaymentOrder_TypeOrder').val()) == 1 ? $('#PaymentOrder_DatePayment').val() : null;
    dateOrder = `${dateOrder.slice(6, 10)}-${dateOrder.slice(3, 5)}-${dateOrder.slice(0, 2)}`;
    if (datePayment != null) {
        datePayment = `${datePayment.slice(6, 10)}-${datePayment.slice(3, 5)}-${datePayment.slice(0, 2)}`;
    }

    var totalMoney = $('#PaymentOrderDetail_TotalTotalMoney').html();
    totalMoney = isNaN(parseInt(totalMoney.replace(/,/g, ''))) ? 0 : parseInt(totalMoney.replace(/,/g, ''));
    var paymentOrder = {
        TypeOrder: parseInt($('#PaymentOrder_TypeOrder').val()),
        PaymentOrderTypeID: parseInt($('#PaymentOrder_PaymentOrderTypeID').val()),
        DateOrder: dateOrder,
        ReasonOrder: $('#PaymentOrder_ReasonOrder').val().trim(),
        ReceiverInfo: $('#PaymentOrder_ReceiverInfo').val(),
        DatePayment: datePayment,
        TypePayment: parseInt($('input[name="PaymentOrder_TypePayment"]:checked').val()),
        AccountNumber: $('#PaymentOrder_AccountNumber').val(),
        Bank: $('#PaymentOrder_Bank').val(),
        TotalMoney: totalMoney,
        TotalMoneyText: $('#PaymentOrderDetail_TotalMoneyText').text(),
        Unit: $('#PaymentOrder_Unit').val(),
        PaymentOrderDetails: paymentdetails
    };
    console.log(paymentOrder);

    if (CheckValidatePaymentOrder(paymentOrder)) {
        $.ajax({
            url: '/PaymentOrder/SaveData',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(paymentOrder),
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                if (parseInt(result.status) == 1) {
                    document.getElementById('frm_paymentorder').reset();
                    GetAllPaymentOrder();
                } else {
                    MessageWarning(result.message);
                }
            },

            error: function (err) {
                MessageError(err.responseText);
            }
        });
    }
}

//Check validate
function CheckValidatePaymentOrder(obj) {
    var reusult = true;

    if (obj.TypeOrder <= 0) {
        MessageWarning('Vui lòng nhập Loại đề nghị!');
        reusult = false;
    }

    var details = obj.TypeOrder == 1 ? obj.PaymentOrderDetails : obj.PaymentOrderDetails.filter(x => x.ParentID == 2);
    if (details.length <= 0) {
        MessageWarning('Vui lòng nhập Nội dung thanh toán!');
        reusult = false;
    } else {
        //console.log(obj.PaymentOrderDetails);
        $.each(details, (key, item) => {

            if (item.TotalMoney <= 0) {
                MessageWarning(`Vui lòng nhập Thành tiền!\n(Stt:${item.Stt})`);
                reusult = false;
            }

            if (item.ContentPayment == '') {
                MessageWarning(`Vui lòng nhập Nội dung thanh toán!\n(Stt:${item.Stt})`);
                reusult = false;
            }
        })
    }

    if (obj.TypePayment == 1) {
        if (obj.Bank == '') {
            MessageWarning('Vui lòng nhập Ngân hàng!');
            reusult = false;
        }

        if (obj.AccountNumber == '') {
            MessageWarning('Vui lòng nhập Số tài khoản!');
            reusult = false;
        }
    }


    if (obj.PaymentOrderTypeID <= 0) {
        MessageWarning('Vui lòng nhập Loại nội dung đề nghị!');
        reusult = false;
    }

    if (obj.DateOrder == '') {
        MessageWarning('Vui lòng nhập Ngày đề nghị!');
        reusult = false;
    }

    if (obj.ReasonOrder == '') {
        MessageWarning('Vui lòng nhập Lý do!');
        reusult = false;
    }

    if (obj.ReceiverInfo == '') {
        MessageWarning('Vui lòng nhập Thông tin người nhận tiền!');
        reusult = false;
    }

    if (obj.TypeOrder == 1 && obj.DatePayment == null) {
        MessageWarning('Vui lòng nhập Thời gian thanh quyết toán!');
        reusult = false;
    }

    return reusult;
}

//Sự kiện binding table
function onBindingDatatable() {
    const example = document.getElementById("handsontable");

    var data = [
        { Id: 1, Stt: 'I', ContentPayment: 'SỐ TIỀN ĐÃ TẠM ỨNG', Unit: '', Quantity: 0, UnitPrice: 0, TotalMoney: 0, Note: '' },
        { Id: 2, Stt: 'II', ContentPayment: 'SỐ TIỀN THANH TOÁN', Unit: '', Quantity: 0, UnitPrice: 0, TotalMoney: 0, Note: '' },
        { Id: 3, Stt: '1', ContentPayment: '', Unit: '', Quantity: 0, UnitPrice: 0, TotalMoney: 0, Note: '' },
        { Id: 4, Stt: 'III', ContentPayment: 'CHÊNH LỆNH', Unit: '', Quantity: 0, UnitPrice: 0, TotalMoney: 0, Note: '' },
        { Id: 5, Stt: '1', ContentPayment: 'Tạm ứng chi không hết (I-II)', Unit: '', Quantity: 0, UnitPrice: 0, TotalMoney: 0, Note: '' },
        { Id: 6, Stt: '2', ContentPayment: 'Số chi quá tạm ứng (II-I)', Unit: '', Quantity: 0, UnitPrice: 0, TotalMoney: 0, Note: '' },
    ];
    new Handsontable(example, {
        data,
        width: 'auto',
        height: 'auto',
        colHeaders: [
            "Id",
            "Stt",
            "Nội dung thanh toán",
            "Đvt",
            "Số lượng",
            "Đơn giá",
            "Thành tiền",
            "Ghi chú",
        ],
        columns: [
            { data: 'Id', type: "text" },
            { data: 'Stt', type: "text", className: 'htMiddle' },
            { data: 'ContentPayment', type: "text", className: "htLeft htMiddle" },
            { data: 'Unit', type: "text", className: "htLeft htMiddle" },
            { data: 'Quantity', type: "numeric", allowInvalid: false, className: "htRight htMiddle" },
            { data: 'UnitPrice', type: "numeric", allowInvalid: false, className: "htRight htMiddle" },
            { data: 'TotalMoney', type: "numeric", allowInvalid: false, className: "htRight htMiddle" },
            { data: 'Note', type: "text", className: "htLeft htMiddle" },
        ],
        dropdownMenu: true,
        hiddenColumns: {
            //indicators: false,
            columns: [0]
        },
        contextMenu: true,
        multiColumnSorting: false,
        filters: true,
        rowHeaders: true,
        manualRowMove: true,
        autoWrapRow: true,
        autoWrapCol: true,
        stretchH: 'all',
        licenseKey: "non-commercial-and-evaluation"
    });
}