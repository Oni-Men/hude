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

/**
 * @classdesc 描画の原点を設定するための列挙型(疑似)
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

/**
 * @classdesc マウスボタンを定義する列挙型
 */
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

class TextOption {
    static get baseline() {
        return {
            Top: 'top',
            Hanging: 'hanging',
            Middle: 'middle',
            Alphabetic: 'alphabetic',
            Ideographic: 'ideographic',
            Bottom: 'bottom'
        };
    }

    static get Align() {
        return {
            Left: 'left',
            Right: 'right',
            Center: 'center',
            Start: 'start',
            End: 'end'
        };
    }

    static get DrawType() {
        return {
            Fill: 'fill',
            Stroke: 'stroke'
        };
    }
}

/**
 * @classdesc Hudeのメインクラス
 */
class Hude {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this._c = canvas;
        this._g = this._c.getContext('2d');

        if (!this._g) new Error('ブラウザはCanvas APIに対応していません');

        this.localOriginOrder = OriginOrder.CENTER;

        this._c.addEventListener('contextmenu', e => {
            e.preventDefault();
        }, false);
    }

    /**
     * 新しいキャンバスを作成しHudeインスタンスを返します。
     * 作成されたキャンバスはHudeインスタンスによって自動的にマウントされます。
     * 
     * @param {number} w 作成するキャンバスの幅
     * @param {number} h 作成するキャンバスの高さ
     * 
     * @returns {Hude} 作成されたHudeインスタンス
     */
    static build(w, h) {
        const c = document.createElement('canvas');

        if (w) c.width = w;
        if (h) c.height = h;

        return new Hude(c);
    }

    /**
     * 指定されたキャンバスをマウントした新しいHudeインスタンスを作成します。
     * 
     * @param {string} マウントしたいキャンバスのCSSセレクタ文字列
     * @param {number} w マウントしたキャンバスの新しい幅
     * @param {number} h マウントしたキャンバスの新しい高さ
     * 
     * @returns {Hude} 作成されたHudeインスタンス
     */
    static mount(q, w, h){
        const c = document.querySelector(q);

        if(w) c.width = w;
        if(h) c.height = h;

        return new Hude(c);
    }

    /**
     *角度をラジアンに変換します。 
     * @param {number} deg ラジアンに変換したい角度 
     * @returns {number} ラジアンの値
     */
    static rad(deg) {
        return deg * Math.PI / 180;
    }

    /**
     * ラジアンを角度に変換します
     * @param {number} rad 角度に変換したいラジアン
     * @returns {number} 角度の値
     */
    static deg(rad) {
        return rad * 180 / Math.PI;
    }

    /**
     * マウントしているキャンバスを返します
     */
    get $c() {
        return this._c;
    }

    /**
     * マウントしているキャンバスの幅を返します
     */
    get $w() {
        return this._c.width;
    }

    /**
     * マウントしているキャンバスの高さを返します
     */
    get $h() {
        return this._c.height;
    }

    /**
     * @param {number} v マウントしているキャンバスの幅
     */
    set $w(v) {
        this.$w = v;
    }

    /**
     * @param {number} v マウントしているキャンバスの高さ
     */
    set $h(v) {
        this.$h = v;
    }

    /**
     * 描画の原点を設定します
     * @param {OriginOrder} v 描画の原点
     */
    setLocalOriginOrder(v) {
        this.localOriginOrder = v;

        return this;
    }

    /**
     * 描画するオブジェクトのサイズと描画の原点に合わせてtranslateする
     * @param {OriginOrder} 描画の原点 
     * @param {number} 描画するオブジェクトの幅
     * @param {number} 描画するオブジェクトの高さ
     */
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

    /**
     * マウントしているキャンバスのサイズを設定する。
     * @param {number} w 
     * @param {number} h 
     */
    size(w, h) {
        this._c.width = w;
        this._c.height = h;

        return this;
    }

    /**
     * 全てのTransformをリセットし中央にtranslateする
     */
    center() {
        this._g.setTransform(1, 0, 0, 1, this.$w / 2, this.$h / 2);

        return this;
    }

    /**
     * 指定した x, y だけtranslateする
     * @param {number} x 
     * @param {number} y 
     */
    translate(x, y) {
        this._g.translate(x, y);

        return this;
    }

    /**
     * 指定した r だけrotateする
     * @param {number} ラジアンでの回転量
     */
    rotate(r) {
        this._g.rotate(r);

        return this;
    }

    /**
     * sx, syで拡大縮小を行う
     * @param {number} 拡大x 
     * @param {number} 拡大y
     */
    scale(sx, sy) {
        this._g.scale(sx, sy);

        return this;
    }

    /**
     * 塗りのスタイルを設定する
     * @param {string} 塗りのスタイル 
     */
    fillStyle(s) {
        this._g.fillStyle = s;

        return this;
    }

    /**
     * 線のスタイルを設定する
     * @param {string} 線のスタイル
     */
    strokeStyle(s) {
        this._g.strokeStyle = s;

        return this;
    }

    /**
     * 塗りのスタイルが指定された場合はそれを使用しパスを塗りつぶす。
     * ここで指定されたスタイルは一次的なものなのである。
     * ない場合は現在の塗りスタイルでパスを塗りつぶす。
     * @param {string} 塗りのスタイル
     */
    fill(s) {
        const tmpStyle = this._g.fillStyle;

        if (s) this._g.fillStyle = s;
        this._g.fill();

        this._g.fillStyle = tmpStyle;
        
        return this;
    }

    /**
    * 線のスタイルが指定された場合はそれを使用しパスの線を引く。
    * ここで指定されたスタイルは一次的なものなのである。
    * ない場合は現在の線スタイルでパスの線を引く。
     * @param {string} 線のスタイル 
     */
    stroke(s) {
        const tmpStyle = this._g.strokeStyle;

        if (s) this._g.strokeStyle = s;
        this._g.stroke();

        this._g.fillStyle = tmpStyle;

        return this;
    }

    /**
     * 半径と位置を指定し円のパスを描く
     * 開始角や終了角を指定したい場合はHude.arc()を使ってね
     * 
     * @param {number} 半径
     * @param {number} 座標x
     * @param {number} 座標y
     */
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

    /**
     * 半径、開始角、終了角、位置、描く方向
     * を指定し円のパスを描く
     * @param {number} 半径
     * @param {number} 開始角
     * @param {number} 終了角
     * @param {number} X座標
     * @param {number} Y座標
     * @param {boolean} 時計回りかどうか
     */
    arc(r, s, e, x, y, c) {

    }

    /**
     * 幅と高さを指定し矩形のパスを描く
     * @param {number} 幅
     * @param {number} 高さ
     */
    rect(w, h) {
        this.applyOriginOrder(this.localOriginOrder, w / 2, h / 2);

        this._g.beginPath();
        this._g.rect(-w / 2, -h / 2, w, h);
        this._g.closePath();

        return this;
    }

    /**
     * x半径、y半径、回転を指定し楕円のパスを描く
     * @param {number} x半径
     * @param {number} y半径
     * @param {number} 回転 
     */
    ellipse(rx, ry, rotation) {
        this.applyOriginOrder(this.localOriginOrder, rx, ry);

        this._g.beginPath();
        this._g.ellipse(0, 0, rx, ry, rotation, 0, 2 * Math.PI, 0);
        this._g.closePath();

        return this;
    }

    /**
     * 幅、高さ、半径を指定し、丸みを帯びた矩形のパスを描く
     * @param {number} 幅
     * @param {number} 高さ
     * @param {number} 半径
     */
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

    /**
     * 指定されたスタイルでキャンバスを全て塗りつぶす
     * @param {string} 塗りつぶしのスタイル 
     */
    clearWith(s) {
        this._g.resetTransform();
        this._g.fillStyle= s;
        this._g.fillRect(0, 0, this.$w, this.$h);

        return this;
    }

    /**
     * フォントを設定する
     * @param {string} フォント
     */
    font(f) {
        this._g.font = f;

        return this;
    }

    /**
     * ベースラインを設定する
     * @param {string} ベースライン
     */
    baseline(v) {
        this._g.textBaseline = v;

        return this;
    }

    /**
     * テキストアラインを設定する
     * @param {stirng} テキストアライン 
     */
    textAlign(v) {
        this._g.textAlign = v;

        return this;
    }

    /**
     * 指定した文字列でテキストを描画します。
     * 引数に指定したオプションは一時的なものです。
     * 以降の描画には引き継がれません。
     * 
     * @param {string} 描画したい文字列 
     * @param {TextOption.Align} テキストアライン 
     * @param {TextOption.Baseline} ベースライン 
     * @param {string} font 
     * @param {TextOption.DrawType} 描画のタイプ 
     */
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

    /**
     * 指定された画像を描画します。
     * 幅と高さが指定された場合はそれぞれに合わせて拡大縮小されます。
     * 
     * @param {Image} 画像
     * @param {number} 幅
     * @param {number} 高さ
     */
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
    
    _addMouseListener(type, func, mb) {
        this.$c.addEventListener(type, e => {
            const b = e.target.getBoundingClientRect();
            const t = this._g.getTranslate();
            const x = e.clientX - b.left - t.x;
            const y = e.clientY - b.top - t.y;
            
            if (mb != undefined) {
                if (mb == e.button) {
                    func(x, y, e);
                }
            } else {
                func(x, y, e);
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

    onMouseOver(f) {
        this._addMouseListener('mouseover', f);

        return this;
    }

    onMouseOut(f) {
        this._addMouseListener('mouseout', f);

        return this;
    }

    onMouseWheel(f) {
        this._addMouseListener('mousewheel', f);

        return this;
    }

    onKeyUp(f) {
        this._addMouseListener('keyup', f);

        return this;
    }

    onKeyDown(f) {
        this._addMouseListener('keydown', f);

        return this;
    }
}