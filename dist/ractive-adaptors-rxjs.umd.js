(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Ractive = global.Ractive || {}, global.Ractive.adaptors = global.Ractive.adaptors || {}, global.Ractive.adaptors.rxjs = factory());
}(this, function () { 'use strict';

	function RxWrapper ( ractive, observable, keypath ) {
		var self = this;

		this.ractive = ractive;
		this.value = observable;
		this.keypath = keypath;

		this.subscriber = observable.subscribe( function ( value ) {
			if ( self.updating ) return;

			self._value = value;

			self.updating = true;
			ractive.set( keypath, value );
			self.updating = false;
		});
	}

	RxWrapper.prototype = {
		get: function () {
			return this._value;
		},
		teardown: function () {
			this.subscriber.dispose();
		},
		reset: function ( value ) {
			if ( this.updating ) {
				return;
			}

			if ( value instanceof Rx.Observable ) {
				return false;
			}

			this.updating = true;
			// TODO how do you set the value of a Rx.Observable?!
			this.updating = false;
		}
	};

	var ractiveAdaptorsRxjs = {
		filter: function ( object ) {
			// duck typing alert!
			return object && typeof object.subscribe === 'function';
		},
		wrap: function ( ractive, observable, keypath ) {
			return new RxWrapper( ractive, observable, keypath );
		}
	};

	return ractiveAdaptorsRxjs;

}));