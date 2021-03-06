//ngtimeago.js
'use strict';

var catalyst = angular.module('ngtimeago', []);
catalyst.filter('timeago', function() {
    return function(input, p_allowFuture) {

        var substitute = function (stringOrFunction, number, strings) {
                var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                var value = (strings.numbers && strings.numbers[number]) || number;
                return string.replace(/%d/i, value);
            },
            nowTime = (new Date()).getTime(),
            date = (new Date(input)).getTime(),
        //refreshMillis= 6e4, //A minute
            allowFuture = p_allowFuture || false,
            strings= {
                prefixAgo: '',
                prefixFromNow: '',
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years"
            },
            dateDifference = nowTime - date,
            words,
            seconds = Math.abs(dateDifference) / 1000,
            minutes = seconds / 60,
            hours = minutes / 60,
            days = hours / 24,
            years = days / 365,
            separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,


            prefix = strings.prefixAgo,
            suffix = strings.suffixAgo;

        if (allowFuture) {
            if (dateDifference < 0) {
                prefix = strings.prefixFromNow;
                suffix = strings.suffixFromNow;
            }
        }

        words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
        seconds < 90 && substitute(strings.minute, 1, strings) ||
        minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
        minutes < 90 && substitute(strings.hour, 1, strings) ||
        hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
        hours < 42 && substitute(strings.day, 1, strings) ||
        days < 30 && substitute(strings.days, Math.round(days), strings) ||
        days < 45 && substitute(strings.month, 1, strings) ||
        days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
        years < 1.5 && substitute(strings.year, 1, strings) ||
        substitute(strings.years, Math.round(years), strings);
        //console.log(prefix+words+suffix+separator);
        prefix.replace(/ /g, '')
        words.replace(/ /g, '')
        suffix.replace(/ /g, '')
        return (prefix+' '+words+' '+suffix+' '+separator);

    };
});


//angular-timer.min.js

/**
 * angular-timer - v1.2.0 - 2014-12-15 6:34 PM
 * https://github.com/siddii/angular-timer
 *
 * Copyright (c) 2014 Siddique Hameed
 * Licensed MIT <https://github.com/siddii/angular-timer/blob/master/LICENSE.txt>
 */
