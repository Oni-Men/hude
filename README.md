# What's hude -筆-
hudeはHTML Canvasのためのラッパーです。メソッドチェーンが可能なのでシンプルな記述でキャンバスに描画できます！

# 従来の冗長な記述にイライラしませんか？僕はします。
hudeを開発した理由は単純で、よりシンプルな記述でキャンバスに描画したいと思ったからです。
例えばキャンバスの中央に円を描画したいとき、
従来通りならば、
```js
ctx.fillStyle = 'red';
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
ctx.closePath();
ctx.fill();
```
となりますが、hudeであれば
```js

Hude.mount(canvas).center().circle(radius).fill('red');

```
とするだけで描画できます！

# Usage -使い方-

## 新しいキャンバスでhudeを使いたい
widthとheightを指定できます。
指定しなかった場合はデフォルトの大きさ(300x150)です。
```js
const h = Hude.build(width, height);
```

### すでにあるキャンバスでhudeを使いたい
引数にはCSSセレクタを使用してください。
widthとheightを指定するとマウントするときに指定したサイズに変更します。
指定しなかった場合はサイズは変更されません。
```js
const h = Hude.mount('#canvas', width, height);
```

## その他のstaticメソッド

### 度からラジアン
```js
Hude.rad(degrees);
```

### ラジアンから度
```js
Hude.deg(radian);
```

## getterについて
操作対象のキャンバスのプロパティを取得するためのいくつかのゲッターが存在します。

### キャンバスそのものがほしい

```js
const h = Hude.build(100, 100);
const canvas = h.$c;
```

### キャンバスの大きさを調べたい？
```js
const h = Hude.build(123, 456);
const width = h.$w;
const height = h.$h;

console.log(width); 
console.log(height);
```
出力はこうなるよ
```
123
456
```
