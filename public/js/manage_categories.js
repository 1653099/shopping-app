
const setSaveButton = () => {
    const baseUrl = document.location.origin;
    let input = $("input[type='text'].title");

    for (let i = 0; i < input.length; i++) {
        $(`#title${i + 1}`).on('input', function (e) {
            // $(`#save${i + 1}`).removeClass('d-none');
            $(`#save${i + 1}`).on('click', function (event) {
                // let encodeTitle = encodeURI($(this).val());
                let id = $(`#id${i + 1}`)[0].innerText;
                let url = `${baseUrl}/admin/manage_categories/${id}?_method=PUT`;
                let data = { title: $(`#title${i + 1}`).val() };

                $.ajax({
                    url,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    type: 'POST',
                    success: function (res) {
                        console.log('success');
                    }
                });

                // $(`#save${i + 1}`).addClass('d-none');
                location.reload();
            });
        });
    }
};

setSaveButton();