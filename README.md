# Waht's hude -筆-
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
