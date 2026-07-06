$(document).ready(function () {
    function initEditor(el) {
        el.summernote({
            height: 150,
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['insert', ['link']],
                ['view', ['codeview']]
            ]
        });
    }

    // Init existing editors
    $('.faq-answer').each(function () {
        initEditor($(this));
    });

    // Add new FAQ
    $('#addFaq').click(function () {
        let html = `
        <div class="row faq-item mb-3">
            <input type="hidden" name="faq_id[]" value="">

            <div class="col-md-5">
                <input type="text" name="question[]" class="form-control" required>
            </div>

            <div class="col-md-6">
                <textarea name="answer[]" class="form-control faq-answer" required></textarea>
            </div>

            <div class="col-md-1 d-flex align-items-end">
                <button type="button" class="btn btn-danger removeFaq">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>`;

        $('#faqWrapper').append(html);
        initEditor($('#faqWrapper .faq-answer').last());
    });

    // Remove FAQ
    $(document).on('click', '.removeFaq', function () {
        $(this).closest('.faq-item').remove();
    });

});