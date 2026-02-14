(function(window){

    function random(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function bezier(cp, t) {  
        var p1 = cp[0].mul((1 - t) * (1 - t));
        var p2 = cp[1].mul(2 * t * (1 - t));
        var p3 = cp[2].mul(t * t); 
        return p1.add(p2).add(p3);
    }  

    function inheart(x, y, r) {
        var z = ((x / r) * (x / r) + (y / r) * (y / r) - 1);
        z = z * z * z - (x / r) * (x / r) * (y / r) * (y / r) * (y / r);
        return z < 0;
    }

    Point = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Point.prototype = {
        clone: function() {
            return new Point(this.x, this.y);
        },
        add: function(o) {
            var p = this.clone();
            p.x += o.x;
            p.y += o.y;
            return p;
        },
        sub: function(o) {
            var p = this.clone();
            p.x -= o.x;
            p.y -= o.y;
            return p;
        },
        div: function(n) {
            var p = this.clone();
            p.x /= n;
            p.y /= n;
            return p;
        },
        mul: function(n) {
            var p = this.clone();
            p.x *= n;
            p.y *= n;
            return p;
        }
    }

    Heart = function() {
        var points = [], x, y, t;
        for (var i = 10; i < 30; i += 0.2) {
            t = i / Math.PI;
            x = 16 * Math.pow(Math.sin(t), 3);
            y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
              - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            points.push(new Point(x, y));
        }
        this.points = points;
        this.length = points.length;
    }

    Heart.prototype = {
        get: function(i, scale) {
            return this.points[i].mul(scale || 1);
        }
    }

    Seed = function(tree, point, scale, color) {
        this.tree = tree;
        this.heart = {
            point: point,
            scale: scale || 1,
            color: color || '#FF0000',
            figure: new Heart()
        };
        this.circle = {
            point: point,
            scale: scale || 1,
            color: color || '#FF0000',
            radius: 5
        };
    }

    Seed.prototype = {
        draw: function() {
            this.drawHeart();
        },
        canScale: function() {
            return this.heart.scale > 0.2;
        },
        scale: function(s) {
            this.heart.scale *= s;
        },
        drawHeart: function() {
            var ctx = this.tree.ctx;
            ctx.save();
            ctx.fillStyle = this.heart.color;
            ctx.translate(this.heart.point.x, this.heart.point.y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (var i = 0; i < this.heart.figure.length; i++) {
                var p = this.heart.figure.get(i, this.heart.scale);
                ctx.lineTo(p.x, -p.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    Footer = function(tree, width, height, speed) {
        this.tree = tree;
        this.width = width;
        this.height = height;
        this.speed = speed || 2;
        this.length = 0;
    }

    Footer.prototype = {
        draw: function() {
            var ctx = this.tree.ctx;
            ctx.save();
            ctx.strokeStyle = 'rgb(35,31,32)';
            ctx.lineWidth = this.height;
            ctx.beginPath();
            ctx.moveTo(-this.length / 2, 0);
            ctx.lineTo(this.length / 2, 0);
            ctx.stroke();
            ctx.restore();
            this.length += this.speed;
        }
    }

    Tree = function(canvas, width, height, opt) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.opt = opt || {};
        this.initSeed();
    }

    Tree.prototype = {
        initSeed: function() {
            var seed = this.opt.seed;
            this.seed = new Seed(
                this,
                new Point(seed.x, seed.y),
                seed.scale,
                seed.color
            );
        }
    }

    window.random = random;
    window.bezier = bezier;
    window.Point = Point;
    window.Tree = Tree;

})(window);
