$(document).ready(function () {
    // thats for index datatables 
    var table = $('#product_description_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.getProductDescriptionData,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'product_name', name:"product_name", orderable: false, searchable: false  },
            { data: 'title', name: 'title' },
            //{ data: 'description', name: 'description' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // delete products
    $(document).on('click', '.delete_product_description', function () {
        let id = $(this).data('id');

        var url = window.APP_URLS.deleteProductDescription.replace(':id' , id);
        if (confirm("Are you sure you want to delete this Product's Description?")) {
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