
const formatPrice = (price) => {
    let result = price + ',';
    result = result.replace(/\d(?=(\d{3})+\,)/g, '$&.');
    result = result.replace(',', '');
    return result + ' VNĐ';
};

const fetchDataFromServer = () => {
    let boxs = $('.box');

    for (let i = 0; i < boxs.length; i++) {
        $.get(`/category/products/${$(`#id${i}`).val()}`, (data) => {
            if (data == null) {
                return;
            }

            let product_html = '';

            $.each(data, (key, value) => {
                let html = 
                        `<div class="col-sm-3 col-xs-6 d-inline-block">
                            <div class="product-block">
                                <div class="image">
                                    <div class="image-container">
                                        <a href="/product/${value._id}"">
                                            <img class="img-product" src="/product_images/${value._id}/${value.image}" alt="">
                                        </a>
                                    </div>
                                </div>
                                <div class="product-meta">
                                    <h3 class="name">
                                        <a href="/product/${value._id}">${value.title}</a>
                                    </h3>
                                    <div class="price">
                                        <span>${formatPrice(value.price)}</span>
                                    </div>
                                    <div class="cart">
                                        <div class="btn-group">
                                            <a href="/product/${value._id}" class="btn btn-sm btn-outline-secondary">Mua ngay</a>
                                            <form action="/cart" method="POST">
                                            <input type="hidden" value="${value._id}" name="id">
                                            <button class="btn btn-sm btn-outline-secondary">Thêm vào giỏ</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                product_html += html;
            });

            $(`#content${i}`)[0].innerHTML = product_html;
        })
    }
}; 

fetchDataFromServer();