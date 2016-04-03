var Ractive = require( 'ractive' );
var Rx = require( 'rx' );
var assert = require( 'assert' );
var rxjsAdaptor = require( '../' );

Ractive.prototype.adapt = [ rxjsAdaptor ];

describe( 'Ractive.adaptors.rxjs', () => {
	it( 'adapts an Observable', () => {
		var ractive = new Ractive({
			template: `{{value}}`
		});

		var value = new Rx.Subject();

		ractive.set( 'value', value );

		value.onNext( 1 );
		assert.equal( ractive.toHTML(), '1' );

		value.onNext( 2 );
		assert.equal( ractive.toHTML(), '2' );
	});
});
