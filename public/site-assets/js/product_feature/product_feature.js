$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function(){
        $("#product_feature_form")[0].reset();
        $("#preview_product_feature_image").hide(); // Hide the preview image after successful save
        $(".error").html('');
        $("#color_value").val('');
    });
    console.log("ready");
    var imagePath = window.APP_URLS.image_path;
    // console.log("Image Path: " + imagePath);
    var table = $('#productfeaturetable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.product_feature_get_data,
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });


    $("#SaveProductfeature").on('click' , function(){
       if(valid_product_feature() & valid_product_feature_status()){
         var product_featureId = $("#product_feature_id").val();

            if (product_featureId) {
               var url = window.APP_URLS.product_featureUpdate.replace(':id', product_featureId);
            } else {
               var url = window.APP_URLS.product_featureStore;
            }
            // var url = window.APP_URLS.product_featureStore;
            var formData = new FormData($("#product_feature_form")[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                        $('#product_feature_modal').modal('hide');
                        $("#product_feature_form")[0].reset();
                        $("#product_feature_id").val();
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-success')
                        $("#success-message").html(response.message);
                        $("#preview_product_feature_image").hide(); // Hide the preview image after successful save
                        $("#color_value").val(''); // Clear the color value
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
                        }, 3000);
                        table.draw();
                   }else{
                        $('#product_feature_modal').modal('hide');
                        $("#product_feature_form")[0].reset()
                        $("#product_feature_id").val();
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
    
    $(document).on('click' , '.edit_product_feature' , function(){
        var product_feature_id = $(this).data('id');
        var url = window.APP_URLS.product_feature_edit_data.replace(':id' , product_feature_id);
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, textStatus, jqXHR) {
                if(response.result){
                    $("input[name='product_feature_status']").prop('checked', false);
                    $('#product_feature_modal').modal('show');
                    $("#product_feature_id").val(response.data.id);
                    $("#product_feature_name").val(response.data.name);
                    $("input[name='product_feature_status'][value='" + response.data.status + "']").prop('checked', true);
                    // ✅ Show existing banner image if available

                    if (response.data.image) {
                        $("#preview_product_feature_image").show(); // full URL or relative path
                        $("#preview_product_feature_image")
                            .attr('src', response.data.image);
                            
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

    $(document).on('click' , '.delete_product_feature' , function(){
        var product_feature_id = $(this).data('id');
        var url = window.APP_URLS.product_feature_delete_data.replace(':id' , product_feature_id);
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
    

    function valid_product_feature(){
        if($("#product_feature_name").val() == ''){
            $("#span_product_feature").text("Enter Fetaure This Filed is Required.")
            return false
        }else{
            $("#span_product_feature").text("")
            return true;
        }
    }

   function valid_product_feature_status() {
        if ($("input[name='product_feature_status']:checked").length === 0) {
            $("#span_product_feature_status").text("Please select a status.");
            return false;
        } else {
            $("#span_product_feature_status").text(""); // Clear error message
            return true;
        } 
    }
});