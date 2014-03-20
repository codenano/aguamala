function PuyoDot(w, h) {
    var STAGE_W = w-10;
    var STAGE_H = h;
var Particle = function() {
  this.x = 0;    // 位置
  this.y = 0;
  this.vx = 0;    // 速度
  this.vy = 0;
  this.ax = 0;    // 加速度=力    TOTO:最後まで意味無かったら消す
  this.ay = 0;
  
  this.radian = 0;    // 向き
  this.vr = 0;    // 向き速度
  
  this.color = 0x000000;    // パーティクルの色。右下の枠の色
  this.connect = [true, true, true, true];    // パーティクルの接続状態を毎回チェックしなくていいように、保持しておく
  return this;
  };
    // パーティクル
    this._particleList = [];    //:Array :Particle
    //this._particleDistance:int;
    //this._w;
    //this._h;
    
    // ドラッグ
    this._dragIdX = -1;
    this._dragIdY = -1;
    
    var _WALL_LEFT = 0;
    var _WALL_RIGHT = w-10;
    var _GROUND_LINE = h;
    
    var _DOT_CONNECT_MAX = 30;
    var _DERIVATION = 10;    // 計算の分割数。
    var _MAP_SIZE = 300;
    
    var _PI = Math.PI;
    var _PI2 = 2.0 * _PI;
    var _RADIAN90    = _PI * 0.5;
    var _RADIAN180    = _PI * 1.0;
    var _RADIAN270    = _PI * -0.5;
    var _TO_DEGREE    = 180 / _PI;
    
    var _GRAVITY = 0.08 / _DERIVATION;
    var _ROTATION_RATE = 0.05 / _DERIVATION;    // 自身バネ（根元）
    var _VERTICAL_RATE = 0.2 / _DERIVATION;    // ターゲットバネ（さきっぽ）
    var _MOUSE_PULL_RATE = 2.0 / _DERIVATION;
    
    var _FRICTION = 0.3 / _DERIVATION;
    var _ROTATE_FRICTION = 1 - 0.2 / _DERIVATION;
    var _MOUSE_ROTATE_FRICTION = 1 - 0.8 / _DERIVATION;
    var _MOUSE_MOVE_FRICTION = 1 - 0.5 / _DERIVATION;
    var _GROUND_FRICTION = 1 - 0.2 / _DERIVATION;
    
    //private var _dotMap:DotMap;
    //private var drawFunction:Function;
    
    this.init = function(dotMap, drawFunction) {    // ここから開始
        this._dotMap = dotMap;
        this.drawFunction = drawFunction;
        
        var _w = this._dotMap.w+1;
        var _h = this._dotMap.h+1;
        this._particleDistance = _MAP_SIZE / _w;
        var tmpBaceX = (STAGE_W - _MAP_SIZE) /4;
        var tmpBaceY = 20;
        var x, y;
        var particle;
        // 生成
        for (x = 0; x < _w; x++) {
            this._particleList[x] = [];
            for (y = 0; y < _h; y++) {
                particle = new Particle();
                var tmpNearDotList = [this._dotMap.isDot(x, y),     this._dotMap.isDot(x-1, y),
                                      this._dotMap.isDot(x-1, y-1), this._dotMap.isDot(x, y-1)];
                particle.connect[0] = (tmpNearDotList[0] || tmpNearDotList[3]) && x < _w-1;    // 右
                particle.connect[1] = (tmpNearDotList[1] || tmpNearDotList[0]) && y < _h-1;    // 下
                particle.connect[2] = (tmpNearDotList[2] || tmpNearDotList[1]) && 0 < x;    // 左
                particle.connect[3] = (tmpNearDotList[3] || tmpNearDotList[2]) && 0 < y;    // 上
                
                if (!particle.connect[0] && !particle.connect[1] && !particle.connect[2] && !particle.connect[3]){
                    this._particleList[x][y] = null;
                    continue;
                }
                particle.color = this._dotMap.getColor(x, y);
                particle.x = tmpBaceX + this._particleDistance * x + Math.random()*3;
                particle.y = tmpBaceY + this._particleDistance * y;
                this._particleList[x][y] = particle;
            }
        }
        for (x = 0; x < _w; x++){
            for (y = 0; y < _h; y++){
                particle = this._particleList[x][y];
                if (particle === null) continue;
                particle.connect[4] = particle.connect[0] && this._particleList[x+1][y].connect[0];    // 右右
                particle.connect[5] = particle.connect[1] && this._particleList[x][y+1].connect[1];    // 下下
                particle.connect[6] = particle.connect[2] && this._particleList[x-1][y].connect[2];    // 左左
                particle.connect[7] = particle.connect[3] && this._particleList[x][y-1].connect[3];    // 上上
            }
        }
    };

    // ドラッグ
    this.startBornDrag = function(mouseX, mouseY) {
        var _w = this._dotMap.w+1;
        var _h = this._dotMap.h+1;
        var x, y;
        for (x = 0; x < _w; x++){
            for (y = 0; y < _h; y++){
                var particle = this._particleList[x][y];
                if (particle === null) continue;
                if (Math.pow(particle.x - mouseX, 2) + Math.pow(particle.y - mouseY, 2) < Math.pow(this._particleDistance*0.8, 2)) {
                    this._dragIdX = x;
                    this._dragIdY = y;
                    return;
                }
            }
        }
    };
    this.endBornDrag = function() {
        this._dragIdX = -1;
        this._dragIdY = -1;
    };
        
    // フレーム挙動
    this.frame = function(mouseX, mouseY) {
        var _w = this._dotMap.w+1;
        var _h = this._dotMap.h+1;
        for (var i = 0; i < _DERIVATION; i++){
            this.rotate();
            this.force(mouseX, mouseY);
            this.move();
        }
        this.drawFunction(this._particleList, this._dotMap, _h, _w);
        //main.drawPparticles(_particleList, _dotMap, _h, _w);    // 描画処理
    };
        
    // ボーンの向きを決定する
    this.rotate = function() {
        var _w = this._dotMap.w+1;
        var _h = this._dotMap.h+1;
        var x, y;
        for (x = 0; x < _w; x++){
            for (y = 0; y < _h; y++){
                var particle = this._particleList[x][y];
                if (particle === null) continue;
                var subParticle;
                if (particle.connect[0]){    // 右パーティクルに対する処理
                    subParticle = this._particleList[x+1][y];
                    calcConnectRForce(particle, subParticle, 0);
                    calcConnectRForce(subParticle, particle, _RADIAN180);
                }
                if (particle.connect[1]){    // 下パーティクルに対する処理
                    subParticle = this._particleList[x][y+1];
                    calcConnectRForce(particle, subParticle, _RADIAN90);
                    calcConnectRForce(subParticle, particle, _RADIAN270);
                }
                if (particle.connect[4]){    // 右右パーティクルに対する処理
                    subParticle = this._particleList[x+2][y];
                    calcConnectRForce(particle, subParticle, 0);
                    calcConnectRForce(subParticle, particle, _RADIAN180);
                }
                if (particle.connect[5]){    // 下下パーティクルに対する処理
                    subParticle = this._particleList[x][y+2];
                    calcConnectRForce(particle, subParticle, _RADIAN90);
                    calcConnectRForce(subParticle, particle, _RADIAN270);
                }
                if (x == this._dragIdX && y == this._dragIdY) particle.vr *= _MOUSE_ROTATE_FRICTION;
                else particle.vr *= _ROTATE_FRICTION;    // 摩擦
                
                particle.radian += particle.vr;
            }
        }
    };
    // 接続されたパーツの回転方向を計算する
    function calcConnectRForce(particle, targetParticle, connectAngle) {
        var angle = Math.atan2(targetParticle.y - particle.y, targetParticle.x - particle.x);
        particle.vr += ajustRadian(angle - (connectAngle + particle.radian)) * _ROTATION_RATE;
    }
    
    this.force = function(mouseX, mouseY) {
        var _w = this._dotMap.w+1;
        var _h = this._dotMap.h+1;

        var x, y;
        for (x = 0; x < _w; x++){
            for (y = 0; y < _h; y++){
                var particle = this._particleList[x][y];
                if (particle === null) continue;
                var subParticle;
                if (particle.connect[0]){    // 右パーティクルに対する処理
                    subParticle = this._particleList[x+1][y];
                    calcConnectFoce(particle, subParticle, 0, this._particleDistance);
                    calcConnectFoce(subParticle, particle, _RADIAN180, this._particleDistance);
                }
                if (particle.connect[1]){    // 下パーティクルに対する処理
                    subParticle = this._particleList[x][y+1];
                    calcConnectFoce(particle, subParticle, _RADIAN90, this._particleDistance);
                    calcConnectFoce(subParticle, particle, _RADIAN270, this._particleDistance);
                }
                if (particle.connect[4]){    // 右右パーティクルに対する処理
                    subParticle = this._particleList[x+2][y];
                    calcConnectFoce(particle, subParticle, 0, this._particleDistance*2);
                    calcConnectFoce(subParticle, particle, _RADIAN180, this._particleDistance*2);
                }
                if (particle.connect[5]){    // 下下パーティクルに対する処理
                    subParticle = this._particleList[x][y+2];
                    calcConnectFoce(particle, subParticle, _RADIAN90, this._particleDistance*2);
                    calcConnectFoce(subParticle, particle, _RADIAN270, this._particleDistance*2);
                }
                particle.ay += _GRAVITY;
                if (this._dragIdX == x && this._dragIdY == y){    // マウスで引っ張る
                    var point = pullForce(particle.x, particle.y, mouseX, mouseY, _MOUSE_PULL_RATE);
                    particle.ax += point.x;
                    particle.ay += point.y;
                    particle.vx *= _MOUSE_MOVE_FRICTION;
                    particle.vy *= _MOUSE_MOVE_FRICTION;
                }
            }
        }
    };
    // 接続された２パーツの力を計算する
    function calcConnectFoce(particle, targetParticle, connectAngle, distance) {
        var toAngle = ajustRadian(connectAngle + particle.radian);
        var toX = particle.x + Math.cos(toAngle) * distance;
        var toY = particle.y + Math.sin(toAngle) * distance;
        var ax = (targetParticle.x - toX) * _VERTICAL_RATE;
        var ay = (targetParticle.y - toY) * _VERTICAL_RATE;
        particle.ax += ax;
        particle.ay += ay;
        targetParticle.ax -= ax;
        targetParticle.ay -= ay;
    }
    // ポイントx1 y1を、ポイントx2 y2へ、係数rateだけ移動させる場合の、XYの力を返す
    function pullForce(x1, y1, x2, y2, rate) {
        var point = {};
        var distance = calcDistance(x1, y1, x2, y2);
        
        var angle = Math.atan2(y2 - y1, x2 - x1);
        point.x = Math.cos(angle) * distance * rate;
        point.y = Math.sin(angle) * distance * rate;
        return point;
    }
    // ポイントx1 y1から、ポイントx2 y2までの距離
    function calcDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    }
    // radian角度を、-π～πの範囲に修正する
    function ajustRadian(radian) {
        return radian - _PI2 * Math.floor( 0.5 + radian / _PI2);
    }

    this.move = function() {
        var _w = this._dotMap.w+1;
        var _h = this._dotMap.h+1;

        var x, y;
        for (x = 0; x < _w; x++){
            for (y = 0; y < _h; y++){
                var particle = this._particleList[x][y];
                if (particle === null) continue;
                
                // 空気抵抗 TODO:速度に対しての処理で良いはず。
                particle.ax += -_FRICTION * particle.vx;
                particle.ay += -_FRICTION * particle.vy;
                
                // 速度、位置への反映
                particle.vx += particle.ax;
                particle.vy += particle.ay;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.ax = 0;
                particle.ay = 0;    // 力をクリア
                
                // 壁チェック
                if (0 < particle.vy && _GROUND_LINE < particle.y){
                    particle.y = _GROUND_LINE;
                    particle.vy *= -0.8;
                    if (particle.vy < -50) particle.vy = -50;
                    particle.vx *= _GROUND_FRICTION;
                }
                if (particle.vx < 0 && particle.x < _WALL_LEFT){
                    particle.x = _WALL_LEFT;
                    particle.vx = 0;
                    particle.vy *= _GROUND_FRICTION;
                }else if (0 < particle.vx && _WALL_RIGHT < particle.x){
                    particle.x = _WALL_RIGHT;
                    particle.vx = 0;
                    particle.vy *= _GROUND_FRICTION;
                }
            }
        }
    };
}