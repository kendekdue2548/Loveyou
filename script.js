let fill = 0; let interval;

function startFill() {
    interval = setInterval(() => {
        if (fill < 100) {
            fill += 2.5; document.getElementById('liquidFill').style.height = fill + "%";
        } else { clearInterval(interval); transitionToNext(); }
    }, 30);
}

function stopFill() {
    clearInterval(interval);
    if (fill < 100) { fill = 0; document.getElementById('liquidFill').style.height = "0%"; }
}

const messages = ["ของขวัญวาเลนไทน์ปีนี้...", "คือการมีเธออยู่ข้างๆ", "รักที่สุดเลยยย ❤️"];

function transitionToNext() {
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
    startTyping();
}

async function startTyping() {
    const area = document.getElementById('typing-area');
    for (const msg of messages) {
        const p = document.createElement('p'); p.className = 'typing-text'; area.appendChild(p);
        for (const char of msg) { p.innerText += char; await new Promise(r => setTimeout(r, 80)); }
        await new Promise(r => setTimeout(r, 400));
    }
    document.getElementById('btn-next').classList.remove('hidden');
}

// --- ระบบขูดรูป (Scratch Reveal) ---
function goToPage3() {
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
    initScratch();
}

function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // สร้างแผ่นปิดสีชมพู
    ctx.fillStyle = '#d63384'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ใส่คำใบ้บนแผ่นขูดเล็กๆ
    ctx.fillStyle = 'white';
    ctx.font = '20px Itim';
    ctx.textAlign = 'center';
    ctx.fillText('ถูๆ เพื่อดูรูป ❤️', canvas.width/2, canvas.height/2);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2); // ขนาดหัวแปรงขูด
        ctx.fill();
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}
