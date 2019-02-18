function Rest() {

    /* *******************************************
     * P R I V A T E
     * *******************************************/

    function _sendRequest(method, request, callback) {

        let headers = $.extend({}, request.getHeaders(), {
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST, GET',
            'To-Host': request.toHost
        });
        $.ajax({
            url: request.getURL(),
            method: method || 'GET',
            query: request.getQuery(),
            headers: headers,
            data: request.getBodyData(),
            success: function(response, status) {
                let data = _parseData(response);
                if (data.result) {
                    callback(null, data.result);
                } else {
                    callback(null, data);
                }
            },
            error: function(err, response) {
                let rPromError = function(error) {
                    err.then(result => {
                        if (result.then) {
                            rPromError(result);
                        } else {
                            callback(error);
                        }
                    })
                    .catch(error => {
                        callback(error);
                    });
                };

                if (response === 'timeout') {
                    callback(new Error('Request timed out (' + err + ')'));
                } else if (response === 'error' && !err) {
                    callback(new Error('Request error'));
                } else if (err.then) {
                    rPromError(err);
                } else {
                    callback(err);
                }
            },
        });
    }

    function _parseData(data) {
        let response = '';
        try {
            response = $.parseJSON(data);
        } catch(err) {
            try {
                response = $.parseXML(data);
            } catch (err) {}
        }

        return response;
    }

    /* *******************************************
     * M E T H O D S
     * *******************************************/

    this.get = function(request, callback) {

        _sendRequest('GET', request, callback);
    };

    this.post = function(request, callback) {

        _sendRequest('POST', request, callback);
    };
}

module.exports = new Rest();