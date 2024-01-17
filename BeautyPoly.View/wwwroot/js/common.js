var _URL = "https://localhost:44327/";
//var _URL = "https://192.168.1.2/";

//var _URL = '';

var formatCurrency = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'vnd',
});
function GetUserName() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var userName = decodedToken['Name'];
    return userName;
}

function GetUserId() {
    const token = localStorage.getItem("Token");
    if (token === null) return 0;
    const decodedToken = parseJwt(token);
    var userId = parseInt(decodedToken['Id']);
    return userId;
}
$(document).ready(function () {
    CheckDisabledUserWorkPlan();
    var origin = window.location.origin;
    _URL = origin + '/';

    //console.log(origin + '\n_url: ' + _URL);
    //console.log(window.location.pathname);
})

function CheckDisabledUserWorkPlan() {
    var userid = $('#user_id_layout').val();
    var isadmin = $('#is_admin').val();
    var roleid = $('#role_id').val();

    if (userid == 86 || isadmin == 1 || roleid == 1) {
        $('#userid_inputmodal_workplan').prop("disabled", false);
        $('#userid_inputmodal_workplan').trigger("chosen:updated");
    } else {
        $('#userid_inputmodal_workplan').prop("disabled", true);
        $('#userid_inputmodal_workplan').trigger("chosen:updated");
    }
}

//Hiển thị sweet alert lỗi
function MessageError(text) {
    swal({
        title: "Thông báo",
        icon: 'error',
        text: text,
        button: false,
        //timer: 2000
    });
}

//Hiển thị sweet alert thành công
function MessageSucces(text) {
    swal({
        title: 'Thông báo',
        text: text,
        button: false,
        icon: 'success',
        timer: 1000
    });
}

//Hiển thị sweet alert cảnh báo
function MessageWarning(text, timer) {
    swal({
        title: 'Thông báo',
        text: text,
        button: false,
        icon: 'warning',
        timer: timer
    });
}




//Format date dd/MM/yyyy
function getFormattedDateDMY(date) {
    if (!date) {
        return ''; // return an empty string if the date is null
    }

    date = new Date(date);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
}

//Format date yyyy-MM-dd
function getFormattedDateYMD(date) {

    date = new Date(date);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
}


//$.ajax({
//    //url: ' @Url.Action("GetListDocumnet", "Document")',
//    url: _URL + 'Document/GetListDocumnet',
//    type: 'GET',
//    dataType: 'json',
//    data: {
//        documnetTypeId: $('#document_type_id').val(),
//        filterText: $('#filter_text').val(),
//    },
//    contentType: 'application/json',
//    success: function (result) {
//        console.log(result);
//    },

//    error: function () {
//        MessageError("Error loading data! Please try again.");
//    }
//});