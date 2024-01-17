var arrProduct = [];
var arrOption = [];
var arrOptionValue = [];
var keyword = '';
var listOptionValueID = '';
var cateID = 0;
var minValue = 0;
var maxValue = 1000000;
var range = document.getElementById('slider-range-shop');
$(document).ready(function () {
    function formatCurrency(value) {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    noUiSlider.create(range, {
        start: [0, 1000000],
        step: 50,
        range: {
            'min': [0],
            'max': [1000000]
        },
        connect: true
    });
    range.noUiSlider.on('update', function (values, handle) {
        var min = formatCurrency(parseInt(values[0]));
        var max = `${formatCurrency(parseInt(values[1]))} đ`;
        document.getElementById('filter-min-shop').innerHTML = min;
        document.getElementById('filter-max-shop').innerHTML = max;
        minValue = parseInt(values[0]);
        maxValue = parseInt(values[1]);
        loadProductOfShop();
    });
    $(`#filter-keyword`).on('change', function () {
        keyword = $('#filter-keyword').val();
        loadProductOfShop();
    });    
    GetOption();
    GetCate();
    loadProductOfShop();
    GetProductInCart();
});
function loadProductOfShop() {
    $.ajax({
        url: '/shop/get-product',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: {
            keyword: keyword,
            min: minValue,
            max: maxValue,
            cateID: cateID,
            listOptionValueID: listOptionValueID
        },
        success: function (result) {
            arrProduct = result            
            var html = '';
            $.each(arrProduct, function (key, item) {               
                html += `<div class="col-6 col-lg-4 col-xl-4 mb-4 mb-sm-8">
                <div class="product-item product-st2-item">
                    <div class="product-thumb">
                        <a class="d-block" href="product-details.html">
                        <img src="/images/${item.Image}" width="370" height="450" style="height: 450px !important;" alt="Image-HasTech">

                        </a>
                    </div>
                    <div class="product-info">
                        
                        <h4 class="title"><a href="product-details.html">${item.ProductName}</a></h4>
                        <div class="prices">
                            <span class="price fs-5">${item.PriceText} đ</span>
                        </div>
                        <div class="product-action">
                            <button type="button" class="product-action-btn action-btn-cart" data-bs-toggle="modal" data-bs-target="#action-QuickViewModal" onclick="GetProductDetail(${item.ProductID})">
                                <span>Add to cart</span>
                            </button>
                        </div>
                        <div class="product-action-bottom">
                            <button type="button" class="product-action-btn action-btn-quick-view" data-bs-toggle="modal" data-bs-target="#action-QuickViewModal">
                                <i class="fa fa-expand"></i>
                            </button>
                            <button type="button" class="product-action-btn action-btn-wishlist" data-bs-toggle="modal" data-bs-target="#action-WishlistModal">
                                <i class="fa fa-heart-o"></i>
                            </button>
                            <button type="button" class="product-action-btn action-btn-cart" data-bs-toggle="modal" data-bs-target="#action-CartAddModal">
                                <span>Add to cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`
            });
            $('#load_product').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetCate() {
    $.ajax({
        url: '/shop/get-cate',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            var htmlCate = '';
            $.each(result, function (key, item) {
                htmlCate += `<option value="${item.cateID}">${item.cateName}</option>`;
            });
            $(`#shop-cate`).append(htmlCate);
            $(`#shop-cate`).on('change', function () {
                cateID = $('#shop-cate').val();
                loadProductOfShop();
            });
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
            var htmlOption = '';
            $.each(arrOption, function (key, item) {
                GetOptionValue(item.OptionID);
                htmlOption += `<h4 class="product-widget-title">${item.OptionName}</h4>
                               <div class="product-widget-range-slider">
                                   <select class="form-control" id="option_value_${item.OptionID}" states="[]" multiple>
                                                                                
                                   </select>
                               </div>
                               <br />`;
            });
            $('#shop-option').html(htmlOption);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetOptionValue(optionID) {
    $.ajax({
        url: '/admin/product/get-option-value',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrOptionValue = result;
            arrOptionValue = arrOptionValue.filter(p => p.OptionID === optionID)
            var res = arrOptionValue.map((item) => { return { id: item.OptionValueID, text: item.OptionValueName } })           
            $(`#option_value_${optionID}`).select2({
                data: res,
                placeholder: "--- Tất cả ---",
                allowClear: true,
                theme: "bootstrap-5",
                width: 'resolve'
            });
            $(`#option_value_${optionID}`).on('change', function () {
                listOptionValueID = '';
                $.each(arrOption, function (key, item) {
                    var values = $(`#option_value_${item.OptionID}`).val();
                    if (values && values.length > 0) {
                        listOptionValueID += values + ',';
                    }
                });
                listOptionValueID = listOptionValueID.slice(0, -1);
                loadProductOfShop();
            });            
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetProductDetail(id) {
    var product = arrProduct.find(p => p.ProductID == id);
    $('#product_sku_id').val(0);
    var promises = [];
    $.ajax({
        url: '/Home/GetOptionDetail',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { id: id },
        success: function (result) {
            var html = '';
            var index = 1;
            $.each(result, function (key, item) {
                var optionDetailPromise = $.ajax({
                    url: '/Home/GetOptionValueDetail',
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: { productID: id, optionID: item.OptionID },
                    success: function (result1) {
                        html += `<div class="d-flex" id="option_${index}">
                                    <label class="me-1">${item.OptionName.toUpperCase()}: </label>`;
                        $.each(result1, function (i, o) {
                            html += `<div class="form-check me-1">
                                        <input class="form-check-input" type="radio" name="option_value_${index}" id="gridRadios_${o.OptionValueID}" value="${o.OptionValueID}" onchange="ChangeOption(${id})">
                                        <label class="form-check-label" for="gridRadios_${o.OptionValueID}">
                                            ${o.OptionValueName.toUpperCase()}
                                        </label>
                                    </div>`;
                        });
                        html += `</div>`;
                        index++;
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                promises.push(optionDetailPromise);
            });

            // Wait for all promises to be resolved
            $.when.apply($, promises).then(function () {
                // All AJAX requests have completed
                $("#product_option").html(html);
                $('#product_name_detail_modal').text(product.ProductName);                
                var price = `<h4 class="price">${product.PriceText} đ</h4>`;
                $('#price_product_detail').html(price);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}


function ChangeOption(id) {
    var listid = '';
    $('input[id*="gridRadios_"]').each(function () {
        var index = $(this).attr('id').split('_')[1];
        var checkedValue = $('input[id="gridRadios_' + index + '"]:checked').val();
        if (checkedValue != undefined) {
            listid += String(checkedValue) + ','
        }
    });
    listid = listid.slice(0, -1);

    $.ajax({
        url: '/Home/GetProductSkuByValue',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { listOptionValueID: listid, productID: id },
        success: function (result) {
            var commaCount = (listid.match(/,/g) || []).length + 1;
            if (commaCount == result.CountOption) {
                var discount = result.SaleID !== 0 ? result.SaleType === 0 ? `- ${result.DiscountValue} %` : `- ${result.DiscountValue.toLocaleString('en-US')} đ` : '';
                var price = result.SaleID === 0 ? `<h4 class="price">${formatCurrency.format(result.Price)}</h4>` : `<h4 class="price">${formatCurrency.format(result.PriceNew)}</h4><strike><span class="price-old">${formatCurrency.format(result.Price)}</span></strike> <span class="badge bg-danger">${discount}</span>`;                
                $('#price_product_detail').html(price);
                $('#inventory_productsku').text("Số lượng còn lại: " + result.Quantity);
                $('#product_sku_id').val(result.ProductSkusID);
                $('#product_sku_inventory').val(result.Quantity)
                $('#error_option').text('');
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function addToCart() {
    $('#error_option').text('');
    var skuId = parseInt($('#product_sku_id').val());
    if (skuId == 0) {
        $('#error_option').text('Vui lòng chọn đủ thuộc tính!');
        return;
    }
    var quatityToCart = parseInt($('#quantity_to_cart').val());
    var inventory = parseInt($('#product_sku_inventory').val());
    if (quatityToCart > inventory) {
        $('#quantity_to_cart').val(inventory);
        $('#error_option').text('Số lượng trong kho không đủ!');
        return;
    }

    var obj = {
        ID: skuId,
        Quantity: quatityToCart,
        CustomerID: GetUserId()
    }
    $.ajax({
        url: '/Cart/AddToCart',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                $('#action-QuickViewModal').modal('hide');
                $('#action-CartAddModal').modal('show');
                GetProductInCart();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

}

function GetProductInCart() {
    //$.ajax({
    //    url: '/Cart/GetProductInCart',
    //    type: 'GET',
    //    dataType: 'json',
    //    contentType: 'application/json;charset=utf-8',
    //    success: function (result) {
    //        var html = '';
    //        var totalMoney = 0;
    //        $.each(result, function (key, item) {
    //            html +=`<li class="aside-product-list-item">
    //                    <a href="#/" class="remove">×</a>
    //                    <a href="product-details.html">
    //                        <img src="~/assets/images/shop/cart1.webp" width="68" height="84" alt="Image">
    //                        <span class="product-title">${item.ProductSkuName}</span>
    //                    </a>
    //                    <span class="product-price">${formatCurrency.format(item.Price)}</span>
    //                    <span class="product-quantity">x${item.QuantityCart}</span>
    //                </li>`
    //            totalMoney += item.QuantityCart * item.Price;
    //        })
    //        $('#total_amount').text(formatCurrency.format(totalMoney));
    //      /*  $('#ul_modal_cart').html(html);*/
    //    },
    //    error: function (err) {
    //        console.log(err);
    //    }
    //});
    $.ajax({
        url: '/Cart/GetProductInCart',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            // Tạo đối tượng để lưu trữ dữ liệu đã nhóm
            var groupedData = {};

            $.each(result, function (key, item) {
                const productName = item.ProductName;

                if (!groupedData[productName]) {
                    groupedData[productName] = [];
                }

                groupedData[productName].push(item);
            });

            var html = '';
            var totalMoney = 0;

            // Hiển thị dữ liệu nhóm
            for (const productName in groupedData) {
                if (groupedData.hasOwnProperty(productName)) {
                    const productList = groupedData[productName];

                    // Hiển thị tên sản phẩm
                    html += `<li class="product-group"><h3>${productName}</h3><ul>`;

                    // Hiển thị sản phẩm trong nhóm
                    $.each(productList, function (index, product) {
                        html += `<li class="aside-product-list-item">
                                <a href="#/" class="remove">×</a>
                                <a href="product-details.html">
                                    <img src="~/assets/images/shop/cart1.webp" width="68" height="84" alt="Image">
                                    <span class="product-title">${product.ProductSkuName}</span>
                                </a>
                                <span class="product-price">${formatCurrency.format(product.PriceNew)}</span>
                                <span class="product-quantity">x${product.QuantityCart}</span>
                            </li>`;

                        totalMoney += product.QuantityCart * product.PriceNew;
                    });

                    // Đóng danh sách nhóm
                    html += `</ul></li>`;
                }
            }

            // Thêm tổng tiền
            $('#total_amount').text(formatCurrency.format(totalMoney));

            // Hiển thị kết quả vào phần tử có id là "ul_modal_cart"
            $('#ul_modal_cart').html(html);
        },
        error: function (err) {
            console.log(err);
        }
    });

}