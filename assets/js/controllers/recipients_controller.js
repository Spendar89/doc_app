var request = require('superagent');

var RecipientsController = {
    sendRecipientAuthToken: function(recipient, callback) {
        recipient.authId = recipient.id;
        request
            .post(EMAIL_AUTH_APP + "/send_token")
            .send({
                user:recipient
            })
            .end(
                function(err, res) {
                    callback(err, res && res.body);
                }
            );
    },

    fetchRecipientAuthStatus: function(recipient, callback) {
       var uid = recipient.authId,
           token = recipient.authToken;

       request
        .post(EMAIL_AUTH_APP + "/authenticate")
        .send({
            uid: uid,
            token: token
        })
        .end(
            function(err, res) {
                callback(err, res && res.body);
            }
        );
    }
};

module.exports = RecipientsController;
