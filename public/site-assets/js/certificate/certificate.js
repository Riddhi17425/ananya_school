$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function(){
        $("#certificate_form")[0].reset() 
        $("#preview_certificate_image").hide();
        $(".error").html(''); // Hide the preview image after successful save
        $("#color_value").val('');
    });
    console.log("ready");
    var imagePath = window.APP_URLS.image_path;
    // console.log("Image Path: " + imagePath);
    var table = $('#certificatetable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.certificate_get_data,
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            {
                data: 'image', name: 'image',
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


    $("#Savecertificate").on('click' , function(){
       if(valid_certificate() & valid_certificate_status() & validateAndPreviewImage()){
         var certificateId = $("#certificate_id").val();

            if (certificateId) {
               var url = window.APP_URLS.CertificateUpdate.replace(':id', certificateId);
            } else {
               var url = window.APP_URLS.CertificateStore;
            }
            // var url = window.APP_URLS.CertificateStore;
            var formData = new FormData($("#certificate_form")[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                    $('#certificate_modal').modal('hide');
                    $("#certificate_form")[0].reset()
                    $("#certificate_id").val();
                     $("#message-pop-up").attr('style' , 'display:block')
                     $("#message-pop-up").addClass('alert-success')
                     $("#success-message").html(response.message);
                     $("#preview_certificate_image").hide(); // Hide the preview image after successful save
                     $("#color_value").val(''); // Clear the color value
                     setTimeout(() => {
                         $("#message-pop-up").attr('style' , 'display:none')
                     }, 3000);
                     table.draw();
                   }else{
                        $('#certificate_modal').modal('hide');
                        $("#certificate_form")[0].reset()
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
    
    $(document).on('click' , '.edit_certificate' , function(){
        var certificate_id = $(this).data('id');
        var url = window.APP_URLS.certificate_edit_data.replace(':id' , certificate_id);
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, textStatus, jqXHR) {
                if(response.result){
                    $("input[name='certificate_status']").prop('checked', false);
                    $('#certificate_modal').modal('show');
                    $("#certificate_id").val(response.data.id);
                    $("#certificate_name").val(response.data.name);
                    $("#alt").val(response.data.alt);
                    $("input[name='certificate_status'][value='" + response.data.status + "']").prop('checked', true);
                    // ✅ Show existing banner image if available

                    if (response.data.image) {
                        $("#preview_certificate_image").show(); // full URL or relative path
                        $("#preview_certificate_image")
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

    $(document).on('click' , '.delete_certificate' , function(){
        certificate_id = $(this).data('id');
        var url = window.APP_URLS.certificate_delete_data.replace(':id' , certificate_id);
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
    

    function valid_certificate(){
        if($("#certificate_name").val() == ''){
            $("#span_certificate").text("Enter Name This Filed is Required.")
            return false
        }else{
            $("#span_certificate").text("")
            return true;
        }
    }

   function valid_certificate_status() {
        // alert("11111111")
        if ($("input[name='certificate_status']:checked").length === 0) {
            $("#span_certificate_status").text("Please select a certificate status.");
            return false;
        } else {
            $("#span_certificate_status").text(""); // Clear error message
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
        const input = document.getElementById("certificate_image");
        const file = input.files[0];
        const errorSpan = document.getElementById("span_certificate_image");
        const previewImg = document.getElementById("preview_certificate_image");
        const bannerId = document.getElementById("certificate_id")?.value;
        // Check if file selected
        if (bannerId && !file) {
            errorSpan.innerText = "";
            return true; // allow update without new image
        }
        if (!file) {
            errorSpan.innerText = "certificate image is required.";
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