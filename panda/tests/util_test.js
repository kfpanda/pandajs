navigator = {};
navigator.userAgent = "ie";
var expect = require('expect.js');
require('../src/util.js');

describe('Util', function() {
	describe('Date', function() {
		it('Util.Date.getTime(date)', function() {
			console.log(Util.Date.getTime(new Date()));
			expect(Util.Date.getTime(new Date())).to.be.a('string');
	    });
	    
	    it('Util.Date.format(date, pattern)', function() {
	    	var format = Util.Date.format(new Date(), "yyyyMMdd");
	    	console.log(format);
			expect(format).to.have.length(8);
	    });
	});
	
	describe('Loop', function() {
		it('Util.Loop.loop(opt)', function() {
			Util.Loop.loop({
				bool: function(){ return false; },
				fn: function(){},
				interval: 800,
				times: 5,
				success: function(opt){
					console.log(['Loop.success', opt]);
				},
				fail: function(opt){
					console.log(['Loop.fail', opt]);
				},
				timeout: function(opt){
					expect(opt.tally).to.be(6);
					console.log(['Loop.timeout', opt]);
				}
			});
	    });
	});
});

