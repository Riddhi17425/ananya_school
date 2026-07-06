$(document).ready(function () {
    // Add new image input
    $(document).on('click', '.add-image', function () {
        let newRow = `
            <div class="form-group image-input-row d-flex align-items-center mb-2">
                <input type="file" name="product_images[]" class="form-control image-input">
                <img class="img-preview ms-2" style="width:80px; height:80px; object-fit:cover; display:none;">
                <button type="button" class="btn btn-danger btn-sm ms-2 remove-image"><i class="bi bi-x"></i> X</button>
            </div>
        `;
        $('#image-container').append(newRow);
    });

    
    $(document).on('click', '.remove-image', function () {
        $(this).closest('.image-input-row').remove();
    });
 
    $(document).on('change', '.image-input', function (e) {
        let input = this;
        let preview = $(this).siblings('.img-preview');
        if (input.files && input.files[0]) {
            let reader = new FileReader(); 
            reader.onload = function (e) {
                preview.attr('src', e.target.result).show();
            }
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.hide();
        }
    });

 
    // thats for index datatables 
    var imagePath = window.APP_URLS.image_path;
    var table = $('#product_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.getproductdata,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'product_name', name: 'product_name' },
            { 
            data: 'image',
            name: 'image',
            orderable: false,
            searchable: false,
            render: function (data, type, row) {
                if (data) {
                    return '<img src="'+ imagePath + data + '" alt="Product Image" width="60" height="60">';
                } else {
                    return '<span class="text-muted">No Image</span>';
                }
            }
        },
            { data: 'product_status', name: 'product_status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // delete products
    $(document).on('click', '.delete_product', function () {
        let id = $(this).data('id');

        var url = window.APP_URLS.deleteproduct.replace(':id' , id);
        if (confirm('Are you sure you want to delete this product?')) {
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

let uspsIndex;
    
    // Check if this is create or edit mode
    const isEditMode = $("#hidden_product_id").length > 0 && $("#hidden_product_id").val() !== "";
    
    if (isEditMode) {
        // Edit mode: Start after the last existing USP index 
        uspsIndex = $('#UspsWrapper .UspsGroup').length;
    } else {
        // Create mode: Start from 1 (since we already have index 0)
        uspsIndex = 1;
    }

$('#addUsps').click(function () {
    const html = `
        <div class="row UspsGroup ">
            <div class="col-md-5 mt-3">
                <input type="text" name="product_usp[${uspsIndex}][name]" class="form-control" placeholder="Enter USP Title" >
            </div>
            <div class="card-body col-md-6">
                <textarea name="product_usp[${uspsIndex}][description]" 
                    class="form-control product_usps_description" 
                    placeholder="Enter USP Description"></textarea>
            </div>
            <div class="col-md-1 d-flex align-items-center">
                <button type="button" class="btn btn-danger removeUsps">-</button>
            </div>
        </div>`;
    $('#UspsWrapper').append(html);
    $('#UspsWrapper')
        .find('.product_usps_description')
        .last()
        .summernote({
            placeholder: 'Enter Technical Specifications here...',
            height: 300,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ]
        });
    uspsIndex++;
});

$(document).on('click', '.removeUsps', function () {
    $(this).closest('.UspsGroup').remove();
});

let technicalsIndex = 1;

$('#addtechnicals').click(function () {
    const html = `
        <div class="row techinalsGroup ">
            <div class="col-md-5 mt-3">
                <input type="text" name="product_technical[${technicalsIndex}][name]" class="form-control" placeholder="Enter Parameter" >
            </div>
            <div class="card-body col-md-6">
                <textarea name="product_technical[${technicalsIndex}][description]" 
                    class="form-control product_technical" 
                    placeholder="Enter USP Description"></textarea>
            </div>
            <div class="col-md-1 d-flex align-items-center">
                <button type="button" class="btn btn-danger removeTechinals">-</button>
            </div>
        </div>`;
    $('#technicalsWrapper').append(html);  
    $('#technicalsWrapper')
        .find('.product_technical')
        .last()
        .summernote({
            placeholder: 'Enter Technical Specifications here...',
            height: 300,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ]
        });


    technicalsIndex++;
});

$(document).on('click', '.removeTechinals', function () {
    $(this).closest('.techinalsGroup').remove();
});


$(document).on('change', '.color-image-input', function () {
    const previewZone = $(this).siblings('.preview-images-zone');
    previewZone.empty(); // Clear existing previews when new images are selected
    const files = this.files;

    if (files) {
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgHTML = `
                    <div class="preview-image position-relative d-inline-block me-2 mb-2" style="width: 70px; height: 70px;">
                        <img src="${e.target.result}" 
                             style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px;" />
                        <button type="button" 
                                class="remove-preview btn btn-sm btn-danger position-absolute top-0 end-0 p-0" 
                                style="width:20px; height:20px; font-size:12px; line-height: 1;">
                            ×
                        </button>
                    </div>`;
                previewZone.append(imgHTML);
            };
            reader.readAsDataURL(file);
        });
    }
});

// Remove image preview when clicking the × button
$(document).on('click', '.remove-preview', function () {
    $(this).closest('.preview-image').remove();
});
$(document).on('click', '.remove-image', function () {
        $(this).closest('.position-relative').remove();
});




document.addEventListener('DOMContentLoaded', function() {
    const sizeCheckboxes = document.querySelectorAll('.size-checkbox');
    const selectedSizesText = document.getElementById('selectedSizesText');
    
    function updateSelectedSizes() {
        const selected = [];
        sizeCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
            }
        });
        
        if (selected.length > 0) {
            selectedSizesText.textContent = selected.join(', ');
            selectedSizesText.classList.remove('text-muted');
            selectedSizesText.classList.add('text-primary');
        } else {
            selectedSizesText.textContent = 'None';
            selectedSizesText.classList.remove('text-primary');
            selectedSizesText.classList.add('text-muted');
        }
    }
    
    // Add event listeners
    sizeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedSizes);
    });
    
    // Initial update
    updateSelectedSizes();
    
    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const checkedSizes = document.querySelectorAll('.size-checkbox:checked');
            if (checkedSizes.length === 0) {
                e.preventDefault();
                alert('Please select at least one size.');
                document.querySelector('.size-checkbox').focus();
                return false;
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const cardInputs = document.querySelectorAll('.size-card-input');
    const cardSelectedDisplay = document.getElementById('cardSelectedSizes');
    
    function updateCardSelection() {
        const selected = [];
        cardInputs.forEach(input => {
            if (input.checked) {
                selected.push(input.value);
            }
        });
        
        cardSelectedDisplay.textContent = selected.length > 0 ? selected.join(', ') : 'None selected';
        cardSelectedDisplay.className = selected.length > 0 ? 'fw-bold text-primary' : 'fw-bold text-muted';
    }
    
    cardInputs.forEach(input => {
        input.addEventListener('change', updateCardSelection);
    });
    
    updateCardSelection(); // Initial update
    
    // Form validation - Same as create form
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const checkedSizes = document.querySelectorAll('.size-card-input:checked');
            if (checkedSizes.length === 0) {
                e.preventDefault();
                alert('Please select at least one size.');
                document.querySelector('.size-card-input').focus();
                return false;
            }
        });
    }
});


