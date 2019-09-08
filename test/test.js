const hude = Hude.mount("#hude").size(500, 500);

let r = 0;

(function() {

    hude.clearWith('#fff');

    hude.center().circle(100).stroke('red');

    window.requestAnimationFrame(arguments.callee);
})();