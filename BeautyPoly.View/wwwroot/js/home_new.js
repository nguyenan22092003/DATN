var arrProduct = [];
$(document).ready(function () {
    loadProduct();
});

function loadProduct() {
    $.ajax({
        url: '/Home/GetProduct',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrProduct = result
            var html = '';
            $.each(arrProduct, function (key, item) {
                html += `<div class="col-6 col-lg-4 mb-4 mb-sm-9">
                <div class="product-item product-st2-item">
                    <div class="product-thumb">
                        <a class="d-block" href="/product-detail/${item.ProductID}">
                        <img src="/images/${item.Image}" width="370" height="450" style="height: 450px !important;" alt="">
                        </a>
                    </div>
                    <div class="product-info">
                        <h4 class="title"><a href="/product-detail/${item.ProductID}">${item.ProductName}</a></h4>
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
            $('#product_loadtest').html(html);
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
