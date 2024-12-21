document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');
    const invitationCard = document.getElementById('invitation-card');
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    let fireworks = [];
    let fireworkInterval;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 2;
            this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
            this.sparks = [];
            for (let i = 0; i < 200; i++) {
                this.sparks.push({
                    x: this.x,
                    y: this.y,
                    radius: this.radius,
                    angle: random(0, Math.PI * 2),
                    velocity: random(1, 3),
                    alpha: 1,
                    life: random(20, 60)
                });
            }
        }

        update() {
            this.sparks.forEach(spark => {
                spark.x += Math.cos(spark.angle) * spark.velocity;
                spark.y += Math.sin(spark.angle) * spark.velocity;
                spark.alpha -= 0.01;
                spark.life--;
            });
            this.sparks = this.sparks.filter(spark => spark.life > 0);
        }

        draw(ctx) {
            this.sparks.forEach(spark => {
                ctx.save();
                ctx.globalAlpha = spark.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    }

    function createFirework() {
        const firework = new Firework(random(0, canvas.width), random(0, canvas.height / 2));
        fireworks.push(firework);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach(firework => {
            firework.update();
            firework.draw(ctx);
        });
        fireworks = fireworks.filter(firework => firework.sparks.length > 0);
        requestAnimationFrame(animate);
    }

    function triggerFirework() {
        for (let i = 0; i < 5; i++) {  // Tăng số lượng pháo điện nổ
            setTimeout(createFirework, i * 500);
        }
    }

    function startFireworks() {
        fireworkInterval = setInterval(createFirework, 100); // Pháo hoa bắn liên tục
        setTimeout(() => {
            clearInterval(fireworkInterval);  // Ngừng bắn pháo hoa khi tấm thiệp hiện lên
            overlay.style.opacity = 0;
            invitationCard.style.display = 'block';
            triggerFirework();  // Kích hoạt pháo điện nổ khi thiệp hiện lên
            setTimeout(() => {
                invitationCard.style.opacity = 1;
            }, 0);
        }, 3000); // Thời gian trước khi hiển thị tấm thiệp mời
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    startFireworks();
    animate();
});
