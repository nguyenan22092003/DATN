var productList = [];
var orderList = [];
async function exportToExcel() {

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');

        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'MaDon', key: 'madon', width: 30 },
            { header: 'TenNV', key: 'tennv', width: 30 },
        ];

        let i = 1;
        orderList.forEach(function (element) {
            worksheet.addRow({ stt: i, madon: element.OrderCode, tennv: element.CustomerName });
            i++;
        });

        // Create a Blob from the workbook
        const blob = await workbook.xlsx.writeBuffer();

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        link.download = 'exported_data.xlsx';

        // Append the link to the body and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);

        console.log('Excel file written');
    
}
const apiUrl = 'https://localhost:44315/admin/product/get-product-sku';
const requestOptions = {
    method: 'GET'
};

fetch(apiUrl, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return productList = response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
function addSanPham() {
    
    var select2Prod = `<option value="0" selected disabled>--Chọn sản phẩm--</option>`;

    if (productList.length > 0) {
        productList.forEach(function (element) {
            select2Prod += ` <option value="${element.ProductID}"  >${element.ProductName}</option>`;
    });
    }
    var html = `
     <tr class="pick-prod" id="tr_${index}">
        <td class="text-center" ><a class="btn btn-sm btn-danger trash-button" onclick="remove(${index})"><i class="bx bx-trash"></i></a></td>
        <td class="text-start">
            <select class="form-control item-prod select-product" id="product_select_${index}" onchange="changeProd(this,${index})">
                ${select2Prod}
            </select>
        </td>
        <td class="text-end ">
             <input type="text" class="form-control item-price"id="product_price_${index}" oninput="formatNumberInput(this)" onchange="onChangePrice(this,${index})"/>
         </td>
        <td class="text-end ">
            <input type="text" class="form-control item-quantity" id="product_quantity_${index}" oninput="formatNumberInputQuantity(this,${index})" onchange="onChangeQuantity(this,${index})"/>
        </td>
        <td class="text-end ">
            <input type="text" class="form-control item-total" readonly style="background-color: #f9f4ee;"  id="product_total_${index}"/>
        </td>
    </tr>`;

    $('#tbody_product').append(html);


    $(`.select-product`).select2({
        dropdownParent: $("#modal_order"),
        theme: "bootstrap-5",
    });

    index++;
}
function GetProduct() {
    $.ajax({
        url: '/admin/order/get-product',
        type: 'Get',
        success: function (result) {
            //  console.log(result);
            if (result.length > 0) {
                productList = result;

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetHDC(orderCode) {
    $.ajax({
        url: '/admin/order/status/1',
        type: 'Get',
        data: {
            param1: parameter1,
            //param2: parameter2
        },
        success: function (result) {
            $("#tbody_order_hc").empty();
            var html = ``;
            var index = 0;

            orderList = result;
            result.forEach(function (element) {
                var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                html += `
                            <tr>
                                <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                                <td class="text-center">${++index}</td>
                                <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                                <td class="text-center">Admin</td>
                                <td class="text-left">${element.CustomerName}</td>
                                <td class="text-center">${element.CustomerPhone}</td>
                                <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                                <td class="text-center">${payment}</td>
                                <td class="text-center">${purchase}</td>
                                <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                                <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                                <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                                <td class="text-left">${element.Note}</td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-info" onclick="Edit(${element.OrderID})"><i class="bx bx-pencil"></i></button>
                                </td>
                            </tr>`;
            });
            $("#tbody_order_hc").append(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetCLH() {
    $.ajax({
        url: '/admin/order/status/2',
        type: 'Get',
        success: function (result) {
            $("#tbody_order_dd").empty();
            var html = ``;

            if (result.length > 0) {
                var index = 0;
                orderList = result;
                result.forEach(function (element) {
                    var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                    var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                    html += `
                            <tr>
                                <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                                <td class="text-center">${++index}</td>
                                <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                                <td class="text-center">Admin</td>
                                <td class="text-left">${element.CustomerName}</td>
                                <td class="text-center">${element.CustomerPhone}</td>
                                <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                                <td class="text-center">${payment}</td>
                                <td class="text-center">${purchase}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                                    <td class="text-left">${element.Note}</td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-info" onclick="Edit(${element.OrderID})"><i class="bx bx-pencil"></i></button>
                                    </td>
                                </tr>`;
                });
            }
            $("#tbody_order_dd").append(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetDGH() {
    $.ajax({
        url: '/admin/order/status/3',
        type: 'Get',
        success: function (result) {
            $("#tbody_order_cgh").empty();
            var html = ``;
            var index = 0;
            orderList = result;
            result.forEach(function (element) {
                var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                html += `
                            <tr>
                                <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                                <td class="text-center">${++index}</td>
                                <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                                <td class="text-center">Admin</td>
                                <td class="text-left">${element.CustomerName}</td>
                                <td class="text-center">${element.CustomerPhone}</td>
                                <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                                <td class="text-center">${payment}</td>
                                <td class="text-center">${purchase}</td>
                                <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                                <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                                <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                                <td class="text-left">${element.Note}</td>
                            </tr>`;
            });
            $("#tbody_order_cgh").append(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetHD() {
    $.ajax({
        url: '/admin/order/status/4',
        type: 'Get',
        success: function (result) {
            $("#tbody_order_hd").empty();
            var html = ``;
            var index = 0;
            orderList = result;

            result.forEach(function (element) {
                var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                html += `
                            <tr>
                                <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                                <td class="text-center">${++index}</td>
                                <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                                <td class="text-center">Admin</td>
                                <td class="text-left">${element.CustomerName}</td>
                                <td class="text-center">${element.CustomerPhone}</td>
                                <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                                <td class="text-center">${payment}</td>
                                <td class="text-center">${purchase}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                                    <td class="text-left">${element.Note}</td>
                                </tr>`;
            });
            $("#tbody_order_hd").append(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetTC() {
    $.ajax({
        url: '/admin/order/status/5',
        type: 'Get',
        success: function (result) {
            $("#tbody_order_gtc").empty();
            var html = ``;
            var index = 0;
            orderList = result;
            result.forEach(function (element) {
                var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                html += `
                            <tr>
                                <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                                <td class="text-center">${++index}</td>
                                <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                                <td class="text-center">Admin</td>
                                <td class="text-left">${element.CustomerName}</td>
                                <td class="text-center">${element.CustomerPhone}</td>
                                <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                                <td class="text-center">${payment}</td>
                                <td class="text-center">${purchase}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                                    <td class="text-left">${element.Note}</td>
                                </tr>`;
            });
            $("#tbody_order_gtc").append(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetTatCa() {
    $.ajax({
        url: '/admin/order/status/5',
        type: 'Get',
        success: function (result) {
            $("#tbody_order_gtc").empty();
            var html = ``;
            var index = 0;
            orderList = result;
            result.forEach(function (element) {
                var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                html += `
                            <tr>
                                <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                                <td class="text-center">${++index}</td>
                                <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                                <td class="text-center">Admin</td>
                                <td class="text-left">${element.CustomerName}</td>
                                <td class="text-center">${element.CustomerPhone}</td>
                                <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                                <td class="text-center">${payment}</td>
                                <td class="text-center">${purchase}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                                    <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                                    <td class="text-left">${element.Note}</td>
                                </tr>`;
            });
            $("#tbody_order_gtc").append(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
$(document).ready(function () {
    GetProduct();
    GetHDC();
    $("#home-tab").on("click", function () {
        GetHDC();
    });
    $("#profile-tab").on("click", function () {
        GetCLH();
    });
    $("#contact-tab").on("click", function () {
        GetDGH();
    });
    $("#home-tab1").on("click", function () {
        GetHD();
    });
    $("#home-tab2").on("click", function () {
        GetTC();
    });
    $("#home-tab3").on("click", function () {
        GetTatCa();
    });
    $("#modal_order").on("hidden.bs.modal", function () {
        $('#tbody_product').empty();
        $('#orderid_order').val(0);
        $('#order_code').val("");
        $('#customer_name').val("");
        $('#customer_address').val("");
        $('#order_note').val("");
        $('#customer_phone').val("");
        $("#payment_method").val("");
    });
});
function confirmOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        var checkedElement = $(this);
        var elementId = checkedElement.data('id');
        ids.push(elementId);

    });

    if (ids.length < 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn Hóa đơn muốn Xác nhận!',
            text: `Thất bại`,
            showConfirmButton: false,
            timer: 1000
        })
    }

    $.ajax({
        url: '/admin/order/confirm',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function cancelOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        var checkedElement = $(this);
        var elementId = checkedElement.data('id');
        ids.push(elementId);
    });

    if (ids.length <= 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn hóa đơn muốn hủy!',
            text: ``,
            showConfirmButton: false,
            timer: 2000
        })
    }

    var dataToSend = JSON.stringify({ orderIDs: ids });
    $.ajax({
        url: '/admin/order/cancel',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function payOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        var checkedElement = $(this); // 'checkedElement' refers to the current checked element in the loop

        // Accessing attributes or performing operations on the checked element
        var elementId = checkedElement.data('id'); // Get the ID of the checked element
        ids.push(elementId);

    });
    var dataToSend = JSON.stringify({ orderIDs: ids });
    $.ajax({
        url: '/admin/order/payorder',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function add() {
    const currentDate = new Date();
    const currentTick = currentDate.getTime();
    var code = "HD_" + currentTick;
    $("#order_code").val(code);
    $('#modal_order').modal('show');
}
function Edit(id) {
    $.ajax({
        url: '/admin/order/' + id,
        type: 'get',
        success: function (result) {
            if (result) {
                $('#orderid_order').val(result.OrderID);
                $('#order_code').val(result.OrderCode);
                $('#customer_name').val(result.CustomerName);
                $('#customer_address').val(result.Address);
                $('#order_note').val(result.Note);
                $('#customer_phone').val(result.CustomerPhone);
                $("#payment_method").val(result.MedthodPayment);

                if (result.prods.length > 0) {
                    result.prods.forEach(function (ele) {
                        addSanPham();
                        var newRow = $('#tbody_product').find('tr').last();
                        $(newRow).find(".item-prod").val(ele.ProductID).trigger('change');
                        console.log(ele);
                        $(newRow).find(".item-quantity").val(ele.Quantity);
                        $(newRow).find(".item-price").val(ele.Price);
                        $(newRow).find(".item-total").val(ele.Quantity * ele.Price);
                    });
                }
            }
            console.log(result);
        },
        error: function (err) {
            console.log(err)
        }
    });
    $('#modal_order').modal('show');
}
function addHDOrder(id) {
    $.ajax({
        url: '/admin/order/' + id,
        type: 'get',
        success: function (result) {
            if (result) {
                
                var date = new Date(result.OrderDate);

                // Format the date to 'dd/MM/yyyy'
                var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                // Initialize invoiceDetails object with basic details
                var invoiceDetails = {
                    date: OrderDate,
                    orderCode: result.OrderCode,
                    customerName: result.CustomerName,
                    customerPhone: result.CustomerPhone,
                    customerAddress: result.Address,
                    products: [],
                    totalPrice: 0,
                    totalPayment: 0
                };

                // Process products if available
                if (result.prods && result.prods.length > 0) {
                    result.prods.forEach(function (ele) {
                        // Push individual product details into products array
                        invoiceDetails.products.push({
                            name: ele.Name + " | " + ele.Skus,
                            quantity: ele.Quantity,
                            price: ele.Price
                        });
                    });

                    // Calculate total price for products
                    invoiceDetails.totalPrice = invoiceDetails.products.reduce(function (accumulator, product) {
                        return accumulator + product.price;
                    }, 0);

                    // Set totalPayment same as totalPrice initially
                    invoiceDetails.totalPayment = invoiceDetails.totalPrice;
                }

                // Populate invoice details in the modal
                populateInvoiceDetails(invoiceDetails);
            }

            console.log(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#showHD').modal('show');
}
function validate() {
    var count = 0;
    var orderCode = $('#order_code').val();
    if (orderCode == '') {
        count++;
    }
   
    return true;
}

function isValidPhoneNumber(phoneNumber) {
    let phonePattern = /(03|05|07|08|09)+([0-9]{8})\b/g;
    return phonePattern.test(phoneNumber);
}

function createOrder() {
    if (!validate()) return;
    var counts = 0;
    var mesErr = $('#error-message');
    var order = {
        OrderID: parseInt($('#orderid_order').val()),
        CustomerName: $('#customer_name').val(),
        Address: $('#customer_address').val(),
        Note: $('#order_note').val(),
        CustomerPhone: $('#customer_phone').val(),
        MedthodPayment: $("#payment_method").val(),
        OrderCode: $("#order_code").val(),
        PurchaseMethod: $("#order_code").val()
    }
    //if (!isValidPhoneNumber(order.CustomerPhone)) {
    //    mesErr.text('Số điện thoại không hợp lệ. Vui lòng nhập lại!');
    //    counts = 0;
    //    counts++;
    //    return;
    //} else {
    //    mesErr.text('');
    //}
    var prods = [];
    //$(".pick-prod").each(function (index) {
    //    prods.push({
    //        ProductID: parseInt($(this).find(".item-prod").val()),
    //        Quantity: parseInt($(this).find(".item-quantity").val().replace(/[^0-9]/g, '')),
    //        Price: parseInt($(this).find(".item-price").val().replace(/[^0-9]/g, ''))
    //    });
    //});
    //order.prods = prods;
    $(".pick-prod").each(function (index) {
        const productID = parseInt($(this).find(".item-prod").val());
        const quantity = parseInt($(this).find(".item-quantity").val().replace(/[^0-9]/g, ''));
        const price = parseInt($(this).find(".item-price").val().replace(/[^0-9]/g, ''));

        
        const existingProduct = prods.find(item => item.ProductID === productID);

        if (existingProduct) {
            Swal.fire({
                icon: 'error',
                title: '',
                text: ``,
                showConfirmButton: false,
                timer: 1000
            })
            return; 
        }

        prods.push({
            ProductID: productID,
            Quantity: quantity,
            Price: price
        });
    });

    order.prods = prods;
    if (counts > 0) {
        $('#error-message').text('');
        return;
    }

    $.ajax({
        url: '/admin/order/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(order),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                })
                $("#modal_order").modal("hide");
                $("#borderedTab").find(".active").click();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(a)
        }
    });
}

function remove(index) {
    $(`#tr_${index}`).remove();
}

var index = 0;


function onChangePrice(input, index) {
    var price = parseInt(input.value.replace(/[^0-9]/g, ''));
    var quantity = parseInt($(`#product_quantity_${index}`).val().replace(/[^0-9]/g, ''))
    $(`#product_total_${index}`).val(formatCurrency.format(price * quantity));
}

function onChangeQuantity(input, index) {
    var quantity = parseInt(input.value.replace(/[^0-9]/g, ''));
    var price = parseInt($(`#product_price_${index}`).val().replace(/[^0-9]/g, ''))
    $(`#product_total_${index}`).val(formatCurrency.format(price * quantity));
}


function removeOrder(id) {
    $.ajax({
        url: '/admin/order/delete/' + id,
        type: 'Post',
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function changeProd(element, index) {
    var id = element.value;
    var check = [];
    $(".pick-prod").each(function (index) {
        const productID = parseInt($(this).find(".item-prod").val());
        const existingProduct = check.includes(productID);
        if (existingProduct) {
            $(element).val(0).trigger('change');
            $(`#product_price_${index}`).val('');
            $(`#product_quantity_${index}`).val('');
            $(`#product_total_${index}`).val('');
            return;
        }
        check.push(productID);
    });

    var product = productList.find(p => p.ProductSkusID == id);
   
    $(`#product_price_${index}`).val(product.Price.toLocaleString('en-US'));
    $(`#product_quantity_${index}`).val(1);
    $(`#product_total_${index}`).val(product.Price.toLocaleString('en-US'));
}
// Function to populate the invoice details
function populateInvoiceDetails(data) {
    document.getElementById('dateExport').textContent = data.date;
    document.getElementById('orderCodeExport').textContent = data.orderCode;
    document.getElementById('customerNameExport').textContent = data.customerName;
    document.getElementById('customerPhoneExport').textContent = data.customerPhone;
    document.getElementById('customerArdessExport').textContent = data.customerAddress;
    var prodTable = document.querySelector('.prodOrderExport');
    prodTable.innerHTML = ''; // Clear existing rows
    data.products.forEach(function (product) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
        `;
        prodTable.appendChild(row);
    });
    document.getElementById('totalPriceExport').textContent = data.totalPrice;
    document.getElementById('totalPayport').textContent = data.totalPayment;
}

function formatNumberInput(input) {
  
    if (isNaN(input.value)) {
        input.value = input.value.replace(/[^0-9]/g, '');
    }
    input.value = parseFloat(input.value).toLocaleString('en-US');
}
function formatNumberInputQuantity(input, index) {
    var id = $(`#product_select_${index}`).val();
    var product = productList.find(p => p.ProductSkusID == id);

    if (isNaN(input.value)) {
        input.value = input.value.replace(/[^0-9]/g, '');
    }
    var value = parseFloat(input.value);
    if (value > product.Quantity) {
        value = product.Quantity;
    }
    input.value = value.toLocaleString('en-US');
}