$(document).ready(function () {
    // Update selected features and application display
    function updateSelectedDisplay(checkboxes, displayId) {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const displayText = selected.length > 0 ? selected.join(', ') : 'None';
        $(`#${displayId}`).text(displayText);
    }

    $('.size-checkbox').on('change', function() {
        const container = $(this).closest('.size-selection-container');
        const checkboxes = container.find('.size-checkbox');
        const displayId = container.find('.selected-sizes-display span').attr('id');
        updateSelectedDisplay(checkboxes, displayId);
    });

    // Initialize selected displays
    updateSelectedDisplay($('.size-selection-container').eq(0).find('.size-checkbox'), 'selectedFeaturesText');
    updateSelectedDisplay($('.size-selection-container').eq(1).find('.size-checkbox'), 'selectedApplicationText');

});

function toggleVideoSource() {
    let source = document.getElementById('video_source').value;
    document.getElementById('upload_video_wrapper').style.display = (source === 'upload') ? 'block' : 'none';
    document.getElementById('youtube_link_wrapper').style.display = (source === 'youtube') ? 'block' : 'none';
}

// Ensure correct section shows on page load
document.addEventListener("DOMContentLoaded", toggleVideoSource);


function validateAndPreviewImage() {
    const input = document.getElementById("thumbnails_image");
    const file = input.files[0];
    const previewImg = document.getElementById("preview_thumbnails_image");
    // Check if file selected
    if (!file) {
        previewImg.style.display = "none";
        return false;
    }

    if (!file.type.startsWith("image/")) {
        input.value = ""; // reset input
        previewImg.style.display = "none";
        return false;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        
    }
    reader.readAsDataURL(file);
    return true;
}

function previewVideo(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('video_preview');

    // Remove all existing <source> elements
    preview.innerHTML = "";

    if (file) {
        const url = URL.createObjectURL(file);

        // Create a fresh <source> for the new file
        const source = document.createElement('source');
        source.src = url;
        source.type = file.type;

        preview.appendChild(source);
        preview.style.display = 'block';
        preview.load(); // reload video with new src
    } else {
        preview.style.display = 'none';
    }
}

async function uploadInChunks(file) {
    console.log("▶ Starting chunk upload...");
    const chunkSize = 5 * 1024 * 1024; // 5 MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = Date.now() + "_" + file.name;

    // ✅ Show progress bar immediately (0%)
    const progressContainer = document.querySelector(".progress");
    const progressBar = document.querySelector(".progress-bar");
    progressContainer.style.display = "block";
    progressBar.style.width = "2%";
    progressBar.textContent = "2%";

    for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
        const start = (chunkNumber - 1) * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const blob = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("fileName", fileName);
        formData.append("chunkNumber", chunkNumber);
        formData.append("totalChunks", totalChunks);

        const url = window.APP_URLS.productvideoUploadChunk;
        console.log(`📡 Uploading chunk ${chunkNumber}/${totalChunks} → ${url}`);

        try {
            const res = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
                }
            });

            if (!res.ok) {
                console.error(`❌ Failed chunk ${chunkNumber}:`, res.status, res.statusText);
                continue;
            }

            const data = await res.json();
            console.log(`✅ Chunk ${chunkNumber} uploaded`, data);

            // ✅ Update progress bar after each chunk
            let percent = Math.round((chunkNumber / totalChunks) * 100);
            progressBar.style.width = percent + "%";
            progressBar.textContent = percent + "%";

            if (chunkNumber === totalChunks) {
                console.log("🎉 Upload complete", data);

                // ✅ set hidden input with final path
                let hidden = document.createElement("input");
                let form = document.getElementById("prodcutForm")
                hidden.type = "hidden";
                hidden.name = "uploaded_video_path";
                hidden.value = data.filePath;
                form.appendChild(hidden);
            }
        } catch (err) {
            console.error(`💥 Error uploading chunk ${chunkNumber}:`, err);
        }
    }
}


document.getElementById("video_file").addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
        uploadInChunks(e.target.files[0]);
    }
});