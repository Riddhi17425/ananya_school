$(document).ready(function () {
 
    // thats for index datatables 
    var imagePath = window.APP_URLS.image_path;
    var table = $('#video_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.APP_URLS.getVideodata,
        order: [[0, 'desc']],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'video_title', name: 'video_title' },
            {
                data: 'thumnail_image',
                name: 'thumnail_image',
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (data) {
                        return '<img src="'+ imagePath +  data + '" alt="' + row.image + '" width="60" height="60">';
                    } else {
                        return '<span class="text-muted">No Image</span>';
                    }
                }
            },
            { data: 'status', name: 'status' },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ]
    });

    // delete milestone
    $(document).on('click', '.delete_video', function () {
        let id = $(this).data('id');
        
        var url = window.APP_URLS.deletevideo.replace(':id' , id);
        if (confirm('Are you sure you want to delete this Video?')) {
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

$(document).ready(function() {
    $('#video_desc').summernote({ 
        placeholder: 'Enter Description here...',
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

// function previewVideo(event) {
//     const file = event.target.files[0];
//     const preview = document.getElementById('video_preview');
//     const previewSrc = document.getElementById('video_preview_src');

//     if (file) {
//         const url = URL.createObjectURL(file);
//         previewSrc.src = url;
//         preview.style.display = 'block';
//         preview.load(); // reload video with new src
//     } else {
//         preview.style.display = 'none';
//         previewSrc.src = "";
//     }
// }

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


// async function uploadInChunks(file) {
//     console.log("▶ Starting chunk upload...");
//     const chunkSize = 5 * 1024 * 1024; // 5 MB
//     const totalChunks = Math.ceil(file.size / chunkSize);
//     const fileName = Date.now() + "_" + file.name;

//     for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
//         const start = (chunkNumber - 1) * chunkSize;
//         const end = Math.min(start + chunkSize, file.size);
//         const blob = file.slice(start, end);

//         const formData = new FormData();
//         formData.append("file", blob);
//         formData.append("fileName", fileName);
//         formData.append("chunkNumber", chunkNumber);
//         formData.append("totalChunks", totalChunks);

//         const url = window.APP_URLS.videoUploadChunk;
//         console.log(`📡 Uploading chunk ${chunkNumber}/${totalChunks} → ${url}`);

//         try {
//             const res = await fetch(url, {
//                 method: "POST",
//                 body: formData,
//                 headers: {
//                     "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
//                 }
//             });

//             if (!res.ok) {
//                 console.error(`❌ Failed chunk ${chunkNumber}:`, res.status, res.statusText);
//                 continue;
//             }

//             const data = await res.json();
//             console.log(`✅ Chunk ${chunkNumber} uploaded`, data);

//             let percent = Math.round((chunkNumber / totalChunks) * 100);
//             document.querySelector(".progress").style.display = "block";
//             document.querySelector(".progress-bar").style.width = percent + "%";
//             document.querySelector(".progress-bar").textContent = percent + "%";

//             if (chunkNumber === totalChunks) {
//                 console.log("🎉 Upload complete", data);

//                 // ✅ set hidden input with final path
//                 let hidden = document.createElement("input");
//                 let form = document.getElementById("videoForm")
//                 hidden.type = "hidden";
//                 hidden.name = "uploaded_video_path";
//                 hidden.value = data.filePath;
//                 form.appendChild(hidden);
//             }
//         } catch (err) {
//             console.error(`💥 Error uploading chunk ${chunkNumber}:`, err);
//         }
//     }
// }

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

        const url = window.APP_URLS.videoUploadChunk;
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
                let form = document.getElementById("videoForm")
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
