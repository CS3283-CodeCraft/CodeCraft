/**
 * Created by Aigis on 30-Mar-15.
 */

// Process /////////////////////////////////////////////////////////////

/*
 A Process is what brings a stack of blocks to life. The process
 keeps track of which block to run next, evaluates block arguments,
 handles control structures, and so forth.

 The ThreadManager is the (passive) scheduler, telling each process
 when to run by calling its runStep() method. The runStep() method
 will execute some number of blocks, then voluntarily yield control
 so that the ThreadManager can run another process.

 The Scratch etiquette is that a process should yield control at the
 end of every loop iteration, and while it is running a timed command
 (e.g. "wait 5 secs") or a synchronous command (e.g. "broadcast xxx
 and wait"). Since Snap also has lambda and custom blocks Snap adds
 yields at the beginning of each non-atomic custom command block
 execution, and - to let users escape infinite loops and recursion -
 whenever the process runs into a timeout.

 a Process runs for a receiver, i.e. a sprite or the stage or any
 blocks-scriptable object that we'll introduce.

 structure:

 topBlock            the stack's first block, of which all others
 are children
 receiver            object (sprite) to which the process applies,
 cached from the top block
 context                the Context describing the current state
 of this process
 homeContext            stores information relevant to the whole process,
 i.e. its receiver, result etc.
 isPaused            boolean indicating whether to pause
 readyToYield        boolean indicating whether to yield control to
 another process
 readyToTerminate    boolean indicating whether the stop method has
 been called
 isDead              boolean indicating a terminated clone process
 timeout                msecs after which to force yield
 lastYield            msecs when the process last yielded
 errorFlag            boolean indicating whether an error was encountered
 prompter            active instance of StagePrompterMorph
 httpRequest         active instance of an HttpRequest or null
 pauseOffset         msecs between the start of an interpolated operation
 and when the process was paused
 exportResult        boolean flag indicating whether a picture of the top
 block along with the result bubble shoud be exported
 */

