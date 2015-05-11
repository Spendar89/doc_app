var should = require('should'),
    _ = require('lodash'),
    nock = require('nock'),
    rewire = require('rewire');


describe('LeadMixin', function() {
    var LeadMixin;

    beforeEach(function() {
        process.env.API_HOST = 'http://test-host';
        LeadMixin = require('./../../../../extensions/lead/lead_mixin.js');
        LeadMixin.state = LeadMixin.state || {};
        LeadMixin.setLoading = function() {};
    });

    describe("_fetchLeadAndSetState", function() {
        var LeadMixin, METHOD_NAMES, METHODS, FAKE_LEAD;

        before(function() {
            LeadMixin = rewire('./../../../../extensions/lead/lead_mixin.js');

            METHOD_NAMES = [
                "_fetchLead",
                "_setStateFromLead",
                "_fetchLeadDocs",
                "_setStateFromDocs"
            ];

            METHODS = _.map(
                METHOD_NAMES,
                function(name) {
                    return LeadMixin[name];
                }
            );

            FAKE_LEAD = {
                name: "Randy Moss"
            };
        });


        it('should use async.waterfall to call the correct methods', function() {
            var waterfallStub = function() {
                    return arguments[0];
                },
                revert = LeadMixin.__set__(
                    'async.waterfall',
                    waterfallStub
                );

            LeadMixin._fetchLeadAndSetState().should.eql(METHODS);

            revert();
        });


        it('should pass the lead to the callback', function(done) {
            var fn = function(a, b) {
                var data, callback;

                if (b) {
                    data = a;
                    callback = b;
                } 

                else {
                    data = FAKE_LEAD;
                    callback = a;
                }

                callback(null, data);
            };

            _.each(
                METHOD_NAMES, 
                function(name) {
                    LeadMixin[name] = fn;
                }
            );

            LeadMixin._fetchLeadAndSetState(
                function(err, data) {
                    data.should.eql(FAKE_LEAD);
                    done();
                }
            );
        });
    });

    describe("_fetchLead", function() {

        var getLead = nock(process.env['API_HOST'])
                        .get('/leads/FakeLeadId?campus=FakeCampus')
                        .reply(200, true);

        var LEAD_ID_ERROR = {
            message: "Cannot fetch leads without leadId", 
            name: "state_error"
        };

        it("should return an error when state.leadId is undefined", function(done) {
            LeadMixin.state.leadId = undefined;
            LeadMixin._fetchLead(function(err, res) {
                err.should.eql(LEAD_ID_ERROR);
                done();
            })
        });

        it("should make a valid ajax request when leadId and campus exist", function(done) {
            LeadMixin.state.leadId = "FakeLeadId";
            LeadMixin.state.campus = "FakeCampus";
            LeadMixin._fetchLead(function(err, res) {
                res.should.eql(true);
                done();
            })
        })
    })

});
