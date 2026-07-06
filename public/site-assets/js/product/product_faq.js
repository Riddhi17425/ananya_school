$(document).ready(function() {
    function initSummernote(element) {
        element.summernote({
            placeholder: 'Enter FAQ Answer...',
            height: 200,
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['insert', ['link']],
                ['view', ['codeview']]
            ]
        });
    }

    // Initialize first textarea
    initSummernote($('.faq-answer'));

    // Add More FAQ
    $('#addUsps').click(function () {
        let faqHtml = `
        <div class="row faq-item mt-3">
            <div class="col-md-5 mb-3">
                <input type="text" name="question[]" class="form-control" placeholder="Enter FAQ Question">
            </div>

            <div class="col-md-6 mb-3">
                <textarea name="answer[]" class="form-control faq-answer" placeholder="Enter FAQ Answer"></textarea>
            </div>

            <div class="col-md-1 mb-3 d-flex align-items-end">
                <button type="button" class="btn btn-danger removeFaq">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>`;
        $('#faqWrapper').append(faqHtml);

        // Initialize Summernote for newly added textarea
        initSummernote($('#faqWrapper .faq-item:last .faq-answer'));
    });

    // Remove FAQ
    $(document).on('click', '.removeFaq', function () {
        if ($('.faq-item').length > 1) {
            $(this).closest('.faq-item').remove();
        } else {
            alert('At least one FAQ is required.');
        }
    });

    // LIST PAGE
    var table = $('#product_faqs_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.getProductFaqs,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'product_name', name: 'product_name' },
            { data: 'total_faqs', name: 'total_faqs', orderable: false },
            { data: 'action', orderable: false, searchable: false }
        ]
    });

    // DELETE FAQs
    $(document).on('click', '.delete_product_faqs', function () {

        let id = $(this).data('id');
        let url = window.APP_URLS.deleteProductFaqs.replace(':id', id);

        if (confirm('Are you sure you want to delete all FAQs for this product?')) {

            $.ajax({
                url: url,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': window.APP_URLS.csrfToken
                },
                success: function (response) {

                    $("#message-pop-up").show()
                        .removeClass('alert-success alert-warning')
                        .addClass(response.result ? 'alert-success' : 'alert-warning');

                    $("#success-message").html(response.message);

                    setTimeout(() => {
                        $("#message-pop-up").hide();
                    }, 3000);

                    if (response.result) {
                        table.draw();
                    }
                },
                error: function () {
                    alert('Something went wrong!');
                }
            });
        }
    });

});