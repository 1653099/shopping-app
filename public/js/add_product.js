var readIMG = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = (e) => {
            $("#imgPreview").attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#img").change(function () {
    readIMG(this);
});

let images = [];
$('#images')[0].innerHTML = generateHiddenInputImg('');

function generateHTMLImgPreview(image) {
    let path = `/buffer_images/${image}`;
    let data =
        `<div class="col-md-3 col-sm-6">
                <figure class="figure">
                    <img class="img-product figure-img img-fluid rounded" src="${path}">
                    <button class="mx-auto d-block btn btn-sm btn-danger" onclick="deleteGalleryImage('${image}')">Xóa</button>
                </figure>
            </div>`;
    
    return data;
}

function generateHiddenInputImg(image) {
    return `<input type="hidden" name="images" value="${image}">`
}

// Dropzone
Dropzone.options.dropzoneForm = {
    acceptedFiles: "image/*",
    maxFiles: 5,
    init: function () {
        this.on("queuecomplete", function (file) {
            $.get('/admin/manage_product/gallery', (data) => {
                if (data == null) {
                    return;
                }

                let images_html_preview = '';
                let images_html_input   = '';

                images = [];

                $.each(data, function (key, value) {
                    let data_preview = generateHTMLImgPreview(value);
                    let data_input = generateHiddenInputImg(value);

                    images.push(value);
                    images_html_preview += data_preview;
                    images_html_input += data_input;
                });

                images_html_input += generateHiddenInputImg('');
                $('#gallery')[0].innerHTML = images_html_preview;
                $('#images')[0].innerHTML = images_html_input;
            });
        });
    }
}

function deleteGalleryImage(file) {
    images.splice(images.indexOf(file), 1);
    let images_html_preview = '';
    let images_html_input = '';

    images.forEach(image => {
        let data_preview = generateHTMLImgPreview(image);
        let data_input = generateHiddenInputImg(image);

        images_html_preview += data_preview;
        images_html_input += data_input;
    });

    images_html_input += generateHiddenInputImg('');
    $('#gallery')[0].innerHTML = images_html_preview;
    $('#images')[0].innerHTML = images_html_input;
}
