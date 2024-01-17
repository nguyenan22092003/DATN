$(document).ready(function () {
    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);
    GetProductThongKe(startDate, endDate);
});
function formatDateTime(date) {
    var year = date.getFullYear();
    var month = padZero(date.getMonth() + 1); // Tháng là zero-based, nên cộng thêm 1
    var day = padZero(date.getDate());
    var hours = padZero(date.getHours());
    var minutes = padZero(date.getMinutes());
    var seconds = padZero(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function padZero(value) {
    return value < 10 ? '0' + value : value;
}
function GetProductThongKe(dateStart, dateEnd) {
    $.ajax({
        url: '/admin/home/GetProductToDashboard',
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { dateStart: dateStart, dateEnd: dateEnd },
        success: function (result) {
            var html = ``;
            $.each(result, (key, item) => {
                html += ` <tr>
                            <th scope="row"><a href="#"><img src="images/${item.Image}" alt=""></a></th>
                            <td><a href="#" class="text-primary fw-bold">${item.ProductName}</a></td>
                            <td>${formatCurrency.format(item.Price)}</td>
                            <td class="fw-bold">${item.TotalQuantity}</td>
                            <td>${formatCurrency.format(item.TotalMoney)}</td>
                        </tr>`;

            });
            console.log(result);
            $("#tbody_dashboard").html(html);
        },
        error: function (err) {

        }
    });
}

function Today() {
    $("#title_product_dashboard").text("| Today")
    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);
    GetProductThongKe(startDate, endDate);
}

function ThisMonth() {
    $("#title_product_dashboard").text("| This month")

    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);

    GetProductThongKe(startDate, endDate);
}

function ThisYear() {
    $("#title_product_dashboard").text("| This year")

    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);
    GetProductThongKe(startDate, endDate);
}