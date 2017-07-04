# progress-chart

进度圆 百分比 动画

安装
npm install 

npm run start

//初始化

let box = $('#box').eq(0);
<br>
let m = new ProgressChart(box, {
  //保留小数位
  "decimal": "0",
  //转速 参数
  "speed": "50"
});
<br>
 m.setValue(20, 50);



