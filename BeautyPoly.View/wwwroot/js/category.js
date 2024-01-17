var arrCate = [];
var arrCateToTree = [];

$(document).ready(function () {
    GetAll();
    GetAllToTree();
});
function GetAll() {
    var keyword = $('#category_keyword').val();
    $.ajax({
        url: '/admin/category/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCate = result;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetAllToTree() {
    var keyword = $('#category_keyword').val();
    $.ajax({
        url: '/admin/category-to-tree/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCateToTree = result;
            $('#category-list').tree({
                data: arrCateToTree,
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function createUpdate() {
    var count = 0
    var id = parseInt($('#cate_id_cate').val());
    var parentid = parseInt($('#cate_parent_id_cate').val());
    var name = $('#cate_name_cate').val();
    var code = $('#cate_code_cate').val();

    if (code == '') {
        $('#error-message').text('[Mã danh mục] không được trống. Vui lòng nhập lại !');
        count = 0;
        count++;
        return;
    }

    if (name == '') {
        $('#error-message').text('Tên danh mục] không được trống. Vui lòng nhập lại !');
        count = 0;
        count++;
        return;
    }

    var category = {
        cateId: id,
        parentID: parentid,
        cateName: name,
        cateCode: code,
    }
    if (count > 0) {
        $('#error-message').text('');
        return;
    }
    console.log(category)
    $.ajax({
        url: '/admin/cate/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(category),
        success: function (result) {
            if (result == 1) {
                GetAllToTree();
                GetAll();
                $('#modal_cate').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function addCate() {
    var node = $('#category-list').tree('getSelected');
    if (node) {
        $('#parent_cate').text(node.text);
        $('#cate_parent_id_cate').val(node.id);
    } else {
        $('#parent_cate').text('Không - Danh mục lớn nhất');
        $('#cate_parent_id_cate').val(null);
    }
    $('#cate_id_cate').val(0);
    $('#cate_name_cate').val('');
    $('#cate_code_cate').val('');
    $('#modal_cate').modal('show');
}

function editCate() {
    var node = $('#category-list').tree('getSelected');
    if (node) {
        $('#cate_id_cate').val(node.id);
        var cate = arrCate.find(p => p.cateId == parseInt(node.id));

        $('#cate_parent_id_cate').val(cate.parentID);
        $('#category-edit-parentid').html(
            `<div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button btn-gradient collapsed" type="button" data-bs-toggle="collapse" data-bs-        target="#collapseOne"   aria-expanded="true" aria-controls="collapseOne">
                            <p>Chọn danh mục thuộc: 
                                <input type="checkbox" id="firstNode" onchange="CheckFirstNode()"/>
                                <label>Không - Danh mục lớn nhất</label>
                            </p>                          
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-    parent="#accordionExample">
                        <div class="card">
                            <div class="card-body">
                                <br />
                                <ul id="category-list-edit" class="easyui-tree"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        );
        var cateDependent = arrCate.find(p => p.cateId == cate.parentID);
        if (cateDependent) {
            $('#parent_cate').html(`${cateDependent.cateCode} - ${cateDependent.cateName}`);

        } else {
            $('#parent_cate').text('Không - Danh mục lớn nhất');
        }
        $('#cate_name_cate').val(cate.cateName);
        $('#cate_code_cate').val(cate.cateCode);

        $('#category-list-edit').tree({
            data: arrCateToTree,
            onClick: function (node) {
                if (node) {
                    $('#parent_cate').text(node.text);
                } else {
                    $('#parent_cate').text('Không - Danh mục lớn nhất');
                }
                $('#cate_parent_id_cate').val(node.id);
            },
        });
        if (cateDependent) {
            var nodeToFind = $('#category-list-edit').tree('find', cateDependent.cateId);
            $('#category-list-edit').tree('select', nodeToFind.target);
            $('#cate_parent_id_cate').val(nodeToFind.id);
        } else {
            $('#cate_parent_id_cate').val(null);
        }
        $('#modal_cate').modal('show');
    } else {
        alert('Vui lòng chọn danh mục cần sửa!')
    }
}
function CheckFirstNode() {
    debugger
    var bool = $('#firstNode').prop('checked');
    if (bool) {
        $('#parent_cate').text('Không - Danh mục lớn nhất');
        $('#cate_parent_id_cate').val(null);
    } else {
        var node = $('#category-list-edit').tree('getSelected');
        $('#parent_cate').text(node.text);
        $('#cate_parent_id_cate').val(node.id);
    }
}
function deleteCate() {
    var node = $('#category-list').tree('getSelected');
    if (node) {
        var idArray;
        var specifiedNode = $('#category-list').tree('getNode', node.target);
        if (specifiedNode) {
            var specifiedNodeChildren = $('#category-list').tree('getChildren', specifiedNode.target);
            arrCateToTree = [specifiedNode.id].concat(specifiedNodeChildren.map(function (child) {
                return child.id;
            }));
            idArray = arrCateToTree.map(function (id) {
                return parseInt(id);
            });
        }
        Swal.fire({
            title: 'Thông báo',
            text: 'Bạn có chắc muốn xóa không?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/admin/cate/delete',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(idArray),
                    success: function (result) {
                        if (result == 1) {
                            GetAllToTree();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: `${result}`,
                                showConfirmButton: false,
                                timer: 10000
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        });
    } else {
        alert('Vui lòng chọn danh mục bạn muốn xóa!')
    }
}
