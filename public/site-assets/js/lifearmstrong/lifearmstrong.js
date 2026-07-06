$(document).ready(function () {
    $(document).on('click', '.remove-image', function () {
        $(this).closest('.image-input-row').remove();
    });

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
    var table = $('#lifearmstrong_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.getLifearmstrongdata,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'title', name: 'title' },
            {
                data: 'image',
                name: 'image',
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

    // delete milestone
    $(document).on('click', '.delete_lifearmstrong', function () {
        let id = $(this).data('id');

        var url = window.APP_URLS.deletelifearmstrong.replace(':id' , id); 
        if (confirm('Are you sure you want to delete this data?')) {
            $.ajax({
                url: url,  // Make sure your route matches this
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': window.APP_URLS.csrfToken
                },
                success: function (response) {
                   if(response.result){
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-success')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
                        }, 3000);
                        table.draw();
                    }else{
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-warning')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
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
function validateAndPreviewImage() {
        const input = document.getElementById("lifearmstrong_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_lifearmstrong_image");
        const previewImg = document.getElementById("preview_lifearmstrong_image");
        const bannerId = document.getElementById("span_lifearmstrong_image_id")?.value;
        // Check if file selected
        if (bannerId && !file) {
            errorSpan.innerText = "";
            return true; // allow update without new image
        }
        if (!file) {
            errorSpan.innerText = "product image image is required.";
            previewImg.style.display = "none";
            return false;
        }
 
        if (!file.type.startsWith("image/")) {
            errorSpan.innerText = "Only image files are allowed.";
            input.value = ""; // reset input
            previewImg.style.display = "none";
            return false;
        }
 
        // Show image preview
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            errorSpan.innerText = "";
        }
        reader.readAsDataURL(file);
        return true;
    }

