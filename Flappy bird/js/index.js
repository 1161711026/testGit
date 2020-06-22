var birdgame = {
    skyPosition : 0,
    skyTemp : 2,
    birdTop : 220,
    play: false,
    fontColor : 'blue',
    birdGravity : 0,
    pipeArr : [],
    pipeLength : 7,
    score: 0,
    pipeLast: 6,
    scoreArr: [],

    //入口
    init: function(){
        this.initDate();
        this.animate();
        this.start();

        if(sessionStorage.getItem('play')){
            this.Start();
        }
    },
    //获取DOM操作所需元素
    initDate: function(){
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oReStart = this.el.getElementsByClassName('reStart')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScoreEnd = this.el.getElementsByClassName('score-end')[0];
        this.oRank = document.getElementsByClassName('list')[0];
        this.scoreArr = this.getScore();
        console.log(this.oRank);

    },
    //获取分数
    getScore : function(){
        var scoreArr = getLocal('score');  
        return scoreArr ? scoreArr : [];
    },
    //动画
    animate: function(){
        var self = this;
        var count = 0;
        this.time = setInterval(function(){
            ++ count;
            self.skyMove();
             if(count % 10 == 0){
                    if(!self.play){
                        self.startColor();
                        self.birdMove(count);
                    }
            }
            if(self.play){
                self.gravity();
                self.pipeMove();
            }
        },30);
    },
    //天空动画
    skyMove: function(){
        this.skyPosition -= this.skyTemp;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';
    },
    //鸟动画 
    birdMove: function(count){
        this.birdTop = this.birdTop === 220 ? 270 : 220;
        this.oBird.style.top = this.birdTop + 'px';
        this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
    },
    //start颜色变换
     startColor : function(){
        var tempColor = this.fontColor;
        this.fontColor = this.fontColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove("start-" + tempColor);
        this.oStart.classList.add("start-" + this.fontColor);
     },
     //重力
     gravity : function(){
        this.birdGravity ++;
        this.birdTop += this.birdGravity;
        this.oBird.style.top = this.birdTop + 'px';
        this.Judge();
        this.scoreAdd();
     },
     //碰撞检测
     Judge: function(){
        this.edgeJudge();
        this.pipeJudge();
     },
     //边界检测
     edgeJudge: function(){
        if(this.birdTop > 570 || this.birdTop < 0){
            this.overgame();
        }
     },
     //柱子碰撞检测
     pipeJudge: function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;
        if((pipeX <= 95 && pipeX >=13) && (birdY <= pipeY[0] || this.birdTop >= pipeY[1])){
            this.overgame();
        }
     },
     //增加分数
     scoreAdd: function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;

        if(pipeX < 13){
            this.oScore.innerText = ++ this.score;
        }
     },
     //点击上浮
     rising: function(){
        var self = this;
        this.el.onclick = function(e){
            if(!e.target.classList.contains('start')){
                self.birdGravity = -10;
            }
        }
     },
     //创建柱子 
     pipe : function(x){
        var upHeight = (50 + Math.floor(Math.random() * 175));
        var downHeight = 600 - 150 -upHeight;
        var oUpPipe = createEle('div', ['pipe', 'upPipe'], {
        height: upHeight + 'px',
        left: x + 'px',
        })

        var oDownPipe = createEle('div', ['pipe', 'downPipe'], {
        height: downHeight + 'px',
        left: x + 'px',
         })

        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);

        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y : [upHeight,upHeight+150],
          })
     },
     //柱子动画
     pipeMove : function(){
        for(let i = 0; i < this.pipeLength; i++){
            var upPipe = this.pipeArr[i].up;
            var downPipe = this.pipeArr[i].down;
            var x = upPipe.offsetLeft - this.skyTemp;

            if(x < -52){
                var pipeLastLeft = this.pipeArr[this.pipeLast].up.offsetLeft + 300;
                upPipe.style.left = pipeLastLeft + 'px';
                downPipe.style.left = pipeLastLeft + 'px';
                this.pipeLast = ++ this.pipeLast % this.pipeLength;
                continue;
            }
            upPipe.style.left = x + 'px';
            downPipe.style.left = x + 'px';
        }
     },
     //添加点击开始事件
     start : function(){
       var self = this;
      
       this.oStart.onclick = function(){
           self.Start();
       }
     },
     //游戏
     Start : function(){
        var self = this;
        self.play = !self.play;
        self.skyTemp = 5;
        self.oBird.style.left = '80px';
        self.birdTop = 270;
        self.oBird.style.transition = 'none';
        self.oBird.style.top = self.birdTop + 'px';
        self.oStart.style.display = 'none';
        self.oScore.style.display = 'block';
        self.rising();
     
        for(let i = 1; i <= self.pipeLength; i++){
            self.pipe(300 * i);
        }
     },
     //添加分数
     putScore: function(){
        this.scoreArr.push({
            score : this.score,
            time: this.getTime(),
        });
        setLocal("score",this.scoreArr);
     },
     //getTime
     getTime: function(){
        var d = new Date();
        var year = d.getFullYear();
        var month = zero(d.getMonth() + 1);
        var day = zero(d.getDate());
        var hour = zero(d.getHours());
        var minute = zero(d.getMinutes());
        var second = zero(d.getSeconds());

        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
     },
     //结束游戏
     overgame : function(){
        this.play = 'false';
        clearInterval(this.time);
        this.oBird.style.display = 'none';
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oScore.style.display = 'none';
        this.oScoreEnd.innerText = this.score;
        this.putScore(); 
        this.getRank();
        this.re();
    },
    reStart: function(){
        this.Start();
    },
    // 重新开始 
    re: function() {
        var self = this;
        this.oReStart.onclick = function(){
            sessionStorage.setItem('play',true);
            window.location.reload();
        }
    },
    //显示分数
    getRank: function(){
        var length = this.scoreArr.length > 8 ? 8 : this.scoreArr.length;
        var template = '';
        console.log(this.scoreArr);
        this.scoreArr.sort(function(a,b){
            return  b.score - a.score;
         });
        var rank = '';
        for(let i = 0; i < length ;i ++){
            switch(i){
                case 0: rank = 'one';break;
                case 1: rank = 'tow';break;
                case 2: rank = "three";break;
            }
        
            template += '' + 
            ` <li class='item'>
            <span class="item-rank ${rank}">${i + 1}</span>
            <span class="item-score">${this.scoreArr[i].score}</span>
            <span class="item-time">${this.scoreArr[i].time}</span>
           </li>`
           rank = '';
        }
     
        this.oRank.innerHTML = template;
    },
};
birdgame.init();
//构造元素函数
function createEle(eleName,classArr,styleObj){
    var dom = document.createElement(eleName);

    for(let i = 0; i < classArr.length ; i++){
        dom.classList.add(classArr[i]);
    }

    for(var  key in styleObj){
       
        dom.style[key] = styleObj[key];
    }
    return dom;
}
//上传数据
function setLocal(key,value){
    if(typeof value === 'object' && typeof value !== null){
        value = JSON.stringify(value);
    }
    localStorage.setItem(key,value);
}
//获取数据
function getLocal(key){
    var value = localStorage.getItem(key);
    if(value === null){
        return null;
    }
    if(value[0] === '[' || value[0] === '{'){
        return JSON.parse(value);
    }
    return value;
}
//补0
function zero(value){
    if(value < 10){
        return '0' + value ;       
    }
    return value;
}