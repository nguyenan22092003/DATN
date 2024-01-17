var arrProduct = [];
$(document).ready(function () {
    
    GetProductInCart();
});


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
    console.log(obj);
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
        //contentType: 'application/json;charset=utf-8',
        data: { customerID: GetUserId()},
        success: function (result) {
            // Tạo đối tượng để lưu trữ dữ liệu đã nhóm
            var groupedData = {};
            console.log(result);
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
                                    <img src="/images/${product.Image}" width="68" height="84" style="height: 84px !important;" alt="">
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

function loadPost() {
    $.ajax({
        url: '/Home/GetPost',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrPost = result
            var html = '';
            $.each(arrPost, function (key, item) {
                var formattedDate = formatDate(item.CreateDate);
                html += `<div class="col-sm-6 col-lg-4 mb-8">
                <div class="post-item">
                         <a href="blog-details?postId=${item.PostsID}" class="thumb">
                        <img src="${item.Img}" width="370" height="320" style="height: 320px !important;" alt="Image-HasTech">

                        </a>
                        <div class="content">
                            <a class="post-category" href="">${item.Tags}</a>
                            <h4 class="title"><a href="post-details.html">${item.Title}</a></h4>
                            <ul class="meta">
                                <li class="author-info"><span>By:</span> <a href="blog.html">${item.Author}</a></li>
                                <li class="post-date">${formattedDate}</li>
                            </ul>
                        </div>
                </div>
            </div>`
            });
            $('#post_loadtest').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
