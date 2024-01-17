$(document).ready(function () {
    GetCart();
});
var arrProductSku = []
function GetCart() {
    $.ajax({
        url: '/Cart/GetProductInCart',
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { customerID: GetUserId() },
        success: function (result) {
            arrProductSku = result;
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

            for (const productName in groupedData) {
                if (groupedData.hasOwnProperty(productName)) {
                    const productList = groupedData[productName];
                    const groupId = generateUniqueId();

                    // Hiển thị tên sản phẩm nhóm
                    html += `<tr class="tbody-item group-title" data-group-id="${groupId}">
                                <td colspan="6" class="product-group-title text-start fw-bolder fs-5" style="background-color:wheat">
                                   Sản phẩm: ${productName}
                                </td>
                            </tr>`;

                    // Hiển thị sản phẩm trong nhóm
                    $.each(productList, function (index, product) {
                        html += `<tr class="tbody-item group-content ${groupId}" >
                                <td class="product-remove">
                                    <a class="remove"  onclick="deleteProductSku(${product.ProductSkusID})">×</a>
                                </td>
                                <td class="product-thumbnail">
                                    <div class="thumb">
                                        <a href="single-product.html">
                                            <img src="/images/${product.Image}" width="68" height="84" style="height: 84px !important;" alt="">
                                        </a>
                                    </div>
                                </td>
                                <td class="product-name">
                                    <a class="title" href="single-product.html">${product.ProductSkuName}</a>
                                </td>
                                <td class="product-price">
                                    <h4 class="price" > ${formatCurrency.format(product.PriceNew)}</h4>
                                </td>
                                <td class="product-quantity">
                                    <div class="pro-qty">
                                        <input type="text" class="quantity" title="Quantity" id="quantity_${product.ProductSkusID}" onchange="ChangeQuantity(${product.ProductSkusID})" value="${product.QuantityCart}">
                                    </div>
                                </td>
                                <td class="product-subtotal">
                                    <span class="price">${formatCurrency.format(product.TotalPrice)}</span>
                                </td>
                            </tr>`;
                        totalMoney += product.TotalPrice;
                    });
                }
            }
            $('#total_amount').text(formatCurrency.format(totalMoney));
            $('#total_amount_cart').text(formatCurrency.format(totalMoney));
            $('#total_value').text(formatCurrency.format(totalMoney));
            $('#tbody_cart').html(html);

            $(document).on('click', '.group-title', function () {
                const groupId = $(this).data('group-id');
                $(`.group-content.${groupId}`).toggle();
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}


function ChangeQuantity(id) {
    var qty = $(`#quantity_${id}`).val();
    if (qty <= 0 || isNaN(qty)) {
        qty = 1;
    }

    $.ajax({
        url: '/cart/change-quantity',
        type: 'GET',
        dataType: "json",
        //contentType: 'application/json;charset=utf-8',
        data: { productSkuID: id, quantity: qty, customerID: GetUserId() },
        success: function (result) {
            GetCart();
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}

function deleteProductSku(id) {
    var sku = arrProductSku.find(p => p.ProductSkusID == id);
    Swal.fire({
        title: `Bạn có chắc muốn xóa sản phẩm [${sku.ProductSkuName}] ra khỏi giỏ hàng?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/cart/delete',
                type: 'DELETE',
                dataType: "json",
                data: { productSkuID: id, customerID: GetUserId() },
                success: function (result) {
                    if (result == 1) {
                        GetCart();
                    }
                },
                error: function () {
                    alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
                }
            });
        }
    });
}