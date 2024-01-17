var arrCustomer = [];
var arrLocationCustomer = [];
var arrDeleteOptionValue = [];
var index = 2;
var listProvin = []
var listDistrict = []
var listWard = []
var locationIndex = 0;
$(document).ready(function () {
    GetProvin();
    GetDistrict();
    setTimeout(GetAll(), 3000);
});
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
function GetAll() {
    var keyword = $('#customer_keyword').val();
    $.ajax({
        url: '/admin/potentialcustomer/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCustomer = result;
            console.log(result)
            var html = 'Chua co dia chi';
            $.each(result, function (key, item) {
                var isAcitve = item.isAcitve ? "checked" : ""
                var formattedDate = formatDate(item.createDate);
                var provin = GetAllLocation(item.potentialCustomerID);
                var results_prv_name = '';
                var results_prv = [];
                if (item.locationCustomers.length > 0) {
                    results_prv = listProvin.filter((prv) => prv.ProvinceID == item.locationCustomers[0].provinceID);
                    console.log(results_prv)
                }
                if (results_prv.length > 0) {
                    results_prv_name = results_prv[0].ProvinceName;
                }
                html += `<tr>
                           <td class="text-center">
                                <button class="btn btn-success btn-sm" onclick="edit(${item.potentialCustomerID})">
                                <i class='bx bx-detail'></i>
                                </button>
                               
                            </td>

                            <td>${item.potentialCustomerCode}</td>
                            <td>${item.fullName}</td>
                            <td>${item.email}</td>
                            <td>${item.phone}</td>
                            <td>${formattedDate}</td>
                            
                        </tr>`;
            });
            $('#tbody_customer').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetAllLocation(id) {
    $.ajax({
        url: `/admin/potentialcustomer/getlocation?CustomerID=${id}`,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrLocationCustomer = result;
            $("#locationContainer div").remove();
            $.each(arrLocationCustomer, function (key, item) {
                locationIndex = key;
                var html = `
                 <div class="card border border-end-0 border-bottom-0 border-start-0 border-success mt-2">
                    <div class="row p-1 m-1">
                        <div class="col-md-4 col-12">
                            <span>Tỉnh thành</span><span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_provin"></span>
                            <select class="form-select" id="provin_location_${locationIndex}" aria-label="Default select example" onchange="change(this,${locationIndex})">
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
                            <select class="form-select" id="district_location_${locationIndex}" aria-label="Default select example" onchange="districtChange(this,${locationIndex})">
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
                                <a class="text-danger" style="cursor:pointer;position:absolute;right:5px" onclick="Delete(${item.locationCustomerID}).remove()"><i class="bx bx-trash"></i></a>
                            <span>Phường xã<span class="text-danger">(*)</span></span>
                            <span class="text-danger" id="mess_ward"></span>
                            <select class="form-select" id="ward_location_${locationIndex}" name="ward" aria-label="Default select example">
                                <option selected value="0">Chọn Phường Xã</option>
                            </select >
                        </div>
                        <div class="col-12 mt-2">
                            <div class="form-floating md-3">
                                <input type="text" class="form-control" id="customer_address_location_${locationIndex}" placeholder="Địa chỉ cụ thể" value="${item.address}">
                                <label for="customer_address_location_${locationIndex}">Địa chỉ cụ thể</label>
                            </div>
                        </div>
                    </div>
                 </div>
            `;
                $("#locationContainer").append(html);
                GenarateWardSelected(item.districtID, locationIndex, item.WardID)

            });
        },
        error: function (err) {
            console.log(err)
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
function GenarateDistrict(id_provin, index) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistcistrict',
        type: 'GET',
        dataType: 'json',
        data: {
            idProvin: id_provin
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#district_location_${index} option`).remove();
            $(`#district_location_${index}`).append(new Option("-- Chọn quận/huyện --", 0));
            $.each(result.data, function (key, val) {
                $(`#district_location_${index}`).append(new Option(val.DistrictName, val.DistrictID));
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GenarateWardSelected(id_ward, index, id_selected) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistward',
        type: 'GET',
        dataType: 'json',
        data: {
            idWard: id_ward
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#ward_location_${index} option`).remove();
            $(`#ward_location_${index}`).append(new Option("-- Chọn phường/xã --", 0));
            $.each(result.data, function (key, val) {
                if (val.WardID === id_selected) {
                    $(`#ward_location_${index}`).append(new Option(val.WardName, val.WardCode, false, true));
                }
                else {
                    $(`#ward_location_${index}`).append(new Option(val.WardName, val.WardCode, false, false));
                }
            });
        }
    });
}
function GenarateWard(id_ward, index) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistward',
        type: 'GET',
        dataType: 'json',
        data: {
            idWard: id_ward
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#ward_location_${index} option`).remove();
            $(`#ward_location_${index}`).append(new Option("-- Chọn phường/xã --", 0));
            $.each(result.data, function (key, val) {
                $(`#ward_location_${index}`).append(new Option(val.WardName, val.WardCode));
            });
        }
    });
}
function validate() {
    var count = 0;
    var customerName = $('#customer_name_customer').val();
    var customerEmail = $('#customer_email_customer').val();
    var customerPhone = $('#customer_phone_customer').val();
    var provin = parseInt($(`provin_location_${locationIndex}`).val());
    if (customerName == '' || customerEmail == '' || customerPhone == '' || provin == '') {
        count++;
    }   
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi...',
            text: 'Không được để trống cái trường có dấu (*)',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }
    let phonePattern = /(03|05|07|08|09)+([0-9]{8})\b/g;
    if (!phonePattern.test(customerPhone)) {
        swal("Cảnh báo", "Số điện thoại không hợp lệ!", "warning");
        return false;
    }
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy để kiểm tra địa chỉ email
    if (!regex.test(customerEmail)) {
        swal("Cảnh báo", "Email không hợp lệ!", "warning");
        return false;
    }
    return true;
}

function create() {
    if (!validate()) return;
    var id = parseInt($('#customerid_customer').val());
    var customerName = $('#customer_name_customer').val();
    var customerEmail = $('#customer_email_customer').val();
    var customerPhone = $('#customer_phone_customer').val();
    //var formattedDate = formatDate(item.createDate);
    var isactive = $('#isactive_customer').prop('checked');
    var customer = {
        PotentialCustomerID: id,
        FullName: customerName,
        Email: customerEmail,
        Phone: customerPhone,
        IsActive: isactive
    }
    var arrInsert = [];
    for (var i = 0; i < locationIndex; i++) {
        var provin = parseInt($(`#provin_location_${i}`).val());
        var distric = parseInt($(`#district_location_${i}`).val());
        var ward = parseInt($(`#ward_location_${i}`).val());
        var addss = $(`#customer_address_location_${i}`).val();
        var lon = {
            LocationCustomerID: 0,
            ProvinceID: provin,
            DistrictID: distric,
            WardID: ward,
            address: addss,
            IsDefault: true,
            IsDelete: true
        }
        arrInsert.push(lon);
    }

    var obj = {
        PotentialCustomer: customer,
        LocationCustomers: arrInsert
        //ListDeleteValues: arrDeleteOptionValue
    }
    var dataPost = JSON.stringify(obj)
    $.ajax({
        url: '/admin/potentialcustomer/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                Swal.fire('Thành công !', '', 'success')
                GetAll();
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
    });
}
function add() {
    $('#customerid_customer').val(0);
    //$('#customer_code_customer').val('');
    $('#customer_name_customer').val('');
    $('#customer_email_customer').val('');
    $('#customer_phone_customer').val('');
    //$('#customer_birthday_customer').val('');
    $('#modal_customer').modal('show');
    arrLocationCustomer = [];
    $("#rlocationContainer div").remove();
    $('#locationcustomer_locationname_locationcustomer').val('');

}
function edit(id) {
    var potentialCustomer = arrCustomer.find(p => p.potentialCustomerID == id);
    $('#rcustomerid_customer').val(potentialCustomer.potentialCustomerID);
    $('#rcustomer_code_customer').val(potentialCustomer.potentialCustomerCode);
    $('#rcustomer_name_customer').val(potentialCustomer.fullName);
    $('#rcustomer_email_customer').val(potentialCustomer.email);
    $('#rcustomer_phone_customer').val(potentialCustomer.phone);
    //$('#customer_birthday_customer').val(potentialCustomer.birthday);
    //$('#isactive_customer').prop('checked', potentialCustomer.isAcitve).trigger('change');
    GetAllLocation(id);
    $('#modal_customer_edit').modal('show');
}
function change(el, index) {
    console.log(el);
    //loadTotal();
    var id_provin = parseInt(el.value);
    GenarateDistrict(id_provin, index);
}
function districtChange(el, index) {
    //loadTotal();
    var id_district = parseInt(el.value);
    GenarateWard(id_district, index);
}
function addLocation() {
    var html = `
                 <div class="card border border-end-0 border-bottom-0 border-start-0 border-success mt-2">
                    <div class="row p-1 m-1">
                        <div class="col-md-4 col-12">
                            <span>Tỉnh thành</span><span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_provin"></span>
                            <select class="form-select" id="provin_location_${locationIndex}" aria-label="Default select example" onchange="change(this,${locationIndex})">
                                <option selected value="0">Chọn tỉnh thành</option>`
    listProvin.forEach(el => {
        html += `<option value="${el.ProvinceID}">${el.ProvinceName}</option>`
    })
    html += `</select>
                        </div>
                        <div class="col-md-4 col-12">
                            Quận huyện<span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_district"></span>
                            <select class="form-select" id="district_location_${locationIndex}" aria-label="Default select example" onchange="districtChange(this,${locationIndex})">
                                <option selected value="0">Chọn quận huyện </option>
                            </select>
                        </div>
                        <div class="col-md-4 col-12">
                            <a class="text-danger" style="cursor:pointer;position:absolute;right:5px" onclick="deleteLocation(this)"><i class="bx bx-trash"></i></a>
                            <span>Phường xã<span class="text-danger">(*)</span></span>
                            <span class="text-danger" id="mess_ward"></span>
                            <select class="form-select" id="ward_location_${locationIndex}" name="ward" aria-label="Default select example">
                                <option selected value="0">Chọn Phường Xã</option>
                            </select>
                        </div>
                        <div class="col-12 mt-2">
                            <div class="form-floating md-3">
                                <input type="email" class="form-control" id="customer_address_location_${locationIndex}" placeholder="Địa chỉ cụ thể">
                                <label for="customer_address_location_${locationIndex}">Địa chỉ cụ thể</label>
                            </div>
                        </div>
                    </div>
                 </div>
            `;
    $("#rlocationContainer").append(html);
    locationIndex++; // Tăng index cho việc tạo ID và Name duy nhất
}
function deleteLocation(locationIndex) {
    // Hãy chắc chắn bạn có một xác nhận từ người dùng trước khi xóa địa chỉ.
    Swal.fire({
        title: 'Bạn có chắc muốn xóa địa chỉ này không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Xóa',
    }).then((result) => {
        if (result.isConfirmed) {
            // Thực hiện yêu cầu AJAX để xóa địa chỉ từ cơ sở dữ liệu.
            $.ajax({
                url: '/admin/potentialcustomer/deletelocation',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(locationIndex),
                success: function (result) {
                    if (result.success) {
                        Swal.fire('Địa chỉ đã được xóa !', '', 'success')

                    } else {
                        // Xử lý lỗi nếu cần thiết.
                        console.log(result.message);
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}

function deleteLocation(button) {
    var locationCard = $(button).closest(".card");
    if (locationCard) {
        locationCard.remove();

    }
}

function openmodal() {
    $('#modaladdress').modal('show');
}