var Process = Class.create({
	timeout:500,
	isCatchingErrors: true,

	initialize: function(topBlock) {
		this.init(topBlock);
	},

	init: function(topBlock) {
		this.topBlock = topBlock || null;

		this.readyToYield = false;
		this.readyToTerminate = false;
		this.isDead = false;
		this.errorFlag = false;
		this.context = null;
		this.homeContext = new Context();
		this.lastYield = Date.now();
		this.isAtomic = false;
		this.prompter = null;
		this.httpRequest = null;
		this.isPaused = false;
		this.pauseOffset = null;
		this.frameCount = 0;
		this.exportResult = false;

		if (topBlock) {
			this.homeContext.receiver = topBlock.receiver();
			this.homeContext.variables.parentFrame =
				this.homeContext.receiver.variables;
			this.context = new Context(
				null,
				topBlock.blockSequence(),
				this.homeContext
			);
			this.pushContext('doYield'); // highlight top block
		}
	},

	// Process accessing
	isRunning:  function () {
		return (this.context !== null) && (!this.readyToTerminate);
	},

	// Process entry points
	runStep: function () {
		/*
		 a step is an an uninterruptable 'atom', it can consist
		 of several contexts, even of several blocks
		 */
		if (this.isPaused) { // allow pausing in between atomic steps:
			return this.pauseStep();
		}
		this.readyToYield = false;
		while (!this.readyToYield
		&& this.context
		&& (this.isAtomic ?
			(Date.now() - this.lastYield < this.timeout) : true)
			) {
			// also allow pausing inside atomic steps - for PAUSE block primitive:
			if (this.isPaused) {
				return this.pauseStep();
			}
			this.evaluateContext();
		}
		this.lastYield = Date.now();

		// make sure to redraw atomic things
		if (this.isAtomic &&
			this.homeContext.receiver &&
			this.homeContext.receiver.endWarp) {
			this.homeContext.receiver.endWarp();
			this.homeContext.receiver.startWarp();
		}

		if (this.readyToTerminate) {
			while (this.context) {
				this.popContext();
			}
			if (this.homeContext.receiver) {
				if (this.homeContext.receiver.endWarp) {
					// pen optimization
					this.homeContext.receiver.endWarp();
				}
			}
		}
	},

	stop: function () {
		this.readyToYield = true;
		this.readyToTerminate = true;
		this.errorFlag = false;
		if (this.context) {
			this.context.stopMusic();
		}
	},

	pause: function () {
		this.isPaused = true;
		if (this.context && this.context.startTime) {
			this.pauseOffset = Date.now() - this.context.startTime;
		}
	},

	resume: function () {
		this.isPaused = false;
		this.pauseOffset = null;
	},

	pauseStep: function () {
		this.lastYield = Date.now();
		if (this.context && this.context.startTime) {
			this.context.startTime = this.lastYield - this.pauseOffset;
		}
	},

	// Process evaluation
	evaluateContext: function () {
		var exp = this.context.expression;

		this.frameCount += 1;
		if (exp instanceof Array) {
			return this.evaluateSequence(exp);
		}
		if (exp instanceof MultiArgMorph) {
			return this.evaluateMultiSlot(exp, exp.inputs().length);
		}
		if (exp instanceof ArgLabelMorph) {
			return this.evaluateArgLabel(exp);
		}
		if (exp instanceof ArgMorph || exp.bindingID) {
			return this.evaluateInput(exp);
		}
		if (exp instanceof BlockMorph) {
			return this.evaluateBlock(exp, exp.inputs().length);
		}
		if (isString(exp)) {
			return this[exp]();
		}
		this.popContext(); // default: just ignore it
	},

	evaluateBlock:  function (block, argCount) {
		// check for special forms
		if (contains(['reportOr', 'reportAnd'], block.selector)) {
			return this[block.selector](block);
		}

		// first evaluate all inputs, then apply the primitive
		var rcvr = this.context.receiver || this.topBlock.receiver(),
			inputs = this.context.inputs;

		if (argCount > inputs.length) {
			this.evaluateNextInput(block);
		} else {
			if (this[block.selector]) {
				rcvr = this;
			}
			if (this.isCatchingErrors) {
				try {
					this.returnValueToParentContext(
						rcvr[block.selector].apply(rcvr, inputs)
					);
					this.popContext();
				} catch (error) {
					this.handleError(error, block);
				}
			} else {
				this.returnValueToParentContext(
					rcvr[block.selector].apply(rcvr, inputs)
				);
				this.popContext();
			}
		}
	},

	// Process: Special Forms Blocks Primitives

	reportOr: function (block) {
		var inputs = this.context.inputs;

		if (inputs.length < 1) {
			this.evaluateNextInput(block);
		} else if (inputs[0]) {
			this.returnValueToParentContext(true);
			this.popContext();
		} else if (inputs.length < 2) {
			this.evaluateNextInput(block);
		} else {
			this.returnValueToParentContext(inputs[1] === true);
			this.popContext();
		}
	},

	reportAnd: function (block) {
		var inputs = this.context.inputs;

		if (inputs.length < 1) {
			this.evaluateNextInput(block);
		} else if (!inputs[0]) {
			this.returnValueToParentContext(false);
			this.popContext();
		} else if (inputs.length < 2) {
			this.evaluateNextInput(block);
		} else {
			this.returnValueToParentContext(inputs[1] === true);
			this.popContext();
		}
	},

	// Process: Non-Block evaluation
	evaluateMultiSlot: function (multiSlot, argCount) {
		// first evaluate all subslots, then return a list of their values
		var inputs = this.context.inputs,
			ans;
		if (multiSlot.bindingID) {
			if (this.isCatchingErrors) {
				try {
					ans = this.context.variables.getVar(multiSlot.bindingID);
				} catch (error) {
					this.handleError(error, multiSlot);
				}
			} else {
				ans = this.context.variables.getVar(multiSlot.bindingID);
			}
			this.returnValueToParentContext(ans);
			this.popContext();
		} else {
			if (argCount > inputs.length) {
				this.evaluateNextInput(multiSlot);
			} else {
				this.returnValueToParentContext(new List(inputs));
				this.popContext();
			}
		}
	},

	evaluateArgLabel: function (argLabel) {
		// perform the ID function on an ArgLabelMorph element
		var inputs = this.context.inputs;
		if (inputs.length < 1) {
			this.evaluateNextInput(argLabel);
		} else {
			this.returnValueToParentContext(inputs[0]);
			this.popContext();
		}
	},

	evaluateInput: function (input) {
		// evaluate the input unless it is bound to an implicit parameter
		var ans;
		if (input.bindingID) {
			if (this.isCatchingErrors) {
				try {
					ans = this.context.variables.getVar(input.bindingID);
				} catch (error) {
					this.handleError(error, input);
				}
			} else {
				ans = this.context.variables.getVar(input.bindingID);
			}
		} else {
			ans = input.evaluate();
			if (ans) {
				if (contains(
						[CommandSlotMorph, ReporterSlotMorph],
						input.constructor
					) || (input instanceof CSlotMorph && !input.isStatic)) {
					// I know, this still needs yet to be done right....
					ans = this.reify(ans, new List());
					ans.isImplicitLambda = true;
				}
			}
		}
		this.returnValueToParentContext(ans);
		this.popContext();
	},

	evaluateSequence: function (arr) {
		var pc = this.context.pc,
			outer = this.context.outerContext,
			isLambda = this.context.isLambda,
			isImplicitLambda = this.context.isImplicitLambda,
			isCustomBlock = this.context.isCustomBlock;
		if (pc === (arr.length - 1)) { // tail call elimination
			this.context = new Context(
				this.context.parentContext,
				arr[pc],
				this.context.outerContext,
				this.context.receiver
			);
			this.context.isLambda = isLambda;
			this.context.isImplicitLambda = isImplicitLambda;
			this.context.isCustomBlock = isCustomBlock;
		} else {
			if (pc >= arr.length) {
				this.popContext();
			} else {
				this.context.pc += 1;
				this.pushContext(arr[pc], outer);
			}
		}
	},

	/*
	 // version w/o tail call optimization:
	 --------------------------------------
	 Caution: we cannot just revert to this version of the method, because to make
	 tail call elimination work many tweaks had to be done to various primitives.
	 For the most part these tweaks are about schlepping the outer context (for
	 the variable bindings) and the isLambda flag along, and are indicated by a
	 short comment in the code. But to really revert would take a good measure
	 of trial and error as well as debugging. In the developers file archive there
	 is a version of threads.js dated 120119(2) which basically resembles the
	 last version before introducing tail call optimization on 120123.

	 Process.prototype.evaluateSequence = function (arr) {
	 var pc = this.context.pc;
	 if (pc >= arr.length) {
	 this.popContext();
	 } else {
	 this.context.pc += 1;
	 this.pushContext(arr[pc]);
	 }
	 };
	 */

	evaluateNextInput: function (element) {
		var nxt = this.context.inputs.length,
			args = element.inputs(),
			exp = args[nxt],
			outer = this.context.outerContext; // for tail call elimination

		if (exp.isUnevaluated) {
			if (exp.isUnevaluated === true || exp.isUnevaluated()) {
				// just return the input as-is
				/*
				 Note: we only reify the input here, if it's not an
				 input to a reification primitive itself (THE BLOCK,
				 THE SCRIPT), because those allow for additional
				 explicit parameter bindings.
				 */
				if (contains(['reify', 'reportScript'],
						this.context.expression.selector)) {
					this.context.addInput(exp);
				} else {
					this.context.addInput(this.reify(exp, new List()));
				}
			} else {
				this.pushContext(exp, outer);
			}
		} else {
			this.pushContext(exp, outer);
		}
	},

	doYield: function () {
		this.popContext();
		if (!this.isAtomic) {
			this.readyToYield = true;
		}
	},

	// Process Exception Handling
	handleError: function (error, element) {
		var m = element;
		this.stop();
		this.errorFlag = true;
		this.topBlock.addErrorHighlight();
		if (isNil(m) || isNil(m.world())) {m = this.topBlock; }
		m.showBubble(
			(m === element ? '' : 'Inside: ')
			+ error.name
			+ '\n'
			+ error.message
		);
	},

	// Process Lambda primitives
	reify: function (topBlock, parameterNames, isCustomBlock) {
		var context = new Context(
				null,
				null,
				this.context ? this.context.outerContext : null
			),
			i = 0;

		if (topBlock) {
			context.expression = topBlock.fullCopy();
			context.expression.show(); // be sure to make visible if in app mode

			if (!isCustomBlock) {
				// mark all empty slots with an identifier
				context.expression.allEmptySlots().forEach(function (slot) {
					i += 1;
					if (slot instanceof MultiArgMorph) {
						slot.bindingID = ['arguments'];
					} else {
						slot.bindingID = i;
					}
				});
				// and remember the number of detected empty slots
				context.emptySlots = i;
			}

		} else {
			context.expression = [this.context.expression.fullCopy()];
		}

		context.inputs = parameterNames.asArray();
		context.receiver
			= this.context ? this.context.receiver : topBlock.receiver();

		return context;
	},

	reportScript: function (parameterNames, topBlock) {
		return this.reify(topBlock, parameterNames);
	},

	reifyScript: function (topBlock, parameterNames) {
		return this.reify(topBlock, parameterNames);
	},

	reifyReporter:  function (topBlock, parameterNames) {
		return this.reify(topBlock, parameterNames);
	},

	reifyPredicate: function (topBlock, parameterNames) {
		return this.reify(topBlock, parameterNames);
	},

	reportJSFunction: function (parmNames, body) {
		return Function.apply(
			null,
			parmNames.asArray().concat([body])
		);
	},

	doRun: function (context, args, isCustomBlock) {
		return this.evaluate(context, args, true, isCustomBlock);
	},

	evaluate: function (
		context,
		args,
		isCommand
	) {
		if (!context) {return null; }
		if (context instanceof Function) {
			return context.apply(
				this.blockReceiver(),
				args.asArray().concat([this])
			);
		}
		if (context.isContinuation) {
			return this.runContinuation(context, args);
		}
		if (!(context instanceof Context)) {
			throw new Error('expecting a ring but getting ' + context);
		}

		var outer = new Context(null, null, context.outerContext),
			runnable,
			extra,
			parms = args.asArray(),
			i,
			value;

		if (!outer.receiver) {
			outer.receiver = context.receiver; // for custom blocks
		}
		runnable = new Context(
			this.context.parentContext,
			context.expression,
			outer,
			context.receiver
		);
		extra = new Context(runnable, 'doYield');

		/*
		 Note: if the context's expression is a ReporterBlockMorph,
		 the extra context gets popped off immediately without taking
		 effect (i.e. it doesn't yield within evaluating a stack of
		 nested reporters)
		 */

		if (isCommand || (context.expression instanceof ReporterBlockMorph)) {
			this.context.parentContext = extra;
		} else {
			this.context.parentContext = runnable;
		}

		runnable.isLambda = true;
		runnable.isImplicitLambda = context.isImplicitLambda;
		runnable.isCustomBlock = false;

		// assign parameters if any were passed
		if (parms.length > 0) {

			// assign formal parameters
			for (i = 0; i < context.inputs.length; i += 1) {
				value = 0;
				if (!isNil(parms[i])) {
					value = parms[i];
				}
				outer.variables.addVar(context.inputs[i], value);
			}

			// assign implicit parameters if there are no formal ones
			if (context.inputs.length === 0) {
				// assign the actual arguments list to the special
				// parameter ID ['arguments'], to be used for variadic inputs
				outer.variables.addVar(['arguments'], args);

				// in case there is only one input
				// assign it to all empty slots
				if (parms.length === 1) {
					for (i = 1; i <= context.emptySlots; i += 1) {
						outer.variables.addVar(i, parms[0]);
					}

					// if the number of inputs matches the number
					// of empty slots distribute them sequentially
				} else if (parms.length === context.emptySlots) {
					for (i = 1; i <= parms.length; i += 1) {
						outer.variables.addVar(i, parms[i - 1]);
					}

				} else if (context.emptySlots !== 1) {
					throw new Error(
						'expecting ' + context.emptySlots + ' input(s), '
						+ 'but getting ' + parms.length
					);
				}
			}
		}

		if (runnable.expression instanceof CommandBlockMorph) {
			runnable.expression = runnable.expression.blockSequence();
		}
	},

	fork: function (context, args) {
		if (context.isContinuation) {
			throw new Error(
				'continuations cannot be forked'
			);
		}

		var outer = new Context(null, null, context.outerContext),
			runnable = new Context(null,
				context.expression,
				outer
			),
			parms = args.asArray(),
			i,
			value,
			stage = this.homeContext.receiver.parentThatIsA('StageMorph'),
			proc = new Process();

		runnable.isLambda = true;

		// assign parameters if any were passed
		if (parms.length > 0) {

			// assign formal parameters
			for (i = 0; i < context.inputs.length; i += 1) {
				value = 0;
				if (!isNil(parms[i])) {
					value = parms[i];
				}
				outer.variables.addVar(context.inputs[i], value);
			}

			// assign implicit parameters if there are no formal ones
			if (context.inputs.length === 0) {
				// assign the actual arguments list to the special
				// parameter ID ['arguments'], to be used for variadic inputs
				outer.variables.addVar(['arguments'], args);

				// in case there is only one input
				// assign it to all empty slots
				if (parms.length === 1) {
					for (i = 1; i <= context.emptySlots; i += 1) {
						outer.variables.addVar(i, parms[0]);
					}

					// if the number of inputs matches the number
					// of empty slots distribute them sequentially
				} else if (parms.length === context.emptySlots) {
					for (i = 1; i <= parms.length; i += 1) {
						outer.variables.addVar(i, parms[i - 1]);
					}

				} else if (context.emptySlots !== 1) {
					throw new Error(
						'expecting ' + context.emptySlots + ' input(s), '
						+ 'but getting ' + parms.length
					);
				}
			}
		}

		if (runnable.expression instanceof CommandBlockMorph) {
			runnable.expression = runnable.expression.blockSequence();
		}

		proc.homeContext = context.outerContext;
		proc.topBlock = context.expression;
		proc.context = runnable;
		proc.pushContext('doYield');
		stage.threads.processes.push(proc);
	},

	doReport: function (value, isCSlot) {
		while (this.context && !this.context.isLambda) {
			if (this.context.expression === 'doStopWarping') {
				this.doStopWarping();
			} else {
				this.popContext();
			}
		}
		if (this.context && this.context.isImplicitLambda) {
			if (this.context.expression === 'doStopWarping') {
				this.doStopWarping();
			} else {
				this.popContext();
			}
			return this.doReport(value, true);
		}
		if (this.context && this.context.isCustomBlock) {
			// now I'm back at the custom block sequence.
			// advance my pc to my expression's length
			this.context.pc = this.context.expression.length - 1;
		}
		if (isCSlot) {
			if (this.context &&
				this.context.parentContext &&
				this.context.parentContext.expression instanceof Array) {
				this.popContext();
			}
		}
		return value;
	},

	doStopBlock: function () {
		this.doReport();
	},

	// Process evaluation variants, commented out for now (redundant)

	/*
	 Process.prototype.doRunWithInputList = function (context, args) {
	 // provide an extra selector for the palette
	 return this.doRun(context, args);
	 };

	 Process.prototype.evaluateWithInputList = function (context, args) {
	 // provide an extra selector for the palette
	 return this.evaluate(context, args);
	 };

	 Process.prototype.forkWithInputList = function (context, args) {
	 // provide an extra selector for the palette
	 return this.fork(context, args);
	 };
	 */

	// Process continuations primitives

    doCallCC:  function (aContext) {
        this.evaluate(aContext, new List([this.context.continuation()]));
    },

    reportCallCC: function (aContext) {
        this.doCallCC(aContext);
    },

    runContinuation: function (aContext, args) {
        var parms = args.asArray();
        this.context.parentContext = aContext.copyForContinuationCall();
        // passing parameter if any was passed
        if (parms.length === 1) {
            this.context.parentContext.outerContext.variables.addVar(
                1,
                parms[0]
            );
        }
    },

    // Process custom block primitives
    evaluateCustomBlock: function () {
        var context = this.context.expression.definition.body,
            declarations = this.context.expression.definition.declarations,
            args = new List(this.context.inputs),
            parms = args.asArray(),
            runnable,
            extra,
            i,
            value,
            outer;

        if (!context) {return null; }
        outer = new Context();
        outer.receiver = this.context.receiver; // || this.homeContext.receiver;
        outer.variables.parentFrame = outer.receiver ?
            outer.receiver.variables : null;

        runnable = new Context(
            this.context.parentContext,
            context.expression,
            outer,
            outer.receiver,
            true // is custom block
        );
        extra = new Context(runnable, 'doYield');

        this.context.parentContext = extra;

        runnable.isLambda = true;
        runnable.isCustomBlock = true;

        // passing parameters if any were passed
        if (parms.length > 0) {

            // assign formal parameters
            for (i = 0; i < context.inputs.length; i += 1) {
                value = 0;
                if (!isNil(parms[i])) {
                    value = parms[i];
                }
                outer.variables.addVar(context.inputs[i], value);

                // if the parameter is an upvar,
                // create a reference to the variable it points to
                if (declarations[context.inputs[i]][0] === '%upvar') {
                    this.context.outerContext.variables.vars[value] =
                        outer.variables.vars[context.inputs[i]];
                }
            }
        }

        if (runnable.expression instanceof CommandBlockMorph) {
            runnable.expression = runnable.expression.blockSequence();
        }
    },

    // Process variables primitives
    doDeclareVariables: function (varNames) {
        var varFrame = this.context.outerContext.variables;
        varNames.asArray().forEach(function (name) {
            varFrame.addVar(name);
        });
    },

    doSetVar: function (varName, value) {
        var varFrame = this.context.variables,
            name = varName;

        if (name instanceof Context) {
            if (name.expression.selector === 'reportGetVar') {
                name = name.expression.blockSpec;
            }
        }
        varFrame.setVar(name, value);
    },

    doChangeVar: function (varName, value) {
        var varFrame = this.context.variables,
            name = varName;

        if (name instanceof Context) {
            if (name.expression.selector === 'reportGetVar') {
                name = name.expression.blockSpec;
            }
        }
        varFrame.changeVar(name, value);
    },

    reportGetVar: function () {
        // assumes a getter block whose blockSpec is a variable name
        return this.context.variables.getVar(
            this.context.expression.blockSpec
        );
    },

    doShowVar: function (varName) {
        var varFrame = this.context.variables,
            stage,
            watcher,
            target,
            label,
            others,
            isGlobal,
            name = varName;

        if (name instanceof Context) {
            if (name.expression.selector === 'reportGetVar') {
                name = name.expression.blockSpec;
            }
        }
        if (this.homeContext.receiver) {
            stage = this.homeContext.receiver.parentThatIsA('StageMorph');
            if (stage) {
                target = varFrame.find(name);
                // first try to find an existing (hidden) watcher
                watcher = detect(
                    stage.children,
                    function (morph) {
                        return morph instanceof WatcherMorph
                            && morph.target === target
                            && morph.getter === name;
                    }
                );
                if (watcher !== null) {
                    watcher.show();
                    watcher.fixLayout(); // re-hide hidden parts
                    return;
                }
                // if no watcher exists, create a new one
                isGlobal = contains(
                    this.homeContext.receiver.variables.parentFrame.names(),
                    varName
                );
                if (isGlobal || target.owner) {
                    label = name;
                } else {
                    label = name + ' (temporary)';
                }
                watcher = new WatcherMorph(
                    label,
                    SpriteMorph.prototype.blockColor.variables,
                    target,
                    name
                );
                watcher.setPosition(stage.position().add(10));
                others = stage.watchers(watcher.left());
                if (others.length > 0) {
                    watcher.setTop(others[others.length - 1].bottom());
                }
                stage.add(watcher);
                watcher.fixLayout();
            }
        }
    },

    doHideVar: function (varName) {
        // if no varName is specified delete all watchers on temporaries
        var varFrame = this.context.variables,
            stage,
            watcher,
            target,
            name = varName;

        if (name instanceof Context) {
            if (name.expression.selector === 'reportGetVar') {
                name = name.expression.blockSpec;
            }
        }
        if (!name) {
            this.doRemoveTemporaries();
            return;
        }
        if (this.homeContext.receiver) {
            stage = this.homeContext.receiver.parentThatIsA('StageMorph');
            if (stage) {
                target = varFrame.find(name);
                watcher = detect(
                    stage.children,
                    function (morph) {
                        return morph instanceof WatcherMorph
                            && morph.target === target
                            && morph.getter === name;
                    }
                );
                if (watcher !== null) {
                    if (watcher.isTemporary()) {
                        watcher.destroy();
                    } else {
                        watcher.hide();
                    }
                }
            }
        }
    },

    doRemoveTemporaries: function () {
        var stage;
        if (this.homeContext.receiver) {
            stage = this.homeContext.receiver.parentThatIsA('StageMorph');
            if (stage) {
                stage.watchers().forEach(function (watcher) {
                    if (watcher.isTemporary()) {
                        watcher.destroy();
                    }
                });
            }
        }
    },

    // Process lists primitives
    reportNewList: function (elements) {
        return elements;
    },

    reportCONS: function (car, cdr) {
        return new List().cons(car, cdr);
    },

    reportCDR: function (list) {
        return list.cdr();
    },


});

Process.className = 'Process';

module.exports = Process;