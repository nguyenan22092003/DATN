var arrPost = [];
$(document).ready(function () {
    loadPostView();
    var urlParams = new URLSearchParams(window.location.search);
    var postId = urlParams.get('postId');
    if (postId) {
        GetDetailPost(postId);
    } else {
        console.error('Missing postId in the URL.');
    }
});
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function GetDetailPost(postId) {
    $.ajax({
        url: '/post/detail-post',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { postId: postId },
        success: function (result) {
            var html = '';
            console.log(result);
            html += `<div class="blog-detail">
                            <h3 class="blog-detail-title">${result.title}</h3>
                            <div class="blog-detail-category" >
                                <a class="category"><i class="fa fa-calendar-o">${result.tags}</i></a>
                            </div>
                            <img class="blog-detail-img mb-7 mb-lg-10" src="${result.img}" width="1170" height="1012" alt="Image">
                            <div class="row justify-content-center">
                                <div class="col-lg-10">
                                    <p class="desc mt-4 mt-lg-7">${result.contents}</p>
                                </div>
                            </div>
                        </div>`;
            $('#tbody_post_view').html(html);
        },
        error: function (err) {
            console.log(err);
        }

    });
}

function loadPostView() {
    $.ajax({
        url: '/Post/GetPost',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            console.log(result);
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
            $('#post_load_sub').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
