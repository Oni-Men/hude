const hude = Hude.mount("#hude").size(500, 500);

document.body.appendChild(hude.$c);

let r = 0;

(function() {

    hude.clearWith('#fff');

    hude.lineWidth(1).grid(5, 5).stroke('black');

    hude.lineWidth(3);
    hude.center().roundRect(100, 100, 10).stroke('green');

    window.requestAnimationFrame(arguments.callee);
})();