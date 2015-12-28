var Animate = (function () {

    var requestAnimationFrame = (function () {

        var lastTime = new Date().getTime();

        return window.requestAnimationFrame ||

            window.webkitRequestAnimationFrame ||

            window.mozRequestAnimationFrame ||

            function (callback) {

                var currTime = new Date().getTime();

                var timeToCall = Math.max(0, 16 - (currTime - lastTime));

                var id = window.setTimeout(function () {

                    callback(currTime + timeToCall);

                }, timeToCall);

                lastTime = currTime + timeToCall;

                return id;
            };
    })();

    var range = function (arr, a, b, todo) {

        var i;

        if (Array.isArray(arr)) {

            for (i = a; i < b; i = i + 1) {

                todo(i, arr[i]);
            }

        } else {

            for (i = a; i < b; i = i + 1) {

                todo(i);
            }
        }


    };

    var run = function (timestamp) {

        range(runs, 0, count, function (i, index) {

            if (paused[i]) {

                return;
            }

            if (!start[i]) {

                start[i] = timestamp;
            }

            if (pause[i]) {

                times[i] = timestamp - start[i] + times[i];

                paused[i] = true;

                start[i] = null;

                isRun = false;

                return;
            }

            var t = timestamp - start[i] + times[i];

            var frame = frames[index];

            frame.draw((frame.time >= 0 && t >= frame.time) ? frame.time : t);

            if (frame.time >= 0 && t >= frame.time) {

                remove.push(index);

                frame.callback && frame.callback();
            }
        });
    };

    var loop = function () {

        if (isRun) {

            return;
        }

        isRun = true;

        var loop0 = function (timestamp) {

            if (count === 0) {

                isRun = false;

                return;
            }

            run(timestamp);

            _remove(remove);
            remove = [];

            if (!isRun) {

                return;
            }

            requestAnimationFrame(loop0);

        };

        requestAnimationFrame(loop0);
    };

    var template = function (todo) {

        return function (indexs) {

            if (!Array.isArray(indexs)) {

                indexs = [indexs];
            }

            range(indexs, 0, indexs.length, todo);
        }
    };

    var isRun = false;

    var at = 0;
    var frames = [];

    var count = 0;
    var runs = [];
    var times = [];
    var pause = [];
    var start = [];
    var paused = [];
    var remove = [];

    var _register = function (config) {

        frames[at] = config;

        at = at + 1;

        return at - 1;

    };

    var _detach = template(function (i, index) {

        frames[index] = null;

    });


    var __pause = function (i) {
        pause[i] = true;
    };

    var __resume = function (i) {

        pause[i] = false;
        paused[i] = false;
    };

    var __boot = function (index) {

        runs[count] = index;
        times[count] = 0;
        pause[count] = false;
        paused[count] = false;
        start[count] = null;

        count = count + 1;
    };

    var __remove = function (i) {

        runs.splice(i, 1);
        times.splice(i, 1);
        pause.splice(i, 1);
        paused.splice(i, 1);
        times.splice(i, 1);

        count = count - 1;
    };

    var _remove = template(function (i, index) {

        var temp = runs.indexOf(index);

        if (temp > -1) {

            __remove(temp);
        }

    });

    var _boot = template(function (i, index) {

        var temp = runs.indexOf(index);

        if (temp === -1) {

            __boot(index);

        } else {

            __resume(temp);
        }

        loop();

    });

    var _pause = template(function (i, index) {

        var temp = runs.indexOf(index);

        if (temp > -1) {

            __pause(temp);
        }

    });

    var _resume = template(function (i, index) {

        var temp = runs.indexOf(index);

        if (temp > -1) {

            __resume(temp);
        }

        loop();
    });


    var _bootAll = function () {

        _resumeAll();

        range(null, 0, at, function (i) {

            if (runs.indexOf(i) === -1) {

                __boot(i);
            }
        });

        loop();
    };

    var _pauseAll = function () {

        range(pause, 0, count, function (i, value) {

            if (!value) {

                __pause(i);

            }

        });
    };

    var _removeAll = function () {

        range(runs, 0, count, function (i, index) {

            __remove(i);

        });
    };

    var _resumeAll = function () {

        range(pause, 0, count, function (i, value) {

            if (value) {

                __resume(i);
            }
        });

        loop();
    };

    return {
        _boot: _boot,
        _pause: _pause,
        _resume: _resume,
        _remove: _remove,

        _pauseAll: _pauseAll,
        _bootAll: _bootAll,
        _resumeAll: _resumeAll,
        _removeAll: _removeAll,

        _register: _register,
        _detach: _detach
    };

})();

var action1 = Animate._register({

    time: -1, // 无限运行

    draw: function (t) {

        // 要执行的绘画
    },

    callback: function (t) {

        // 结束后的回调
    }

});