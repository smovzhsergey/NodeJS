class TimersManager {
	
    constructor() {
		this.timers = [];
		this.logs = [];
		this.isStart = false;
	}
	
	_checkNewTimer (newTimer) {

		if (typeof newTimer !== 'object' || Array.isArray(newTimer) || newTimer === null) {
			throw new Error(`The timer must be an object.`);
		}

		if (this.timers.some( timer => timer.name === newTimer.name)) {
			throw new Error(`The timer "${ newTimer.name }" already exists.`);
		}

		const template = {
			name:		'string',
			delay:		'number',
			interval:	'boolean',
			job:		'function',
		};

		const templateFields = Object.entries(template);
		const timerFields = Object.entries(newTimer);
		
		templateFields.forEach( templateField => {

			const [ templateFieldName, templateFieldType ] = templateField;
			const objectField = timerFields.filter( field => field[0] === templateFieldName);

            if (objectField.length === 0) {
                throw new Error(`The field "${templateFieldName}" is required in a new timer.`);
			}
			
			const [[ , timerFieldValue]] = objectField;
			
            if (typeof timerFieldValue !== templateFieldType ) {
                throw new Error(`Timer is'nt valid! Field "${ templateFieldName }" must be a "${ templateFieldType }" type.`);
			}
			
			if (templateFieldName === 'name' & timerFieldValue.length === 0) {
                throw new Error(`Timer's name can not be an empty string`);
			}
			
			if (templateFieldName === 'delay' & ( timerFieldValue < 0 || timerFieldValue > 5000)) {
                throw new Error(`Timer's delay must be in interval from 0 to 5000 ms`);
			}
        });
	}

	_startSingleTimer (timer) {
        
		const { delay, interval, job , cbArgs } = timer;
		let timerID;

		if (interval) {
			timerID = setInterval(
                () => this._handlerTimerJob(timer),
                delay
            );
		} else {
			timerID = setTimeout(
                () => this._handlerTimerJob(timer),
                delay
            );
		}

		timer.timerID = timerID;
    }

    _handlerTimerJob (timer) {
        
        const result = timer.job(...timer.cbArgs);
        
        this._log(timer, result);
    }
        
    _clearSingleTimer (timer) {
		if (timer.interval) {
			clearInterval(timer.timerID);
			timer.timerID = null;
		} else {
			clearTimeout(timer.timerID);
			timer.timerID = null;
		}
	}

	_log (timer, result) {

        this.logs.push({
            name: timer.name,
            in: timer.cbArgs,
            out: result,
            created: new Date(),
        });
    }

    add (timer, ...cbArgs	) {

		if (this.isStart) {
			throw new Error('Cannot add new timer! The timers have been activated');
		}

		this._checkNewTimer(timer);

		timer.cbArgs = cbArgs;

		this.timers.push(timer);
		
		return this;
    }

    remove (name) {
		// обработка ошибки имени сработает в методе pause()
		const timerIndex = this.pause(name);
		this.timers.splice(timerIndex, 1);
    }

    start () {
        
		this.isStart = true;

		for (const timer of this.timers) {
			
			this._startSingleTimer(timer);
		}
    }

    stop () {
		
		for (const timer of this.timers) {
			this._clearSingleTimer(timer);
		}
    }

    pause (name) {

		let currentIndex;
		const currentTimer = this.timers.filter( (timer, index) => {

			if (timer.name === name) {
				currentIndex = index;
			}

			return timer.name === name;
		})[0];

		if (typeof name !== 'string') {
			throw new Error('Parameter "name" must have "string" type');
		}

		if (!currentTimer) {
			throw new Error('You try to stop unexsisting timer');
		}

		if (currentTimer.timerID) {
			this._clearSingleTimer(currentTimer);
		} else {
			try {
				throw new Error('Oops... The timer was not activated!');
			} catch (error) {
				console.log(error.message)
			}
		}

		return currentIndex;
    }

    resume (name) {
		const timer = this.timers.filter( timer => timer.name === name )[0];
		
		try {
			if (!timer) {
				throw new Error(`Oops... The timer ${ name } has been deleted or does not exist`)
			}

			this._startSingleTimer(timer);
		} catch (err) {
			console.log(err.message);
		}
    }

    print () {
        console.log(this.logs);
    }
}

const manager = new TimersManager();

const t1 = {
	name: 't1',
	delay: 1000,
	interval: false,
	job: (a, b) => a ** b,
};
const t2 = {
	name: 't2',
	delay: 2000,
	interval: false,
	job: (a, b) => a + b,
};

manager.add(t1, 2, 3).add(t2, 6, 4);
manager.start();
manager.print();
setTimeout(() => manager.print(), 2000);

exports.TimersManager = TimersManager;