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
    var table = $('#event_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.geteventdata,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'type', name: 'type' },
            { data: 'title', name: 'title' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // delete milestone
    $(document).on('click', '.delete_event', function () {
        let id = $(this).data('id');

        var url = window.APP_URLS.deleteevent.replace(':id' , id);
        if (confirm('Are you sure you want to delete this event?')) {
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

$(document).on('click', '.add-size-price', function () {
    const index = $('#size-price-container .size-price-row').length;
    const html = `
        <div class="row mb-2 size-price-row">
            <div class="col-md-4">
                <input type="text" name="size_price[${index}][size]" class="form-control" placeholder="Size" required>
            </div>
            <div class="col-md-3">
                <input type="number" name="size_price[${index}][w_s_price]" class="form-control" placeholder="Whole Sale Price" required>
            </div>
            <div class="col-md-3">
                <input type="number" name="size_price[${index}][m_r_price]" class="form-control" placeholder="Maximum Retail price" required>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger remove-size-price">-</button>
            </div>
        </div>`;
    $('#size-price-container').append(html); 
});

$(document).on('click', '.remove-size-price', function () {
    $(this).closest('.size-price-row').remove();
});
    function validateAndPreviewImage() {
        const input = document.getElementById("event_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_gallery_image");
        const previewImg = document.getElementById("preview_event_image");
        const bannerId = document.getElementById("gallery_id")?.value;
        // Check if file selected
        if (bannerId && !file) {
            errorSpan.innerText = "";
            return true; // allow update without new image
        }
        if (!file) {
            errorSpan.innerText = "gallery image is required.";
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


