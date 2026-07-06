$(document).ready(function () {
    $(document).on('click', '.remove-image', function () {
        $(this).closest('.image-input-row').remove();
    });
    console.log("ready from Blogs");
    $(document).on('change', '.image-input', function (e) {
        let input = this;
        let preview = $(this).siblings('.img-preview');
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                preview.attr('src', e.target.result).show();
            }
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.hide();
        } 
    });


    // thats for index datatables
    var imagePath = window.APP_URLS.image_path;
    var table = $('#blogs_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
        url: window.APP_URLS.getBlogsData,
        type: "GET",
        dataSrc: function (json) {
            console.log("Datatables Response:", json); // 👈 Full Laravel JSON here
            return json.data; // DataTables expects array of rows here
        }
    },
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'title', name: 'title' },
            {
                data: 'front_image',
                name: 'front_image',
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (data) {
                        return '<img src="'+ imagePath +  data + '" alt="' + row.image + '" width="60" height="60">';
                    } else {
                        return '<span class="text-muted">No Image</span>';
                    }
                }
            },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // delete blogs
    $(document).on('click', '.delete_blogs', function () {
        let id = $(this).data('id');

        var url = window.APP_URLS.deleteblogs.replace(':id', id);
        if (confirm('Are you sure you want to delete this blogs ?')) {
            $.ajax({
                url: url,  // Make sure your route matches this
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': window.APP_URLS.csrfToken
                },
                success: function (response) {
                    if (response.result) {
                        $("#message-pop-up").attr('style', 'display:block')
                        $("#message-pop-up").addClass('alert-success')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style', 'display:none')
                        }, 3000);
                        table.draw();
                    } else {
                        $("#message-pop-up").attr('style', 'display:block')
                        $("#message-pop-up").addClass('alert-warning')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style', 'display:none')
                        }, 3000);
                    }
                },
                error: function (xhr) {
                    alert('Something went wrong!');
                }
            });
        }
    });
});



// Remove image preview when clicking the × button
$(document).on('click', '.remove-preview', function () {
    $(this).closest('.preview-image').remove();
});
$(document).on('click', '.remove-image', function () {
    $(this).closest('.position-relative').remove();
});
function validateAndPreviewFrontImage() {
    const input = document.getElementById("blogs_front_image");
    const file = input.files[0];
    const previewImg = document.getElementById("preview_front_image");
    const bannerId = document.getElementById("span_blogs_image_id")?.value;
    // Check if file selected
    if (bannerId && !file) {
        return true; // allow update without new image
    }
    if (!file) {
        previewImg.style.display = "none";
        return false;
    }

    if (!file.type.startsWith("image/")) {
        input.value = ""; // reset input
        previewImg.style.display = "none";
        return false;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        
    }
    reader.readAsDataURL(file);
    return true;
}

function validateAndPreviewBannerImage() {
    const input = document.getElementById("blogs_detail_image");
    const file = input.files[0];
    const previewImg = document.getElementById("preview_blogs_image");
    const bannerId = document.getElementById("span_blogs_image_id")?.value;
    // Check if file selected
    if (bannerId && !file) {
        return true; // allow update without new image
    }
    if (!file) {
        previewImg.style.display = "none";
        return false;
    }

    if (!file.type.startsWith("image/")) {
        input.value = ""; // reset input
        previewImg.style.display = "none";
        return false;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        
    }
    reader.readAsDataURL(file);
    return true;
}

function validateAndPreviewCTAImage() {
    const input = document.getElementById("cta_image");
    const file = input.files[0];
    const previewImg = document.getElementById("preview_cta_image");
    const bannerId = document.getElementById("span_blogs_image_id")?.value;
    // Check if file selected
    if (bannerId && !file) {
        return true; // allow update without new image
    }
    if (!file) {
        previewImg.style.display = "none";
        return false;
    }

    if (!file.type.startsWith("image/")) {
        input.value = ""; // reset input
        previewImg.style.display = "none";
        return false;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        
    }
    reader.readAsDataURL(file);
    return true;
}