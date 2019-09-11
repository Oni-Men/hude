/*
**  下記のサイトからお借りしたコードだよ
**  https://abicky.net/2012/07/24/080446/
**  (ちょっと改変あり)
*/

(function() {
    CanvasRenderingContext2D.prototype._transform = [1, 0, 0, 1, 0, 0];
    CanvasRenderingContext2D.prototype._transforms = [];

    CanvasRenderingContext2D.prototype.getTransform = function() {
        return this._transform;
    };

    CanvasRenderingContext2D.prototype.getScale = function() {
        return {
            x: this._transform[0],
            y: this._transform[3]
        };
    };

    CanvasRenderingContext2D.prototype.getTranslate = function() {
        return {
            x: this._transform[4],
            y: this._transform[5]
        };
    };

    CanvasRenderingContext2D.prototype.getRotate = function() {
        return 0; //This must be return a value of rotation;
    };

    const restore = CanvasRenderingContext2D.prototype.restore;
    CanvasRenderingContext2D.prototype.restore = function() {
        this._transform = this._transforms.pop() || [1, 0, 0, 1, 0, 0];
        restore.apply(this);
    }

    const save = CanvasRenderingContext2D.prototype.save;
    CanvasRenderingContext2D.prototype.save = function() {
        this._transforms.push(this._transform.slcie());
        save.apply(this);
    }

    const rotate = CanvasRenderingContext2D.prototype.rotate;
    CanvasRenderingContext2D.prototype.rotate = function(r) {
        const t = [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
        this._transform = multiplyTransform(this._transform, t);
        rotate.apply(this, arguments);
    };

    const scale = CanvasRenderingContext2D.prototype.scale;
    CanvasRenderingContext2D.prototype.scale = function(sx, sy) {
        this._transform = multiplyTransform(this._transform, [sx, 0, 0, sy, 0, 0]);
        scale.apply(this, arguments);
    };

    const translate = CanvasRenderingContext2D.prototype.translate;
    CanvasRenderingContext2D.prototype.translate = function(tx, ty) {
        this._transform = multiplyTransform(this._transform, [1, 0, 0, 1, tx, ty]);
        translate.apply(this, arguments);
    }

    const transform = CanvasRenderingContext2D.prototype.transform;
    CanvasRenderingContext2D.prototype.transform = function(a, b, c, d, e, f) {
        this._transform = multiplyTransform(this._transform, arguments);
        transform.apply(this, arguments);
    }

    const setTransform = CanvasRenderingContext2D.prototype.setTransform;
    CanvasRenderingContext2D.prototype.setTransform = function(a, b, c, d, e, f) {
        this._transform = Array.prototype.slice.apply(arguments);
        setTransform.apply(this, arguments);
    }

    const multiplyTransform = function(t1, t2) {
        return [
            t1[0] * t2[0] + t1[2] * t2[1],
            t1[1] * t2[0] + t1[3] * t2[1],
            t1[0] * t2[2] + t1[2] * t2[3],
            t1[1] * t2[2] + t1[3] * t2[3],
            t1[0] * t2[4] + t1[2] * t2[5] + t1[4],
            t1[1] * t2[4] + t1[3] * t2[5] + t1[5]
        ];
    };

})();

/*
**  拝借コードここまでだよ
*/

class OriginOrder {
    static get CENTER() {
        return 'center';
    }

    static get TOP_LEFT() {
        return 'top_left';
    }

    static get TOP_RIGHT() {
        return 'top_right';
    }

    static get BOTTOM_LEFT() {
        return 'bottom_left';
    }

    static get BOTTOM_RIGHT() {
        return 'bottom_right';
    }
}

class MouseButton {
    static get LEFT() {
        return 0;
    }
    
    static get RIGHT() {
        return 2;
    }

    static get MIDDLE() {
        return 1;
    }
}

class Hude {
    constructor(canvas) {
        this._c = canvas;
        this._g = this._c.getContext('2d');

        this.localOriginOrder = OriginOrder.CENTER;

        this._c.addEventListener('contextmenu', e => {
            e.preventDefault();
        }, false);
    }

    static build(w, h) {
        const c = document.createElement('canvas');

        if (w) c.width = w;
        if (h) c.height = h;

        return new Hude(c);
    }

    static mount(q, w, h){
        const c = document.querySelector(q);

        if(w) c.width = w;
        if(h) c.height = h;

        return new Hude(c);
    }

    static rad(deg) {
        return deg * Math.PI / 180;
    }

    static deg(rad) {
        return rad * 180 / Math.PI;
    }

    get $c() {
        return this._c;
    }

    get $w() {
        return this._c.width;
    }

    get $h() {
        return this._c.height;
    }

    set $w(v) {
        this.$w = v;
    }

    set $h(v) {
        this.$h = v;
    }

    setLocalOriginOrder(v) {
        this.localOriginOrder = v;

        return this;
    }

    applyOriginOrder(order,w, h) {
        switch (order) {
            case OriginOrder.CENTER:
                break;
            case OriginOrder.TOP_LEFT:
                this._g.translate(w, h);
                break;
            case OriginOrder.TOP_RIGHT:
                this._g.translate(-w, h);
                break;
            case OriginOrder.BOTTOM_LEFT:
                this._g.translate(w, -h);
                break;
            case OriginOrder.BOTTOM_RIGHT:
                this._g.translate(-w, -h);
                break;
            default:
                break;
        }
    }

    size(w, h) {
        this._c.width = w;
        this._c.height = h;

        return this;
    }

    center() {
        this._g.setTransform(1, 0, 0, 1, this.$w / 2, this.$h / 2);

        return this;
    }

    translate(x, y) {
        this._g.translate(x, y);

        return this;
    }

    rotate(r) {
        this._g.rotate(r);

        return this;
    }

    scale(sx, sy) {
        this._g.scale(sx, sy);

        return this;
    }

    fillStyle(s) {
        this._g.fillStyle = s;

        return this;
    }

    strokeStyle(s) {
        this._g.strokeStyle = s;

        return this;
    }

    fill(s) {
        const tmpStyle = this._g.fillStyle;

        if (s) this._g.fillStyle = s;
        this._g.fill();

        this._g.fillStyle = tmpStyle;
        
        return this;
    }

    stroke(s) {
        const tmpStyle = this._g.strokeStyle;

        if (s) this._g.strokeStyle = s;
        this._g.stroke();

        this._g.fillStyle = tmpStyle;

        return this;
    }

    circle(r, x, y) {
        this.applyOriginOrder(this.localOriginOrder, r, r);

        let _x = 0;
        let _y = 0;

        if(x !== undefined && y !== undefined) {
            _x = x;
            _y = y;
        }

        this._g.beginPath();
        this._g.arc(_x, _y, r, 0, 2 * Math.PI);
        this._g.closePath();

        return this;
    }

    rect(w, h) {
        this.applyOriginOrder(this.localOriginOrder, w / 2, h / 2);

        this._g.beginPath();
        this._g.rect(-w / 2, -h / 2, w, h);
        this._g.closePath();

        return this;
    }

    ellipse(rx, ry, rotation) {
        this.applyOriginOrder(this.localOriginOrder, rx, ry);

        this._g.beginPath();
        this._g.ellipse(0, 0, rx, ry, rotation, 0, 2 * Math.PI, 0);
        this._g.closePath();

        return this;
    }

    roundRect(w, h, r) {
        this.applyOriginOrder(this.localOriginOrder, w / 2, h / 2);

        if (r >= w / 2) {
            r = w / 2;
        }

        if (r >= h / 2) {
            r = h / 2;
        }

        this._g.beginPath();
        this._g.arc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 3 / 2);
        this._g.arc(w / 2 - r, -h / 2 + r, r, Math.PI * 3 / 2, 0); 
        this._g.arc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2);
        this._g.arc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI);
        this._g.closePath();

        return this;
    }

    clearWith(s) {
        this._g.resetTransform();
        this._g.fillStyle= s;
        this._g.fillRect(0, 0, this.$w, this.$h);

        return this;
    }

    font(f) {
        this._g.font = f;

        return this;
    }

    baseline(v) {
        this._g.textBaseline = v;

        return this;
    }

    textAlign(v) {
        this._g.textAlign = v;

        return this;
    }

    text(t, align, baseline, font, type) {
        const tmpAlign = this._g.textAlign;
        const tmpBaseline = this._g.textBaseline;
        const tmpFont = this._g.font;

        if (align) this._g.textAlign = align;
        if (baseline) this._g.textBaseline = baseline;
        if (font) this._g.font = font;

        if (!type || type == 'fill') {
            this._g.fillText(t, 0, 0);
        } else if(type == 'stroke') {
            this._g.strokeText(t, 0, 0);
        }

        this._g.textAlign = tmpAlign;
        this._g.textBaseline = tmpBaseline;
        this._g.font = tmpFont;

        return this;
    }

    image(img, w, h) {
        let _w = img.width;
        let _h = img.height;

        if (w !== undefined && h !== undefined) {
            _w = w;
            _h = h;
        }

        this._g.drawImage(img, -_w / 2, -_h / 2, _w, _h);

        return this;
    }

    lineWidth(v) {
        this._g.lineWidth = v;

        return this;
    }

    lineCap(v) {
        this._g.lineCap = v;

        return this;
    }

    lineDashOffset(v) {
        this._g.lineDashOffset = v;

        return this;
    }

    lineJoin(v) {
        this._g.lineJoin = v;

        return this;
    }

    lineOption(v) {
        if (!v) return this;

        this._g.lineCap = v.cap ? v.cap : 'butt';
        this._g.lineDashOffset = v.dashOffset ? v.dashOffset : 0.0;
        this._g.lineJoin = v.join ? v.join: 'miter';
        this._g.lineWidth = v.width ? v.width :  1.0;
        this._g.setLineDash(v.dash ? v.dash: []);

        return this;
    }

    lineDash(v) {
        this._g.setLineDash(v);

        return this;
    }

    alpha(v) {
        if(v == undefined) return this;

        this._g.globalAlpha = v;

        return this;
    }

    compositeOperation(v) {
        if(v == undefined) return this;

        this._g.globalCompositeOperation = v;

        return this;
    }

    begin() {
        this._g.beginPath();

        return this;
    }

    moveTo(x, y) {
        this._g.moveTo(x, y);

        return this;
    }

    lineTo(x, y) {
        this._g.lineTo(x, y);

        return this;
    }

    quadraticCurveTo(cpx, cpy, x, y) {
        this._g.quadraticCurveTo(cpx, cpy, x, y);

        return this;
    }

    close() {
        this._g.closePath();

        return this;
    }

    loop(t, callback) {
        for (let i = 0; i < t; i++) {
            callback(this, i);
        }

        return this;
    }

    //WARNING!!! DON'T USE!!!!
    blur(iteration) {
        let i = 0;
        
        const f = (src) => {
            const c = document.createElement('canvas');
            const g = Hude.build(src.width / 5, src.height / 5);
            
            g.center().scale(0.2, 0.2).$_g.drawImage(src, 0, 0, src.width, src.height, 0, 0, c.width, c.height);
            
            return c;
        }

        const blured = f(this.$c);

        this._g.setTransform(1, 0, 0, 1, 0, 0,);
        this._g.drawImage(blured, 0, 0, blured.width, blured.height, 0, 0, this.$w, this.$h);

        return this;
    }
    
    _addMouseListener(type, func, mb) {
        this.$c.addEventListener(type, e => {
            const b = e.target.getBoundingClientRect();
            const t = this._g.getTranslate();
            const x = e.clientX - b.left - t.x;
            const y = e.clientY - b.top - t.y;
            
            if (mb != undefined) {
                if (mb == e.button) {
                    func(x, y);
                }
            } else {
                func(x, y);
            }
        });
    }

    onClick(f, mb) {
        this._addMouseListener('click', f, mb);

        return this;
    }

    onMouseUp(f, mb) {
        this._addMouseListener('mouseup', f, mb);

        return this;
    }

    onMouseDonw(f, mb) {
        this._addMouseListener('mousedown', f, mb);

        return this;
    }

    onMouseMove(f) {
        this._addMouseListener('mousemove', f);

        return this;
    }
}