var timerModule=angular.module("timer",[]).directive("timer",["$compile",function(a){return{restrict:"EA",replace:!1,scope:{interval:"=interval",startTimeAttr:"=startTime",endTimeAttr:"=endTime",countdownattr:"=countdown",finishCallback:"&finishCallback",autoStart:"&autoStart",maxTimeUnit:"="},controller:["$scope","$element","$attrs","$timeout",function(b,c,d,e){function f(){b.timeoutId&&clearTimeout(b.timeoutId)}function g(){void 0!==d.startTime&&(b.millis=new Date-new Date(b.startTimeAttr)),b.maxTimeUnit&&"day"!==b.maxTimeUnit?"second"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3),b.minutes=0,b.hours=0,b.days=0,b.months=0,b.years=0):"minute"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4),b.hours=0,b.days=0,b.months=0,b.years=0):"hour"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5),b.days=0,b.months=0,b.years=0):"month"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24%30),b.months=Math.floor(b.millis/36e5/24/30),b.years=0):"year"===b.maxTimeUnit&&(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24%30),b.months=Math.floor(b.millis/36e5/24/30%12),b.years=Math.floor(b.millis/36e5/24/365)):(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24),b.months=0,b.years=0),b.secondsS=1===b.seconds?"":"s",b.minutesS=1===b.minutes?"":"s",b.hoursS=1===b.hours?"":"s",b.daysS=1===b.days?"":"s",b.monthsS=1===b.months?"":"s",b.yearsS=1===b.years?"":"s",b.secondUnit=function(a,c){return 1===b.seconds?a?a:"second":c?c:"seconds"},b.minuteUnit=function(a,c){return 1===b.minutes?a?a:"minute":c?c:"minutes"},b.hourUnit=function(a,c){return 1===b.hours?a?a:"hour":c?c:"hours"},b.dayUnit=function(a,c){return 1===b.days?a?a:"day":c?c:"days"},b.monthUnit=function(a,c){return 1===b.months?a?a:"month":c?c:"months"},b.yearUnit=function(a,c){return 1===b.years?a?a:"year":c?c:"years"},b.sseconds=b.seconds<10?"0"+b.seconds:b.seconds,b.mminutes=b.minutes<10?"0"+b.minutes:b.minutes,b.hhours=b.hours<10?"0"+b.hours:b.hours,b.ddays=b.days<10?"0"+b.days:b.days,b.mmonths=b.months<10?"0"+b.months:b.months,b.yyears=b.years<10?"0"+b.years:b.years}"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),b.autoStart=d.autoStart||d.autostart,c.append(0===c.html().trim().length?a("<span>{{millis}}</span>")(b):a(c.contents())(b)),b.startTime=null,b.endTime=null,b.timeoutId=null,b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>=0?parseInt(b.countdownattr,10):void 0,b.isRunning=!1,b.$on("timer-start",function(){b.start()}),b.$on("timer-resume",function(){b.resume()}),b.$on("timer-stop",function(){b.stop()}),b.$on("timer-clear",function(){b.clear()}),b.$on("timer-reset",function(){b.reset()}),b.$on("timer-set-countdown",function(a,c){b.countdown=c}),b.start=c[0].start=function(){b.startTime=b.startTimeAttr?new Date(b.startTimeAttr):new Date,b.endTime=b.endTimeAttr?new Date(b.endTimeAttr):null,b.countdown||(b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>0?parseInt(b.countdownattr,10):void 0),f(),h(),b.isRunning=!0},b.resume=c[0].resume=function(){f(),b.countdownattr&&(b.countdown+=1),b.startTime=new Date-(b.stoppedTime-b.startTime),h(),b.isRunning=!0},b.stop=b.pause=c[0].stop=c[0].pause=function(){var a=b.timeoutId;b.clear(),b.$emit("timer-stopped",{timeoutId:a,millis:b.millis,seconds:b.seconds,minutes:b.minutes,hours:b.hours,days:b.days})},b.clear=c[0].clear=function(){b.stoppedTime=new Date,f(),b.timeoutId=null,b.isRunning=!1},b.reset=c[0].reset=function(){b.startTime=b.startTimeAttr?new Date(b.startTimeAttr):new Date,b.endTime=b.endTimeAttr?new Date(b.endTimeAttr):null,b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>0?parseInt(b.countdownattr,10):void 0,f(),h(),b.isRunning=!1,b.clear()},c.bind("$destroy",function(){f(),b.isRunning=!1}),b.countdownattr?(b.millis=1e3*b.countdownattr,b.addCDSeconds=c[0].addCDSeconds=function(a){b.countdown+=a,b.$digest(),b.isRunning||b.start()},b.$on("timer-add-cd-seconds",function(a,c){e(function(){b.addCDSeconds(c)})}),b.$on("timer-set-countdown-seconds",function(a,c){b.isRunning||b.clear(),b.countdown=c,b.millis=1e3*c,g()})):b.millis=0,g();var h=function(){b.millis=new Date-b.startTime;var a=b.millis%1e3;return b.endTimeAttr&&(b.millis=b.endTime-new Date,a=b.interval-b.millis%1e3),b.countdownattr&&(b.millis=1e3*b.countdown),b.millis<0?(b.stop(),b.millis=0,g(),void(b.finishCallback&&b.$eval(b.finishCallback))):(g(),b.timeoutId=setTimeout(function(){h(),b.$digest()},b.interval-a),b.$emit("timer-tick",{timeoutId:b.timeoutId,millis:b.millis}),void(b.countdown>0?b.countdown--:b.countdown<=0&&(b.stop(),b.finishCallback&&b.$eval(b.finishCallback))))};(void 0===b.autoStart||b.autoStart===!0)&&b.start()}]}}]);"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports=timerModule);
