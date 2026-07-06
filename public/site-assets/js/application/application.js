$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function(){
        $("#application_form")[0].reset();
        $("#preview_application_image").hide(); // Hide the preview image after successful save
        $(".error").html('');
        $("#color_value").val('');
    });
    console.log("ready");

    var table = $('#applicationtable').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.application_get_data, // ✅ changed
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    }); 

    $("#Saveapplication").on('click', function(){ 
        if(valid_application() & valid_application_status() & validateAndPreviewImage()){
            var application_id = $("#application_id").val();

            if (application_id) {
                var url = window.APP_URLS.applicationUpdate.replace(':id', application_id);
            } else {
                var url = window.APP_URLS.applicationStore;
            }

            var formData = new FormData($("#application_form")[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    $("#message-pop-up").removeClass('alert-success alert-warning');
                    if(response.result){
                        window.location.href = window.APP_URLS.index;
                        $("#application_form")[0].reset();
                        $("#message-pop-up").attr('style' , 'display:block')
                            .addClass('alert-success');
                        $("#success-message").html(response.message);
                        $("#preview_application_image").hide(); // ✅ changed
                        $("#color_value").val('');
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none');
                        }, 3000);
                        table.draw();
                    } else {
                        $("#application_form")[0].reset();
                        $("#message-pop-up").attr('style' , 'display:block')
                            .addClass('alert-warning');
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none');
                        }, 3000);
                    }
                },
                error: function (jqXHR) {
                    console.table(jqXHR);
                }
            });
        } else {
            return false;
        }
    });

    $(document).on('click', '.delete_application', function(){ // ✅ changed class
        var application_id = $(this).data('id');
        var url = window.APP_URLS.application_delete_data.replace(':id', application_id);
        var confirm_delete = confirm("Are you sure you want to delete?");
        if(confirm_delete){
            $.ajax({
                type: "DELETE",
                url: url,
                headers: {
                    'X-CSRF-TOKEN': window.APP_URLS.csrfToken
                },
                success: function (response) {
                    if(response.result){
                        $("#message-pop-up").attr('style' , 'display:block')
                            .addClass('alert-success');
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none');
                        }, 3000);
                        table.draw();
                    } else {
                        $("#message-pop-up").attr('style' , 'display:block')
                            .addClass('alert-warning');
                        $("#success-message").html(response.message);
                        setTimeout(() => {
                            $("#message-pop-up").attr('style' , 'display:none');
                        }, 3000);
                    }
                },
                error: function (jqXHR) {
                    console.table(jqXHR);
                }
            });
        }
    });

    function valid_application(){
        if($("#application_name").val() == ''){
            $("#span_application").text("Enter Application Name. This field is required.");
            return false;
        } else {
            $("#span_application").text("");
            return true;
        }
    }

    function valid_application_status() {
        if ($("input[name='application_status']:checked").length === 0) {
            $("#span_application_status").text("Please select an application status.");
            return false;
        } else {
            $("#span_application_status").text("");
            return true;
        } 
    }
});

function validateAndPreviewImage() {
    const input = document.getElementById("application_image"); // ✅ changed
    const file = input.files[0];
    const errorSpan = document.getElementById("span_application_image"); // ✅ changed
    const previewImg = document.getElementById("preview_application_image"); // ✅ changed
    const appId = document.getElementById("application_id")?.value;

    if (appId && !file) {
        errorSpan.innerText = "";
        return true;
    }
    if (!file) {
        errorSpan.innerText = "Application image is required.";
        previewImg.style.display = "none";
        return false;
    }

    if (!file.type.startsWith("image/")) {
        errorSpan.innerText = "Only image files are allowed.";
        input.value = "";
        previewImg.style.display = "none";
        return false;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        errorSpan.innerText = "";
    }
    reader.readAsDataURL(file);
    return true;
}

let faqIndex = $("#faq_container .faq-item").length;

$("#add_faq").click(function () {

    let index = faqIndex;

    let html = `
    <div class="faq-item border p-3 mb-2">
        <div class="d-flex justify-content-between">
            <h6>FAQ</h6>
            <button type="button" class="btn btn-danger remove_faq">X</button>
        </div>

        <input type="text" name="faq[${index}][title]" class="form-control mb-2" placeholder="Question">

        <textarea id="faq_desc_${index}" name="faq[${index}][description]" class="form-control"></textarea>
    </div>
    `;

    $("#faq_container").append(html);

    // 🔥 IMPORTANT FIX: delay init
    setTimeout(() => {
        initSummernote(`#faq_desc_${index}`);
    }, 50);

    faqIndex++;
});

$(document).on("click", ".remove_faq", function () {
    $(this).closest(".faq-item").remove();
});

function initSummernote(selector) {
    $(selector).summernote({
        height: 120
    });
}

$(document).ready(function () {

    initSummernote('.summernote');

    // 🔥 FIX: initialize existing FAQ editors properly
    $("#faq_container textarea").each(function () {
        let id = $(this).attr('id');

        if (id) {
            setTimeout(() => {
                initSummernote('#' + id);
            }, 100);
        }
    });

    // default FAQ if empty
    if ($("#faq_container .faq-item").length === 0) {
        $("#add_faq").trigger('click');
    }
});



$("#website_top_image").change(function () {
    previewImage(this, "#preview_top_image");
});

$("#website_bottom_image").change(function () {
    previewImage(this, "#preview_bottom_image");
});

function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        $(previewId).attr('src', e.target.result).show();
    };
    reader.readAsDataURL(file);
}