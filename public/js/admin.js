
const setActiveSideBarItem = () => {
    var type = $('#type')[0].innerText;
    switch (type) {
        case 'products':
            $('#product').toggleClass('active');
            break;
        case 'page':
            $('#page').toggleClass('active');
            break;
        case 'carts':
            $('#carts').toggleClass('active');
            break;
        case 'user':
            $('#user').toggleClass('active');
            break;
        case 'revenue':
            $('#revenue').toggleClass('active');
            break;
        case 'categories':
            $('#categories').toggleClass('active');
            break;
        default:
            break;
    }
};

setActiveSideBarItem();
