$(document).ready(function () {
    console.log("ready");

    var table = $('#apk-product-inquiry').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: window.APP_URLS.apk_product_inquiry_data,
            data: function (d) {
                d.inquiry_type = $('#inquiryFilter').val();
            }
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'purpose_of_inquiry', name: 'purpose_of_inquiry' },
            { data: 'full_name', name: 'full_name' },
            { data: 'mobile_number', name: 'mobile_number' },
            { data: 'email', name: 'email' },
            { data: 'company_name', name: 'company_name' },
            // { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    $('#inquiryFilter').on('change', function () {
        table.ajax.reload();
    });
});
