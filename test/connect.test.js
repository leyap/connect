
/**
 * Module dependencies.
 */

var connect = require('connect'),
    helpers = require('./helpers'),
    assert = require('assert'),
    http = require('http');

module.exports = {
    test_version: function(){
        assert.ok(/^\d+\.\d+\.\d+$/.test(connect.version), 'Test framework version format');
    },
    
    test_config: function(){
        assert.equal('localhost', connect.env.hostname, 'Test "development" environment config loaded by default');
        assert.equal('development', connect.env.name, 'Test env.name');
    },
    
    test_run: function(){
        var server = helpers.run([
            { module: require('filters/uppercase'), param: 1 },
            { module: require('providers/echo') }
        ]);
        assert.ok(server instanceof http.Server, 'Test Server instanceof http.Server')
        var setupArgs = require('filters/uppercase').setupArgs;
        assert.equal('development', setupArgs[0].name, 'Test env passed to setup() as first arg');
        assert.eql([1], Array.prototype.slice.call(setupArgs, 1), 'Test remaining setup() args');
        var req = server.request('POST', '/');
        req.buffer = true;
        req.addListener('response', function(res){
            res.addListener('end', function(){
                assert.equal('HELLO WORLD', res.body, 'Test provider response');
            })
        })
        req.write('hello world');
        req.end();
    }
}