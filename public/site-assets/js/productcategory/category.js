$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function(){
        $("#category_form")[0].reset();
        $(".error").html('') 
        $("#preview_category_image").hide(); // Hide the preview image after successful save
        $("#preview_category_small_image").hide();
        $("#color_value").val('');
         if(!$("#category_id").val()){ 
        $('#category_listing_desc').summernote('reset');
        $('#category_detail_description').summernote('reset');
    }
    });
    console.log("ready");

    var table = $('#categorytable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.category_get_data,
        columns: [
            { data: 'id', name: 'id' },  
            { data: 'name', name: 'name' },
            // { data: 'short_desc', name: 'short_desc' },
            // { data: 'description', name: 'description' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    }); 


    $("#SaveCategory").on('click' , function(){
       if(valid_category() & valid_category_status() & validateAndPreviewImage() & validateAndPreviewSmallImage() & valid_color_value() & valid_short_desc() & valid_category_url() & valid_category_description()){
         var categoryId = $("#category_id").val();

            if (categoryId) {
               var url = window.APP_URLS.categoryUpdate.replace(':id', categoryId);
            } else {
               var url = window.APP_URLS.categoryStore;
            }
            // var url = window.APP_URLS.categoryStore;
            var formData = new FormData($("#category_form")[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                        $("#category_form")[0].reset();
                        $("#category_id").val('');
                        $('#category_modal').modal('hide');
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-success')
                        $("#success-message").html(response.message);
                        $("#preview_category_image").hide(); // Hide the preview image after successful save
                         $("#preview_category_small_image").hide();
                        $("#color_value").val(''); // Clear the color value
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
                        }, 3000);
                        table.draw();
                   }else{
                        $("#category_form")[0].reset()
                        $('#category_modal').modal('hide');
                        $("#category_id").val('');
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-warning')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
                        }, 3000);
                   }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.table(jqXHR)
                }
            });
       }else{
           return false
       }
       
    })
    
     $(document).on('click', '.edit_category', function(){
    var category_id = $(this).data('id');
    var url = window.APP_URLS.category_edit_data.replace(':id', category_id);
    $.ajax({
        type: "GET",
        url: url,
        success: function (response, textStatus, jqXHR) {
            if(response.result){
                // Clear all existing FAQ blocks
                $("#faqRepeater").empty();

                // Populate the form fields
                $("input[name='category_status']").prop('checked', false);
                $('#category_modal').modal('show');
                $("#category_id").val(response.data.id);
                $("#category_name").val(response.data.name);
                $("#category_short_desc").val(response.data.short_desc);
                $("#meta_title").val(response.data.meta_title);
                $("#meta_description").val(response.data.meta_description);
                $("#category_url").val(response.data.url);
                $("#category_description").val(response.data.description);
               $("#category_listing_desc").summernote('code', response.data.listing_desc);
                $("#category_detail_description").summernote('code', response.data.detail_description);
                $("input[name='category_status'][value='" + response.data.status + "']").prop('checked', true);

                // Populate FAQ data
                if (response.faqs && response.faqs.length > 0) {
                    response.faqs.forEach(function(faq, index) {
                        var faqBlock = `
                            <div class="faqGroup border rounded p-3 mb-3">
                                <div class="mb-3">
                                    <label class="form-label">Title</label>
                                    <input type="text" name="question[]" class="form-control" value="${faq.question}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea name="answer[]" class="form-control summernote" rows="4">${faq.answer}</textarea>
                                </div>
                                <div class="text-end">
                                    <button type="button" class="btn btn-danger removeFaq">Remove</button>
                                </div>
                            </div>
                        `;
                        $('#faqRepeater').append(faqBlock);

                        // Re-initialize Summernote for the new textareas
                        $('.summernote').summernote({
                            height: 200,
                            placeholder: 'Enter Description here...'
                        });
                    });
                }

                // ✅ Show existing banner image if available
                if (response.data.category_image) {
                    $("#preview_category_image").show();
                    $("#preview_category_image").attr('src', window.APP_URLS.image_path + response.data.category_image);
                }

                if (response.data.category_small_image) {
                    $("#preview_category_small_image").show();
                    $("#preview_category_small_image").attr('src', window.APP_URLS.image_path + response.data.category_small_image);
                }
            } else {
                $("#message-pop-up").attr('style', 'display:block');
                $("#message-pop-up").addClass('alert-warning');
                $("#success-message").html(response.message);
                setTimeout(function() {
                    $("#message-pop-up").attr('style', 'display:none');
                }, 3000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.table(jqXHR);
        }
    });
});

    $(document).on('click' , '.delete_category' , function(){
        var category_id = $(this).data('id');
        var url = window.APP_URLS.category_delete_data.replace(':id' , category_id);
        var confrim_delete = confirm("Are You Sure want To Delete?");
        if(confrim_delete){
            $.ajax({
                type: "Delete",
                url: url,
                headers: {
                    'X-CSRF-TOKEN': window.APP_URLS.csrfToken
                },
                success: function (response, textStatus, jqXHR) {
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
                error: function (jqXHR, textStatus, errorThrown) {
                    console.table(jqXHR)
                }
            });
        }
        
    })
    

    function valid_category(){
        if($("#category_name").val() == ''){
            $("#span_category").text("Enter Category This Filed is Required.")
            return false
        }else{
            $("#span_category").text("")
            return true;
        }
    }

    function valid_short_desc(){
        if($("#category_short_desc").val() == ''){
            $("#span_shortdesc").text("Enter Short Description This Filed is Required.")
            return false
        }else{
            $("#span_shortdesc").text("")
            return true;
        }
    }

    function valid_category_description(){
        if($("#category_description").val() == ''){
            $("#span_desc").text("Enter Description This Filed is Required.")
            return false
        }else{
            $("#span_desc").text("")
            return true;
        }
    }

    function valid_category_url(){
        if($("#category_url").val() == ''){
            $("#span_url").text("Enter Category Url This Filed is Required.")
            return false
        }else{
            $("#span_url").text("")
            return true;
        }
    }

   function valid_category_status() {
        // alert("11111111")
        if ($("input[name='category_status']:checked").length === 0) {
            $("#span_category_status").text("Please select a category status.");
            return false;
        } else {
            $("#span_category_status").text(""); // Clear error message
            return true;
        } 
    }

    function valid_color_value() {
        if ($("#color_value").val() == "") {
            $("#span_color_value").text("Please select a color.");
            return false;
        } else {
            $("#span_color_value").text("");
            return true;
        }
    }
    
    document.getElementById('color_picker').addEventListener('input', function () {
            document.getElementById('color_value').value = this.value;
    });
});
    function validateAndPreviewImage() {
        const input = document.getElementById("category_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_category_image");
        const previewImg = document.getElementById("preview_category_image");
        const bannerId = document.getElementById("category_id")?.value;
        // Check if file selected
        if (bannerId && !file) {
            errorSpan.innerText = "";
            return true; // allow update without new image
        }
        if (!file) {
            errorSpan.innerText = "Category image is required.";
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

    function validateAndPreviewSmallImage() {
        const input = document.getElementById("category_small_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_category_small_image");
        const previewImg = document.getElementById("preview_category_small_image");
        const bannerId = document.getElementById("category_id")?.value;
        // Check if file selected
        if (bannerId && !file) {
            errorSpan.innerText = "";
            return true; // allow update without new image
        }
        if (!file) {
            errorSpan.innerText = "Category image is required.";
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