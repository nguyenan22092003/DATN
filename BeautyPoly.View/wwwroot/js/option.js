var arrOption = [];
var arrOptionValue = [];
var arrDeleteOptionValue = [];
$(document).ready(function () {
    GetAll();
    LoadDataOptionValue();
    $('#option_value_name_optionvalue').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            var optionValueName = $('#option_value_name_optionvalue').val();

            // Check if optionValueName already exists
            var existingOption = arrOptionValue.find(p => p.OptionValueName.toUpperCase().trim() === optionValueName.toUpperCase().trim());
            if (existingOption) return;

            var obj = {
                OptionValueID: 0,
                OptionValueName: optionValueName,
                IsPublish: true,
                IsDelete: false
            };
            arrOptionValue.push(obj);
            LoadDataOptionValue();
            $('#option_value_name_optionvalue').val('');
        }
    });
});

function GetAll() {
    var keyword = $('#option_keyword').val();
    $.ajax({
        url: '/admin/option/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrOption = result;
            var html = '';
            $.each(result, function (key, item) {
                var isPublish = item.IsPublish ? "checked" : ""
                var isDelete = item.IsDelete ? "checked" : ""
                var uniqueId = "flexSwitchCheckChecked_" + key;
                html += `<tr>
                           <td class='text-center'>
                                <button class="btn btn-success btn-sm" onclick="edit(${item.OptionID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                                <button class="btn btn-danger btn-sm" onclick="Delete(${item.OptionID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                           </td>

                           <td>${String(item.OptionName).toUpperCase()}</td>
                           <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="${uniqueId}" onchange="updateCheckBox(${item.OptionID},${item.isDelete},${item.OptionName})"  ${isDelete}>
                                </div>
                           </td>
                       </tr>`;
            });
            $('#tbody_option').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function updateCheckBox(optionID, isDelete, optionName) {
    console.log(optionID)

    var option = {
        OptionName: optionName,
    }


    $.ajax({
        url: '/admin/option/updateisdelete',
        type: 'POST',
        dataType: 'json',
        data: { optionID: optionID },
        success: function (result) {
            if (result == 1) {
                GetAll();
                $('#modal_option').modal('hide');
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

function GetAllvalue(id) {
    $.ajax({
        url: '/admin/option/getallvalue',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { optionID : id},
        success: function (result) {
            arrOptionValue = result;
            LoadDataOptionValue();
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function LoadDataOptionValue() {
    var html = '';
    $.each(arrOptionValue, function (key, item) {
        var isPublish = item.IsPublish ? "checked" : "";
        var isDelete = item.IsDelete ? "checked" : "";
        var uniqueId = "flexSwitchCheckChecked_" + key; // Generate a unique id

        html += `<tr>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteOptionValue('${item.OptionValueName}')">
                            <i class="bx bx-trash"></i>
                        </button>
                    </td>
                    <td>${String(item.OptionValueName).toUpperCase()}</td>
                    <td><input class="form-check-input" type="checkbox" onchange="ChangeBoolean('${item.OptionValueName}', this.checked, 1)" ${isPublish}/></td>
                    <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="${uniqueId}"  onchange="ChangeBoolean('${item.OptionValueName}', this.checked, 2)" ${isDelete}>
                        </div>
                    </td>
                </tr>`;
    });
    $('#tbody_optionvalue').html(html);
}

function ChangeBoolean(optionValueName, isCheck, type) {
    var existingOption = arrOptionValue.find(p => p.OptionValueName.toUpperCase().trim() === optionValueName.toUpperCase().trim());
    if (parseInt(type) == 1) {
        existingOption.IsPublish = isCheck;
    } else if (parseInt(type) == 2) {
        existingOption.IsDelete = isCheck;
    }

}

function validate() {
    var count = 0;
    var optionName = $('#option_name_option').val();
    if (optionName == '') {
        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không thể lưu',
            showConfirmButton: false,
            timer:1000
        })
        return false;
    }
    return true;
}

function create() {
    if (!validate()) return;
    var optionName = $('#option_name_option').val();
    var id = parseInt($('#optionid_option').val());
    var ispublish = $('#ispublish_option').prop('checked');
    var option = {
        OptionID: id,
        OptionName: optionName,
        IsPublish: ispublish
    }
  
    var obj = {
        Option: option,
        OptionValues: arrOptionValue,
        ListDeleteValues : arrDeleteOptionValue
    }
    $.ajax({
        url: '/admin/option/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAll();
                arrDeleteOptionValue = [];
                $('#modal_option').modal('hide');
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

//Hiện tại chưa check điều kiện đã có hàng mua đợi sau khi làm xong luông bán hàng sẽ check lại
function deleteOptionValue(name) {
    var indexRemove = arrOptionValue.findIndex(obj => obj.OptionValueName.toUpperCase().trim() === name.toUpperCase().trim());
    if (indexRemove !== -1) {
        var id = arrOptionValue.find(obj => obj.OptionValueName.toUpperCase().trim() === name.toUpperCase().trim()).OptionValueID;
        arrDeleteOptionValue.push(parseInt(id));
        arrOptionValue.splice(indexRemove, 1);
        LoadDataOptionValue();
    }
}

function add() {
    $('#optionid_option').val(0);
    $('#modal_option').modal('show');
    arrOptionValue = [];
    $('#option_value_name_optionvalue').val('');
    $('#option_name_option').val('');
    $('#option_name_option').val('');
    LoadDataOptionValue();
}


function edit(id) {
    $('#optionid_option').val(id);
    var option = arrOption.find(p => p.OptionID == id);
    $('#option_name_option').val(option.OptionName);
    $('#ispublish_option').prop('checked', option.IsPublish).trigger('change');
    GetAllvalue(id);
    $('#modal_option').modal('show');
}
//Hiện tại chưa check điều kiện đã có hàng mua đợi sau khi làm xong luông bán hàng sẽ check lại
function Delete(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
     
    }).then((result) => {
       
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/option/delete',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(id),
                success: function (result) {
                    GetAll();
                },
                error: function (err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `Lỗi không thể xóa!!!`,
                        showConfirmButton: false,
                        timer: 1000
                    })
                    console.log(err);
                }
            });
        } 
    })
}

       