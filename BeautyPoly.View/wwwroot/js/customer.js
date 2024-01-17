var arrLocationCustomer = [];
var listProvin = []
var listDistrict = []
var listWard = []
var arrOrder = []
var locationIndex = 0;
var index = 2;
$(document).ready(function () {
    $("#user_name").text(GetUserName());
    $("#user_name_manager").text(GetUserName());
    GetProvin();
    GetDistrict();
    getDetailAccount();
    $("#btn_save_info").click(function () {
        ChangeInfo();
    });
});
function ChangeInfo() {
    var name = $("#full-name").val();
    var sdt = $("#phone-number").val();
    var userId = GetUserId();

    console.log("fullname: ", name, " phone: ", sdt, "user id: ", userId);
    if (name == '') {
        swal("Cảnh báo", "Không được để trống họ và tên", "warning");
        return false;
    }
    if (sdt == '') {
        swal("Cảnh báo", "Không được để trống số điện thoại", "warning");
        return false;
    }

    let phonePattern = /(03|05|07|08|09)+([0-9]{8})\b/g;
    if (!phonePattern.test(sdt)) {
        swal("Có lỗi xảy ra", "Số điện thoại không hợp lệ!", "error");
        return false;
    }

    //var regexname = /^[A-Za-z\s\tđĐàÀáÁảẢãÃạẠăĂằẰắẮẳẲẵẴặẶâÂầẦấẤẩẨẫẪậẬêÊềỀếẾểỂễỄệỆôÔồỒốỐổỔỗỖộỘơƠờỜớỚởỞỡỠợỢưƯừỪứỨửỬữỮựỰỳỲýÝỷỶỹỸỵỴ\s\t]+$/; // Biểu thức chính quy để kiểm tra chỉ chứa chữ cái, khoảng trắng và tab
    //if (!regexname.test(name)) {
    //    swal("Cảnh báo", "Họ và tên không được chứa kí tự đặc biệt", "warning");
    //    return false; // Ngăn form submit nếu không hợp lệ
    //}

    var regexphone = /\d/; // Biểu thức chính quy để kiểm tra có chứa số hay không
    if (regexphone.test(name)) {
        swal("Cảnh báo", "Họ và tên không được có số", "warning");
        return false; // Ngăn form submit nếu không hợp lệ
    }

    $.ajax({
        type: 'POST',
        url: '/account/changeinfo',
        data: {
            fullname: name,
            phone: sdt,

        },
        headers: { Authorization: "Bearer " + localStorage.getItem("Token") },

        success: function (response) {
            if (response == 1) {
                swal("Đổi thành công", "Vui lòng đăng nhập lại", "success");
                setTimeout(function () {
                    logout();
                }, 1500); // 5000 milliseconds = 5 seconds
            }
            else {
                swal("Error !", "Đổi thông tin không thành công", "error");
            }
        },
        error: function (xhr, status, error) {
            // Handle error response from server
            // ...
        }


    });
}
function GetProvin() {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistprovin',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            if (result.code === 200) {
                listProvin = result.data;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetDistrict() {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistcistrict',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            if (result.code === 200) {
                listDistrict = result.data;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetAllLocation() {
    $.ajax({
        url: `/admin/potentialcustomer/locations`,
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { CustomerID: GetUserId() },
        success: function (result) {
            arrLocationCustomer = result;
            $("#list-location tr").remove();
            $("#locationContainer div").remove();
            $.each(arrLocationCustomer, function (key, item) {
                locationIndex = key;
                var html = `
                    <tr>
                        <td><input ${item.isDefault ? 'checked' : ''} type="radio" onclick="setNewDefaultAddres(${item.locationCustomerID})"/></td>    
                        <td>${item.provinceName}</td>    
                        <td>${item.districtName}</td>    
                        <td>${item.wardName}</td>    
                        <td>${item.address}</td>
                        <td>
                            <button class="btn btn-success" onclick="UpdateLocation(${item.locationCustomerID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                            <button class="btn btn-danger" onclick="deleteLocation(${item.locationCustomerID})">
                                    <i class="bx bx-trash"></i>
                            </button>
                        </td>
                    </tr>
                `
                $("#list-location").append(html);
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function addLocation() {
    $("#locationContainer div").remove();
    locationIndex++;
    var html = `
                 <div class="card border border-end-0 border-bottom-0 border-start-0 border-success mt-2">
                    <div class="row p-1 m-1">
                        <div class="col-md-4 col-12">
                            <span>Tỉnh thành</span><span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_provin"></span>
                            <select class="form-select" id="provin_location" aria-label="Default select example" onchange="change(this)">
                                <option selected value="0">Chọn tỉnh thành</option>`
    listProvin.forEach(el => {
        html += `<option value="${el.ProvinceID}">${el.ProvinceName}</option>`
    })
    html += `</select>
                        </div>
                        <div class="col-md-4 col-12">
                            Quận huyện<span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_district"></span>
                            <select class="form-select" id="district_location" aria-label="Default select example" onchange="districtChange(this)">
                                <option selected value="0">Chọn quận huyện </option>
                            </select>
                        </div>
                        <div class="col-md-4 col-12">
                            <span>Phường xã<span class="text-danger">(*)</span></span>
                            <span class="text-danger" id="mess_ward"></span>
                            <select class="form-select" id="ward_location" name="ward" aria-label="Default select example">
                                <option selected value="0">Chọn Phường Xã</option>
                            </select>
                        </div>
                        <div class="col-12 mt-2">
                            <div class="form-floating md-3">
                                <input type="email" class="form-control" id="customer_address_location" placeholder="Địa chỉ cụ thể">
                                <label for="customer_address_location">Địa chỉ cụ thể</label>
                            </div>
                        </div>
                    </div>
                <div class="d-flex justify-content-end">
                    <button  class="btn btn-success" onclick=" closeTab()"><i class='bx bxs-left-arrow-square'></i></button>
                    <button  class="btn btn-success" onclick="createLocation()"><i class='bx bx-save' ></i></button>
                </div>
                 </div>
            `;
    $("#locationContainer").append(html);
    locationIndex++; // Tăng index cho việc tạo ID và Name duy nhất
}
function UpdateLocation(id) {
    console.log("ID: ", id);
    $("#locationContainer div").remove();
    locationIndex++;
    arrLocationCustomer.forEach(item => {
        if (item.locationCustomerID == id) {
            var html = `
                 <div class="card border border-end-0 border-bottom-0 border-start-0 border-success mt-2">
                    <input id="locationCustomerID" value="${id}" hidden />
                    <div class="row p-1 m-1">
                        <div class="col-md-4 col-12">
                            <span>Tỉnh thành</span><span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_provin"></span>
                            <select class="form-select" id="provin_location" aria-label="Default select example" onchange="change(this)">
                                <option value="0">Chọn tỉnh thành</option>`
            listProvin.forEach(el => {
                html += `<option `;
                if (el.ProvinceID === item.provinceID) {
                    html += ` selected `;
                }
                html += ` value = "${el.ProvinceID}" > ${el.ProvinceName}</option >`
            })
            html += `
                    </select>
                        </div>
                        <div class="col-md-4 col-12">
                            Quận huyện<span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_district"></span>
                            <select class="form-select" id="district_location" aria-label="Default select example" onchange="districtChange(this)">
                                <option value="0">Chọn quận huyện </option>`;
            listDistrict.forEach(el => {
                if (el.ProvinceID == item.provinceID) {
                    html += `<option `;
                    if (el.DistrictID == item.districtID) {
                        html += ` selected `;
                    }
                    html += ` value = "${el.DistrictID}" > ${el.DistrictName}</option >`
                }
            });
            html += `
                    </select>
                        </div>
                            <div class="col-md-4 col-12">
                            <span>Phường xã<span class="text-danger">(*)</span></span>
                            <span class="text-danger" id="mess_ward"></span>
                            <select class="form-select" id="ward_location" name="ward" aria-label="Default select example">
                                <option selected value="0">Chọn Phường Xã</option>
                            </select >
                        </div>
                        <div class="col-12 mt-2">
                            <div class="form-floating md-3">
                                <input type="text" class="form-control" id="customer_address_location" placeholder="Địa chỉ cụ thể" value="${item.address}">
                                <label for="customer_address_location">Địa chỉ cụ thể</label>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-success" onclick="GetAllLocation()"><i class='bx bxs-left-arrow-square'></i></button>
                        <button  class="btn btn-success" onclick="updateLocation()"><i class='bx bx-save' ></i></button>

                    </div>
                 </div>
            `;
            $("#locationContainer").append(html);
            GenarateWardSelected(item.districtID, item.WardID)
        }
    });
    locationIndex++; // Tăng index cho việc tạo ID và Name duy nhất
}
function GenarateWardSelected(id_ward, id_selected) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistward',
        type: 'GET',
        dataType: 'json',
        data: {
            idWard: id_ward
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#ward_location option`).remove();
            $(`#ward_location`).append(new Option("-- Chọn phường/xã --", 0));
            $.each(result.data, function (key, val) {
                if (val.WardID === id_selected) {
                    $(`#ward_location`).append(new Option(val.WardName, val.WardCode, false, true));
                }
                else {
                    $(`#ward_location`).append(new Option(val.WardName, val.WardCode, false, false));
                }
            });
        }
    });
}
function change(el) {
    var id_provin = parseInt(el.value);
    GenarateDistrict(id_provin);
}
function GenarateDistrict(id_provin) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistcistrict',
        type: 'GET',
        dataType: 'json',
        data: {
            idProvin: id_provin
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#district_location option`).remove();
            $(`#district_location`).append(new Option("-- Chọn quận/huyện --", 0));
            $.each(result.data, function (key, val) {
                $(`#district_location`).append(new Option(val.DistrictName, val.DistrictID));
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GenarateWard(id_ward) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistward',
        type: 'GET',
        dataType: 'json',
        data: {
            idWard: id_ward
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#ward_location option`).remove();
            $(`#ward_location`).append(new Option("-- Chọn phường/xã --", 0));
            $.each(result.data, function (key, val) {
                $(`#ward_location`).append(new Option(val.WardName, val.WardCode));
            });
        }
    });
}
function districtChange(el) {
    //loadTotal();
    var id_district = parseInt(el.value);
    GenarateWard(id_district);
}
function updateLocation() {
    var locationCustomerID = parseInt($(`#locationCustomerID`).val());
    var provin = parseInt($(`#provin_location`).val());
    var distric = parseInt($(`#district_location`).val());
    var ward = parseInt($(`#ward_location`).val());
    var addss = $(`#customer_address_location`).val();
    var obj = {
        LocationCustomerID: locationCustomerID,
        PotentialCustomerID: GetUserId(),
        ProvinceID: provin,
        DistrictID: distric,
        WardID: ward,
        address: addss,
        IsDefault: true,
        IsDelete: true
    }
    Swal.fire({
        title: 'Bạn có chắc muốn cập nhật thông tin địa chỉ này không?',
        showDenyButton: true,
        confirmButtonText: 'Yes',

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/potentialcustomer/locations',
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                success: function (result) {
                    if (result == 1) {
                        GetAllLocation();
                        Swal.fire('Cập nhật địa chỉ!', 'Cập nhập địa chỉ thành công', 'success')
                        $('#modal_customer').modal('hide');
                    } else {
                        Swal.fire('Cập nhật địa chỉ!', 'Cập nhật địa chỉ không thành công', 'error')
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })
}
function deleteLocation(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa địa chỉ này không?',
        showDenyButton: true,
        confirmButtonText: 'Yes',

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `/admin/potentialcustomer/deletelocation?id_location=${id}`,
                type: 'DELETE',
                success: function (result) {
                    if (result == 1) {
                        GetAllLocation();
                        Swal.fire('Xóa địa chỉ!', 'Xóa địa chỉ thành công', 'success')
                        //swal("Thành công", "Xóa địa chỉ thành công", "warning");
                        $('#modal_customer').modal('hide');

                    } else {
                        Swal.fire('Xóa địa chỉ!', 'Xóa địa chỉ không thành công', 'error')
                        //swal("Có lỗi xảy ra", "Xóa địa chỉ không thành công", "error");
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })
}
function createLocation() {
    var provin = parseInt($(`#provin_location`).val());
    var distric = parseInt($(`#district_location`).val());
    var ward = parseInt($(`#ward_location`).val());
    var addss = $(`#customer_address_location`).val();
    var obj = {
        PotentialCustomerID: GetUserId(),
        ProvinceID: provin,
        DistrictID: distric,
        WardID: ward,
        address: addss,
        IsDefault: true,
        IsDelete: true
    }
    $.ajax({
        url: '/admin/potentialcustomer/locations',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAllLocation();
                Swal.fire('Thêm địa chỉ !', 'Thêm địa chỉ thành công', 'success')
                $('#modal_customer').modal('hide');
            } else {
                Swal.fire('Thêm địa chỉ !', 'Thêm địa chỉ không thành công', 'success')
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function getDetailAccount() {
    $("#full-name").val("");
    $("#phone-number").val("");
    $("#email-address").val("");
    $("#full-name").val(GetUserName());
    $("#phone-number").val(GetUserPhone());
    $("#email-address").val(GetUserEmail());
}
function setNewDefaultAddres(id) {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    $.ajax({
        url: baseUrl + 'admin/potentialcustomer/update-default-location?id=' + id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            if (result == 1) {
                GetAllLocation();
                $('#modal_customer').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
                    showConfirmButton: false,
                    timer: 1000
                })

            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

/// JWT 

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function GetUserName() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var userName = decodedToken['Name'];
    return userName;
}
function GetUserPhone() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var phone = decodedToken['Phone'];
    return phone;
}
function GetUserDateOfBirth() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var dateOfBirth = decodedToken['DateOfBirth'];
    if (dateOfBirth != null && dateOfBirth != "") {
        dateOfBirth = dateOfBirth.split(" ")[0]
    }
    return dateOfBirth;
}
function GetUserEmail() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var email = decodedToken['Email'];
    return email;
}



function openmodalorder(id) {
    $.ajax({
        url: "/Customer/GetOrderDetailCustomer",
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { orderID: id },
        success: function (result) {
            var order = arrOrder.find(p => p.OrderID == id);
            console.log(order)
            $("#customer_name_order_detail").text(GetUserName());
            $("#order_code_order_detail").text(order.OrderCode);
            var html = '';
            $.each(result, (key, item) => {
                html += ` <div class="card shadow-0 border mb-4">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-2">
                                                    <img src="/images/${item.Image}"
                                                         class="img-fluid" alt="Phone">
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p class="text-muted mb-0">${item.ProductName}</p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p class="text-muted mb-0 small">
                                                        ${item.CombinedOptionValues}
                                                    </p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p class="text-muted mb-0 small"> ${item.Price}</p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p class="text-muted mb-0 small">Số lượng: ${item.Quantity}</p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                    <p class="text-muted mb-0 small">${formatCurrency.format(item.TotalMoney)}</p>
                                                </div>
                                            </div>
                                            <hr class="mb-4" style="background-color: #e0e0e0; opacity: 1;">
                                        </div>
                                    </div>`;
            });
            $("#product_order_detail").html(html);
            $("#total_money_order_order_detail").text(formatCurrency.format(order.TotalMoney))
            $("#discount_price_order_customer").text(formatCurrency.format(order.Discount));
            $("#order_date_order_customer").text(getFormattedDateDMY(order.OrderDate));
            $("#ship_price_order_customer").text(getFormattedDateDMY(order.ShipPrice));
            $("#payment_date_order_detail_customer").text(getFormattedDateDMY(order.PaymentDate));
            $("#total_amount_order_customer").text(formatCurrency.format(order.TotalMoney));
            $('#modal-oder-details').modal('show');
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function closeTab() {
    $("#locationContainer div").remove();

}

function GetOrder() {
    $.ajax({
        url: "/Customer/GetOrderCustomer",
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { customerID: GetUserId() },
        success: function (result) {
            arrOrder = result;
            var html = "";
            $.each(result, (key, item) => {

                html += `<tr>
                            <td>${item.OrderCode}</td>
                            <td>${getFormattedDateDMY(item.OrderDate)}</td>
                            <td>${getFormattedDateDMY(item.ShipDate)}</td>
                            <td>${item.StatusName}</td>
                            <td>${item.TotalMoney}</td>
                            <td><a onclick="openmodalorder(${item.OrderID})" class="check-btn sqr-btn ">Xem chi tiết</a>
                            </td>
                        </tr>`
            });
            $("#tbody_order_customer").html(html);
        },
        error: function (err) {
            console.log(err)
        }
    })
}


