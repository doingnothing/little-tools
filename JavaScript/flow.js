// Created by schemer on 2015/9/30.

// simple flow control tool

var Flow = {};

Flow.serial = function (jobs, cb) {
    var count = jobs.length;
    var args = [];
    var at;

    var finish = function (content) {

        args[at] = content;

        at = at + 1;

        if (at === count) {
            cb.apply(null, args);
            return;
        }

        jobs[at].bind(null, finish).apply(null, args);
    };

    at = 0;
    jobs[at].bind(null, finish).apply(null, args);
};

Flow.parallel = function (jobs, cb) {
    var count = jobs.length;
    var args = [];
    var len = 0;

    var finish = function (i, content) {

        args[i] = content;

        len = len + 1;

        if (len === count) {
            cb.apply(null, args);
        }
    };

    for (var i = 0; i < count; i = i + 1) {
        jobs[i](finish, i);
    }
};

// test
var now = function () {
    return new Date().toLocaleString();
};

Flow.serial([
    // job1
    function (finish) {
        setTimeout(function () {

            // job doing here, sync doing

            console.log('job1 doing on ' + now());
            finish(1);
        }, 5000)
    },
    // job2
    function (finish, arg1) {
        setTimeout(function () {

            // job doing here, sync doing

            console.log('job2 doing on ' + now());
            finish(2);
        }, 3000);
    },
    // job3
    function (finish, arg1, arg2) {
        setTimeout(function () {

            // job doing here, sync doing

            console.log('job3 doing on ' + now());
            finish(3);
        }, 1000);
    }
], function (arg1, arg2, arg3) {
    console.log('finish serial.', arg1, arg2, arg3);
});

Flow.parallel([
    // job4
    function (finish, i) {
        setTimeout(function () {

            // job doing here, sync doing

            console.log('job4 doing on ' + now());
            finish(i, 4);
        }, 5000);
    },
    // job5
    function (finish, i) {
        setTimeout(function () {

            // job doing here, sync doing

            console.log('job5 doing on ' + now());
            finish(i, 5);
        }, 3000);
    },
    // job6
    function (finish, i) {
        setTimeout(function () {

            // job doing here, sync doing

            console.log('job6 doing on ' + now());
            finish(i, 6);
        }, 1000);
    }
], function (arg1, arg2, arg3) {
    console.log('finish parallel.', arg1, arg2, arg3);
});
