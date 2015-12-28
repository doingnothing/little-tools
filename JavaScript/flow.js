// Created by schemer on 2015/9/30.

// simple flow control tool

var Flow = {};

// usage: Flow.serial
Flow.serial(
    [
        function (push) {
            // do job1

            var finish = doJob1();

            if (finish) {

                // finish job1, then do job2
                push(false, job1Arg);
            } else {

                // skip the rest job2, job3
                push(true);
            }
        },

        function (push) {
            // do job2

            var finish = doJob2();

            if (finish) {

                // finish job2 then do job3
                push(false, job1Arg);
            } else {

                // skip the rest job3
                push(true);
            }
        },

        function (push) {
            // do job3

            var finish = doJob3();

            if (finish) {

                // finish all jobs, call callback
                push(false, job1Arg);
            } else {

                // skip the rest job
                push(true);
            }
        }
    ],

    function (cancel, job1Arg, job2Arg, job3Arg) {

        if (cancel) {

            // do with cancel

        } else {

            // do with normal
        }
    }
);

Flow.serial = function (jobs, cb) {

    var count = jobs.length;

    var args = [false];

    var at = 1;

    var push = function (cancel, module) {

        if (cancel) {

            args = [true];

            cb.apply(null, args);

            return;
        }

        args[at] = module;

        at = at + 1;

        if (at > count) {

            cb.apply(null, args);

        } else {

            jobs[at - 1](push);
        }
    };

    jobs[0](push);

};

// usage: Flow.parallel
Flow.parallel(
    [
        function (push) {

            doAsynTask(function () {

                // finish asyn task1
                push(false, task1Arg);


            });
        },
        function (push) {

            doAsynTask(function () {

                // finish asyn task2
                push(false, task2Arg);
            });
        }
    ],

    function (cancel, task1Arg, task2Arg) {

        // when all tasks finish

    }
);

Flow.parallel = function (jobs, cb) {

    var count = jobs.length;

    var args = [false];

    var len = 0;

    var push = function (i) {

        return function (cancel, module) {

            if (len === -1) {

                return;
            }

            if (cancel) {

                args = [true];

                cb.apply(null, args);

                args = [];

                len = -1;

                return;
            }

            args[i] = module;

            len = len + 1;

            if (len === count) {

                cb.apply(null, args);
            }
        };
    };

    for (var i = 1; i <= count; i = i + 1) {

        jobs[i - 1](push(i), i);
    }
};
