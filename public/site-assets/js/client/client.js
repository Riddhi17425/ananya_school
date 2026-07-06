$(document).ready(function () {
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
    var table = $('#client_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.getclientdata,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // delete milestone
    $(document).on('click', '.delete_client', function () {
        let id = $(this).data('id');

        var url = window.APP_URLS.deleteclient.replace(':id' , id);
        if (confirm('Are you sure you want to delete this client?')) {
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



// Remove image preview when clicking the × button
$(document).on('click', '.remove-preview', function () {
    $(this).closest('.preview-image').remove();
});
$(document).on('click', '.remove-image', function () {
        $(this).closest('.position-relative').remove();
});

$(document).on('click', '.add-size-price', function () {
    const index = $('#size-price-container .size-price-row').length;
    const html = `
        <div class="row mb-2 size-price-row">
            <div class="col-md-4">
                <input type="text" name="size_price[${index}][size]" class="form-control" placeholder="Size" required>
            </div>
            <div class="col-md-3">
                <input type="number" name="size_price[${index}][w_s_price]" class="form-control" placeholder="Whole Sale Price" required>
            </div>
            <div class="col-md-3">
                <input type="number" name="size_price[${index}][m_r_price]" class="form-control" placeholder="Maximum Retail price" required>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger remove-size-price">-</button>
            </div>
        </div>`;
    $('#size-price-container').append(html); 
});

$(document).on('click', '.remove-size-price', function () {
    $(this).closest('.size-price-row').remove();
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


