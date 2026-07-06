$(document).ready(function () {
     $(".modal").on("hidden.bs.modal", function(){
        $("#gallerytypes_form")[0].reset();
        $(".error").html('');
    });
    console.log("ready from gallery types");

    var table = $('#gallerytypestable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.gallerytypes_get_data,
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });


    $("#Savegallerytypes").on('click' , function(){
       if(valid_gallerytypes() & valid_gallerytypes_status()){
            var url = window.APP_URLS.gallerytypesStore ;
            $.ajax({
                type: "POST",
                url: url,
                data: $("#gallerytypes_form").serialize(),
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                        $('#gallerytypes_modal').modal('hide');
                        $("#gallerytypes_form")[0].reset()
                        $("#gallerytypes_form").val();
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-success')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
                        }, 3000);
                        table.draw();
                   }else{
                        $('#gallerytypes_modal').modal('hide');
                        $("#gallerytypes_form")[0].reset()
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
    
    $(document).on('click' , '.edit_gallery_types' , function(){
        var gallerytypes_id = $(this).data('id');
        var url = window.APP_URLS.gallerytypes_edit_data.replace(':id' , gallerytypes_id);
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, textStatus, jqXHR) {
                if(response.result){
                    $("input[name='gallerytypes_status']").prop('checked', false);
                    $('#gallerytypes_modal').modal('show');
                    $("#gallerytypes_id").val(response.data.id);
                    $("#gallerytypes_name").val(response.data.name);
                    $("input[name='gallerytypes_status'][value='" + response.data.status + "']").prop('checked', true);
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

    $(document).on('click' , '.delete_gallery_types' , function(){
        var gallerytypes_id = $(this).data('id');
        var url = window.APP_URLS.gallerytypes_delete_data.replace(':id' , gallerytypes_id);
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
    

    function valid_gallerytypes(){
        if($("#gallerytypes_name").val() == ''){
            $("#span_gallerytypes").text("Enter gallery types This Filed is Required.")
            return false
        }else{
            $("#span_gallerytypes").text("")
            return true;
        }
    }

   function valid_gallerytypes_status() {
        // alert("11111111")
        if ($("input[name='gallerytypes_status']:checked").length === 0) {
            $("#span_gallerytypes_status").text("Please select a gallery types status.");
            return false;
        } else {
            $("#span_gallerytypes_status").text(""); // Clear error message
            return true;
        }
    }
});