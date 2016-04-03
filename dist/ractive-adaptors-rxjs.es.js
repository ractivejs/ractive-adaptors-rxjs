function RxWrapper ( ractive, observable, keypath ) {
	var self = this;

	this.ractive = ractive;
	this.value = observable;
	this.keypath = keypath;

	this.dispose = observable.subscribe( function ( value ) {
		if ( self.updating ) {
			return;
		}

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
		this.dispose();
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
		return object && typeof object.lift === 'function' && typeof object.subscribe === 'function';
	},
	wrap: function ( ractive, observable, keypath ) {
		return new RxWrapper( ractive, observable, keypath );
	}
};

export default ractiveAdaptorsRxjs;