$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function(){
        $("#gallery_form")[0].reset() 
        $("#preview_gallery_image").hide();
        $(".error").html(''); // Hide the preview image after successful save
        $("#color_value").val('');
    });
    console.log("ready");
    var imagePath = window.APP_URLS.image_path;
    // console.log("Image Path: " + imagePath);
    var table = $('#gallerytable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.gallery_get_data,
        columns: [
            { data: 'id', name: 'id' },
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


    $("#Savegallery").on('click' , function(){
       if(valid_gallery() & valid_gallery_status() & validateAndPreviewImage()){
         var galleryId = $("#gallery_id").val();

            if (galleryId) {
               var url = window.APP_URLS.GalleryUpdate.replace(':id', galleryId);
            } else {
               var url = window.APP_URLS.GalleryStore;
            }
            // var url = window.APP_URLS.GalleryStore;
            var formData = new FormData($("#gallery_form")[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                    $('#gallery_modal').modal('hide');
                    $("#gallery_form")[0].reset()
                    $("#gallery_id").val();
                     $("#message-pop-up").attr('style' , 'display:block')
                     $("#message-pop-up").addClass('alert-success')
                     $("#success-message").html(response.message);
                     $("#preview_gallery_image").hide(); // Hide the preview image after successful save
                     $("#color_value").val(''); // Clear the color value
                     setTimeout(() => {
                         $("#message-pop-up").attr('style' , 'display:none')
                     }, 3000);
                     table.draw();
                   }else{
                        $('#gallery_modal').modal('hide');
                        $("#gallery_form")[0].reset()
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
    
    $(document).on('click' , '.edit_gallery' , function(){
        var gallery_id = $(this).data('id');
        var url = window.APP_URLS.gallery_edit_data.replace(':id' , gallery_id);
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, textStatus, jqXHR) {
                if(response.result){
                    $("input[name='gallery_status']").prop('checked', false);
                    $('#gallery_modal').modal('show');
                    $("#gallery_id").val(response.data.id);
                    $("#gallery_name").val(response.data.name);
                    $("#alt").val(response.data.alt);
                    $("input[name='gallery_status'][value='" + response.data.status + "']").prop('checked', true);
                    // ✅ Show existing banner image if available

                    if (response.data.image) {
                        $("#preview_gallery_image").show(); // full URL or relative path
                        $("#preview_gallery_image")
                            .attr('src', window.APP_URLS.image_path + response.data.image);
                            
                    }
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
    })

    $(document).on('click' , '.delete_gallery' , function(){
        var gallery_id = $(this).data('id');
        var url = window.APP_URLS.gallery_delete_data.replace(':id' , gallery_id);
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
    

    function valid_gallery(){
        if($("#gallery_name").val() == ''){
            $("#span_gallery").text("Enter Name This Filed is Required.")
            return false
        }else{
            $("#span_gallery").text("")
            return true;
        }
    }

   function valid_gallery_status() {
        // alert("11111111")
        if ($("input[name='gallery_status']:checked").length === 0) {
            $("#span_gallery_status").text("Please select a gallery status.");
            return false;
        } else {
            $("#span_gallery_status").text(""); // Clear error message
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
        const input = document.getElementById("gallery_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_gallery_image");
        const previewImg = document.getElementById("preview_gallery_image");
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