//$(document).ready(function () {
//    setInterval(function () {
//        UpLoadTimeLive();
//    }, 1000);
//});
//function UpLoadTimeLive() {
//    $.ajax({
//        url: '/admin/saleitems/timelive',
//        type: 'POST',
//        dataType: 'json',
//        /*contentType: 'application/json;charset=utf-8',*/
//        success: function (result) {
//            if (result === 1) {

//            } else {
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Oops...',
//                    text: `${result}`,
//                    showConfirmButton: false,
//                    timer: 3000
//                })
//            }
//        },
//        error: function (err) {
//            console.log(err)
//        }
//    });
//}