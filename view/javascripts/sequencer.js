/**
 * Code relating to the playing of the samples in the order they are placed in by the user.
 * Sounds play in a column by column fashion.
 *
 */
var Sequencer = function() {
    var self = this;
    this.idPrefix = "btn-";
    var sequenceLoop = 0;
	
    this.play = function() {
        self.stop();
        function setIntervalAndExecute(fn, t) {
            fn();
            return setInterval(fn, t);
        }
        var currentCol = 0;
        var currentRow = 0;
        sequenceLoop = setIntervalAndExecute(function() {
            for (var col = 0; col < grid.colNumber; col++) {
                if (col == currentCol) {
                    var currentRow = 0;
                    soundManager.stopAll();
                    $("#indicator li:eq(" + currentCol + ")").addClass("selectedIndicator");
                    $("#used div li").removeClass("nowPlaying");
                    $(".col-" + currentCol).addClass("nowPlaying");
                    for (var cell = currentCol; currentRow < grid.rowNumber; cell += grid.colNumber) {
                        if (currentMusic[cell].sound != null) {
                            soundManager.play(currentMusic[cell].sound, {});
                        } else {}
                        currentRow++;
                    }
                }
            }
            currentCol++;
            if (currentCol > grid.colNumber) {
                stopped = true;
                $("#stopbutton, #playbutton").toggleClass("btn hidden");
                self.stop();
            }
        }, 7627); //ms length of the sample
    };
	
    this.stop = function() {
        soundManager.stopAll();
        clearInterval(sequenceLoop);
        $("#used div li").removeClass("nowPlaying");
        $("#indicator li").removeClass("selectedIndicator");
    };
}, sequencer = new Sequencer;

soundManager.flashVersion = window.location.toString().match(/#flash8/i) ? 8 : 9;

if (soundManager.flashVersion != 8) {
    soundManager.useHighPerformance = true;
}

soundManager.setup({
    url: "swf/",
    bgColor: "#333333",
    wmode: "transparent",
    debugMode: false,
    consoleOnly: false,
    useFlashBlock: true
});

soundManager.onready(function() {
    var soundURLs, ext, i;
    soundManager.setup({
        defaultOptions: {
            autoLoad: true
        }
    });
    soundURLs = "pro_drum_127_03,pro_drum_127_04,pro_drum_127_05,pro_drum_127_08,pro_drum_127_09,pro_drum_tops_127_05,pro_drum_tops_127_05-2,pro_drum_tops_127_07,pro2_syn_127_07_d,pro2_syn_127_10_c,pro2_syn_127_26_g_s,pro2_syn_127_50_d,pro_drum_125_01,pro_drum_125_02,une_vox_125_03,sse_vox_127_O5_a_s,une_fx_125_11".split(",");
    ext = "mp3";
    for (i = 0; i < soundURLs.length; i++) {
        soundManager.createSound("s" + i, "audio/" + ext + "/" + soundURLs[i] + "." + ext);
    }
});