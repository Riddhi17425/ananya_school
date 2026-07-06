$(document).ready(function () {
     $(".modal").on("hidden.bs.modal", function(){
        $("#industries_form")[0].reset();
        $(".error").html('');
    });
    console.log("ready from industries");

    var table = $('#industriestable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.industries_get_data,
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });


    $("#Saveindustries").on('click' , function(){
       if(valid_industries() & valid_industries_status()){
            var url = window.APP_URLS.industriesStore ;
            $.ajax({
                type: "POST",
                url: url,
                data: $("#industries_form").serialize(),
                success: function (response, textStatus, jqXHR) {
                    $("#message-pop-up").removeClass('alert-success alert-warning')
                   if(response.result){
                        $('#industries_modal').modal('hide');
                        $("#industries_form")[0].reset()
                        $("#industries_form").val();
                        $("#message-pop-up").attr('style' , 'display:block')
                        $("#message-pop-up").addClass('alert-success')
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none')
                        }, 3000);
                        table.draw();
                   }else{
                        $('#industries_modal').modal('hide');
                        $("#industries_form")[0].reset()
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
    
    $(document).on('click' , '.edit_industries' , function(){
        var industries_id = $(this).data('id');
        var url = window.APP_URLS.industries_edit_data.replace(':id' , industries_id);
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, textStatus, jqXHR) {
                if(response.result){
                    $("input[name='industries_status']").prop('checked', false);
                    $('#industries_modal').modal('show');
                    $("#industries_id").val(response.data.id);
                    $("#industries_name").val(response.data.name);
                    $("input[name='industries_status'][value='" + response.data.status + "']").prop('checked', true);
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

    $(document).on('click' , '.delete_industries' , function(){
        var industries_id = $(this).data('id');
        var url = window.APP_URLS.industries_delete_data.replace(':id' , industries_id);
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
    

    function valid_industries(){
        if($("#industries_name").val() == ''){
            $("#span_industries").text("Enter industries This Filed is Required.")
            return false
        }else{
            $("#span_industries").text("")
            return true;
        }
    }

   function valid_industries_status() {
        // alert("11111111")
        if ($("input[name='industries_status']:checked").length === 0) {
            $("#span_industries_status").text("Please select a Industries status.");
            return false;
        } else {
            $("#span_industries_status").text(""); // Clear error message
            return true;
        }
    }
});