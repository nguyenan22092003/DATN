$(document).ready(function () {
    GetProductDetail(productId);

});
function GetProductDetail(id) {
    /*$('#product_sku_id').val(0);*/
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
            $.when.apply($, promises).then(function () {
                $("#product_option").html(html);

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
        data: { listOptionValueID: listid, productID: productId },
        success: function (result) {
            var commaCount = (listid.match(/,/g) || []).length + 1;
            var price = result.SaleID === 0 ? `<h4 class="price">${formatCurrency.format(result.Price)} đ</h4>` : `<h4 class="price">${formatCurrency.format(result.PriceNew)}</h4>
                                                                                                <span class="price-old"><strike>${formatCurrency.format(result.Price)}</strike></span>`;
            if (commaCount == result.CountOption) {
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


