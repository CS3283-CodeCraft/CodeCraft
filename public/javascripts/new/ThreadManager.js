/**
 * Created by Aigis on 30-Mar-15.
 */

var ThreadManager = Class.create({

	initialize: function() {
		this.init();
	},

	init: function() {
		this.processes = [];
	},

	toggleProcess: function (block) {
		var active = this.findProcess(block);
		if (active) {
			active.stop();
		} else {
			return this.startProcess(block);
		}
	},

	startProcess: function (
		block,
		isThreadSafe,
		exportResult
	) {
		var active = this.findProcess(block),
			top = block.topBlock(),
			newProc;
		if (active) {
			if (isThreadSafe) {
				return active;
			}
			active.stop();
			this.removeTerminatedProcesses();
		}
		top.addHighlight();
		newProc = new Process(block.topBlock());
		newProc.exportResult = exportResult;
		this.processes.push(newProc);
		return newProc;
	},

	stopAll: function (excpt) {
		// excpt is optional
		this.processes.forEach(function (proc) {
			if (proc !== excpt) {
				proc.stop();
			}
		});
	},

	stopAllForReceiver: function (rcvr, excpt) {
		// excpt is optional
		this.processes.forEach(function (proc) {
			if (proc.homeContext.receiver === rcvr && proc !== excpt) {
				proc.stop();
				if (rcvr.isClone) {
					proc.isDead = true;
				}
			}
		});
	},

	stopProcess: function (block) {
		var active = this.findProcess(block);
		if (active) {
			active.stop();
		}
	},

	pauseAll: function (stage) {
		this.processes.forEach(function (proc) {
			proc.pause();
		});
		if (stage) {
			stage.pauseAllActiveSounds();
		}
	},

	isPaused: function () {
		return detect(this.processes, function (proc) {return proc.isPaused; })
			!== null;
	},

	resumeAll: function (stage) {
		this.processes.forEach(function (proc) {
			proc.resume();
		});
		if (stage) {
			stage.resumeAllActiveSounds();
		}
	},

	step: function () {
		/*
		 run each process until it gives up control, skipping processes
		 for sprites that are currently picked up, then filter out any
		 processes that have been terminated
		 */
		this.processes.forEach(function (proc) {
			if (!proc.homeContext.receiver.isPickedUp() && !proc.isDead) {
				proc.runStep();
			}
		});
		this.removeTerminatedProcesses();
	},

	removeTerminatedProcesses:  function () {
		// and un-highlight their scripts
		var remaining = [];
		this.processes.forEach(function (proc) {
			if (!proc.isRunning() && !proc.errorFlag && !proc.isDead) {
				proc.topBlock.removeHighlight();

				if (proc.prompter) {
					proc.prompter.destroy();
					if (proc.homeContext.receiver.stopTalking) {
						proc.homeContext.receiver.stopTalking();
					}
				}

				if (proc.topBlock instanceof ReporterBlockMorph) {
					if (proc.homeContext.inputs[0] instanceof List) {
						proc.topBlock.showBubble(
							new ListWatcherMorph(
								proc.homeContext.inputs[0]
							),
							proc.exportResult
						);
					} else {
						proc.topBlock.showBubble(
							proc.homeContext.inputs[0],
							proc.exportResult
						);
					}
				}
			} else {
				remaining.push(proc);
			}
		});
		this.processes = remaining;
	},

	findProcess: function (block) {
		var top = block.topBlock();
		return detect(
			this.processes,
			function (each) {
				return each.topBlock === top;
			}
		);
	}
});

ThreadManager.className = 'ThreadManager';

module.exports = ThreadManager;