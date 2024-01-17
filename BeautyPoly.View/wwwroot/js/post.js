var arrPost = [];
$(document).ready(function () {
    GetAll();
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
function GetAll() {
    var keyword = $('#post_keyword').val();
    $.ajax({
        url: '/admin/post/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrPost = result;
            var html = '';
            $.each(arrPost, function (key, item) {
                var Status = item.status == 1 ? "Đang hoạt động" : "Không hoạt động"
                var NewFeed = item.isNewFeed == 1 ? "Đang hiển thị" : "Không hiển thị"
                var formattedDate = formatDate(item.createDate);
                html += `<tr>
                           <td>
                               <button class="btn btn-success btn-sm" onclick="editPost(${item.postsID})">
                                    <i class="bx bx-pencil"></i>
                               </button>
                                <button class="btn btn-danger btn-sm" onclick="Delete(${item.postsID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td>${item.postsCode}</td>
                            <td>${item.title}</td>
                            <td>${item.shortContents}</td>
                            <td>${item.author}</td>
                            <td>${NewFeed}</td>
                            <td>${formattedDate}</td>
                            <td>${Status}</td>
                        </tr>`;
            });
            $('#tbody_post').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

$(document).ready(function () {
    GetAll();
    $('#uploadBtn').click(function () {
        $('#fileInput').click();
    });

    $('#fileInput').change(function () {
        displayImages(this.files);
    });

})
function displayImages(files) {

    var previewContainer = $('#imagePreviewContainer');
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.onload = function (e) {
            var html = `<div class="col-4 ps-1 pe-1 mb-4 image-container" style="max-height:370px;position: relative;">
                            <a class="btn text-danger" onclick="removeImage(this)" style="cursor:pointer; position: absolute; top: 4px; right: 4px;"><i class="bi bi-trash"></i></a>
                            <img src="${e.target.result}" width="100%" height="100%" />
                        </div>`;
            previewContainer.append(html);
        };
        reader.readAsDataURL(file);
    }
}
function removeImage(button) {
    $(button).closest('.col-4').remove();
    $('#fileInput').val(null);

}

function removeImageOnClose() {
    var image = document.getElementById('imagePreviewContainer');
    image.parentNode.removeChild(image);
}


function createUpdate() {

    var imageSource;

    // Iterate through image containers
    $('.image-container').each(function () {

        imageSource = $(this).find('img').attr('src');
        console.log(imageSource);
    });


    var id = parseInt($('#postid_post').val());
    var postCode = $('#post_code_post').val();
    var postTitle = $('#post_title_post').val();
    var postContent = $('#post_content_post').val();
    var isPublished = $('#post_isPublished_post').is(':checked') ? true : false;
    var tags = $('#post_tags_post').val();
    var img = $('#post_img_post').val(imageSource);
    var shortContents = $('#post_shortContents_post').val();
    var author = $('#post_author_post').val();
    var alias = $('#post_alias_post').val();
    var isHot = $('#post_isHot_post').is(':checked') ? true : false;
    var isNewFeed = $('#post_isNewFeed_post').is(':checked') ? true : false;
    var status = $('#post_status_post').is(':checked') ? 1 : 0;

    debugger;
    var post = {
        PostsID: id,
        PostsCode: postCode,
        Title: postTitle,
        Contents: postContent,
        Img: imageSource,
        IsPublished: isPublished,
        Tags: tags,
        ShortContents: shortContents,
        Author: author,
        Alias: alias,
        IsHot: isHot,
        IsNewFeed: isNewFeed,
        Status: status,
        IsDelete: false
    }
    var obj = {
        Post: post
    }

    $.ajax({
        url: '/admin/post/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                Swal.fire('Success', '', 'success')
                GetAll();
                $('#modal_post').modal('hide');
            }
            else {
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
    $('#postid_post').val(0);
    $('#post_code_post').val('');
    $('#post_title_post').val('');
    $('#post_content_post').val('');
    $('#post_isPublished_post').val(1);
    $('#post_tags_post').val('');
    $('#post_img_post').val('');
    $('#post_shortContents_post').val('');
    $('#post_author_post').val('');
    $('#post_alias_post').val('');
    $('#post_isHot_post').val(1);
    $('#post_isNewFeed_post').val(1);
    $('#post_status_post').val(1);
    $('#imagePreviewContainer').empty();
    $('#modal_post').modal('show');
}
function editPost(id) {
    $('#imagePreviewContainer').empty();
    $('#postid_post').val(id);

    var post = arrPost.find(p => p.postsID == parseInt(id));

    var imgElement = $('<img>').attr('src', post.img).addClass('col-4 ps-1 pe-1 mb-4').css({
        'max-height': '370px',
        'position': 'relative'
    });

    $('#imagePreviewContainer').empty().append(imgElement);


    var formattedDate = formatDate(post.createDate);
    $('#post_code_post').val(post.postsCode);
    $('#post_title_post').val(post.title);
    $('#post_content_post').val(post.contents);
    $('#post_tags_post').val(post.tags);
    $('#post_img_post').val(post.img);
    $('#post_shortContents_post').val(post.shortContents);
    $('#post_author_post').val(post.author);
    $('#post_alias_post').val(post.alias);
    $('#post_isHot_post').prop('checked', post.isHot);
    $('#post_status_post').prop('checked', post.status);
    $('#post_isNewFeed_post').prop('checked', post.isNewFeed);
    $('#post_isPublished_post').prop('checked', post.isPublished);
    $('#post_createdate_post').val(formattedDate);
    $('#modal_post').modal('show');
    debugger;
}
//Hiện tại chưa check điều kiện đã có hàng mua đợi sau khi làm xong luông bán hàng sẽ check lại
function Delete(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa bài viết này không?',
        showDenyButton: true,
        confirmButtonText: 'Yes',

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/post/delete',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(id),
                success: function (result) {
                    Swal.fire('Delete!', '', 'success')
                    GetAll();
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })


}