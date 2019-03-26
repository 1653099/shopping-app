
const setSaveBtnManageProduct = () => {
    const baseUrl = document.location.origin;
    let input = $("input[type='number'].price");

    for (let i = 0; i < input.length; i++) {
        $(`#price${i}`).on('input', function (e) {
            $(`#save${i}`).on('click', function (event) {
                let id = $(`#id${i}`)[0].innerText;
                let url = `${baseUrl}/admin/manage_product/edit_price/${id}?_method=PUT`;
                let data = {
                    price: $(`#price${i}`).val()
                };

                $.ajax({
                    url,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    type: 'POST',
                    success: function (res) {
                        console.log('success');
                    }
                });

                location.reload();
            });
        });
    }
}

setSaveBtnManageProduct();