
const setAutocompleteForImportFormSearch = () => {
    const _baseUrl = document.location.origin;
    const options = {
        url: _baseUrl + '/search/products/auto_complete.json',
        getValue: 'title',
        list: {
            match: {
                enabled: true
            }
        },
        theme: 'square'
    }

    $('#search-product').easyAutocomplete(options);
};

setAutocompleteForImportFormSearch();