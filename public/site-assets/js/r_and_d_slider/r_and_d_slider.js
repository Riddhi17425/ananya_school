$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function(){
        $("#researchdevelopmentslider_form")[0].reset() 
        $("#preview_researchdevelopmentslider_image").hide();
        $(".error").html(''); // Hide the preview image after successful save
        $("#color_value").val('');
    });
    console.log("ready");
    var imagePath = window.APP_URLS.image_path;
    // console.log("Image Path: " + imagePath);
    var table = $('#researchdevelopmentslidertable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.researchdevelopmentslider_get_data,
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


    $("#Saveresearchdevelopmentslider").on('click' , function(){
       if(valid_researchdevelopmentslider() & valid_researchdevelopmentslider_status() & validateAndPreviewImage()){
         var researchdevelopmentsliderId = $("#researchdevelopmentslider_id").val();

            if (researchdevelopmentsliderId) {
               var url = window.APP_URLS.researchdevelopmentsliderUpdate.replace(':id', researchdevelopmentsliderId);
            } else {
               var url = window.APP_URLS.researchdevelopmentsliderStore;
            }
            // var url = window.APP_URLS.researchdevelopmentsliderStore;
            var formData = new FormData($("#researchdevelopmentslider_form")[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                    $('#researchdevelopmentslider_modal').modal('hide');
                    $("#researchdevelopmentslider_form")[0].reset()
                    $("#researchdevelopmentslider_id").val();
                     $("#message-pop-up").attr('style' , 'display:block')
                     $("#message-pop-up").addClass('alert-success')
                     $("#success-message").html(response.message);
                     $("#preview_researchdevelopmentslider_image").hide(); // Hide the preview image after successful save
                     $("#color_value").val(''); // Clear the color value
                     setTimeout(() => {
                         $("#message-pop-up").attr('style' , 'display:none')
                     }, 3000);
                     table.draw();
                   }else{
                        $('#researchdevelopmentslider_modal').modal('hide');
                        $("#researchdevelopmentslider_form")[0].reset()
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
    
    $(document).on('click' , '.edit_researchdevelopmentslider' , function(){
        var researchdevelopmentslider_id = $(this).data('id');
        var url = window.APP_URLS.researchdevelopmentslider_edit_data.replace(':id' , researchdevelopmentslider_id);
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, textStatus, jqXHR) {
                if(response.result){
                    $("input[name='researchdevelopmentslider_status']").prop('checked', false);
                    $('#researchdevelopmentslider_modal').modal('show');
                    $("#researchdevelopmentslider_id").val(response.data.id);
                    $("#researchdevelopmentslider_name").val(response.data.name);
                    $("#alt").val(response.data.alt);
                    $("input[name='researchdevelopmentslider_status'][value='" + response.data.status + "']").prop('checked', true);
                    // ✅ Show existing banner image if available

                    if (response.data.image) {
                        $("#preview_researchdevelopmentslider_image").show(); // full URL or relative path
                        $("#preview_researchdevelopmentslider_image")
                            .attr('src',window.APP_URLS.image_path + response.data.image);
                            
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

    $(document).on('click' , '.delete_researchdevelopmentslider' , function(){
        var researchdevelopmentslider_id = $(this).data('id');
        var url = window.APP_URLS.researchdevelopmentslider_delete_data.replace(':id' , researchdevelopmentslider_id);
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
    

    function valid_researchdevelopmentslider(){
        if($("#researchdevelopmentslider_name").val() == ''){
            $("#span_researchdevelopmentslider").text("Enter Name This Filed is Required.")
            return false
        }else{
            $("#span_researchdevelopmentslider").text("")
            return true;
        }
    }

   function valid_researchdevelopmentslider_status() {
        // alert("11111111")
        if ($("input[name='researchdevelopmentslider_status']:checked").length === 0) {
            $("#span_researchdevelopmentslider_status").text("Please select a researchdevelopmentslider status.");
            return false;
        } else {
            $("#span_researchdevelopmentslider_status").text(""); // Clear error message
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
        const input = document.getElementById("researchdevelopmentslider_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_researchdevelopmentslider_image");
        const previewImg = document.getElementById("preview_researchdevelopmentslider_image");
        const bannerId = document.getElementById("researchdevelopmentslider_id")?.value;
        // Check if file selected
        if (bannerId && !file) {
            errorSpan.innerText = "";
            return true; // allow update without new image
        }
        if (!file) {
            errorSpan.innerText = "research development slider image is required.";
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