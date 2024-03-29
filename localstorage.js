window.model = {
    data: {
        items: [],
        filter: 'All',
    },
    TOKEN: 'TodoList',

    init: (function(callback) {
        var storage = window.localStorage;
        var data = storage.getItem(this.TOKEN);
        try {
            if (data) this.data = JSON.parse(data);
        }
        catch (e) {
            storage.setItem(this.TOKEN, '');
            console.error(e);
        }
        if (callback) callback();
    }),

    flush: (function() {
        var storage = window.localStorage;
        try {
            storage.setItem(this.TOKEN, JSON.stringify(this.data));
        }
        catch (e) {
            console.error(e);
        }
    }),
}