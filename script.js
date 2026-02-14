let fill = 0; let interval;

function startFill() { interval = setInterval(() => { if (fill < 100) { fill += 2.5; document.getElementById('liquidFill').style.height = fill + "%"; } else { clearInterval(interval); transitionToPage2(); } }, 30); }
function stopFill() { clearInterval(interval); if (fill < 100) { fill = 0; document.getElementById('liquidFill').style.height = "0%"; } }

function transitionToPage2() { document.getElementById('page1').classList.add('hidden'); document.getElementById('page2').classList.remove('hidden'); startTyping(); }

async function startTyping() {
    const area = document.getElementById('typing-area');
    const messages = ["ของขวัญวาเลนไทน์ปีนี้...", "คือการมีเธออยู่ข้างๆ", "รักที่สุดเลยยย ❤️"];
    for (const msg of messages) {
        const p = document.createElement('div'); area.appendChild(p);
        for (const char of msg) { p.innerText += char; await new Promise(r => setTimeout(r, 85)); }
        await new Promise(r => setTimeout(r, 450));
    }
    document.getElementById('btn-next').classList.remove('hidden');
}

// ระบบหน้า 3: ขูดแล้วเด้งข้อความ
function goToPage3() {
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
    initScratch();
}

function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 220; canvas.height = 280;
    
    ctx.fillStyle = '#ff85a1'; // แผ่นขูดสีชมพู
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; ctx.font = '18px Itim'; ctx.textAlign = 'center';
    ctx.fillText('ขูดเพื่อดูรูปคู่เรา ❤️', 110, 140);

    let isDrawing = false;
    const scratch = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();
        checkProgress();
    };

    const checkProgress = () => {
        const data = ctx.getImageData(0, 0, 220, 280).data;
        let count = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] === 0) count++;
        if (count > (220 * 280) * 0.45) { // ขูดเกิน 45% ถือว่าเสร็จ
            canvas.style.transition = "opacity 0.8s"; canvas.style.opacity = "0";
            setTimeout(() => { canvas.remove(); showFinalMessage(); }, 800);
        }
    };

    async function showFinalMessage() {
        document.getElementById('scratch-hint').classList.add('hidden');
        const overlay = document.getElementById('final-message');
        overlay.classList.remove('hidden');
        
        await new Promise(r => setTimeout(r, 1000)); // รอ 1 วิ ตามคลิป
        
        const texts = ["Happy Valentine Day", "แค่มีเธออยู่", "ทุกวันก็พิเศษแล้ว", "น่ารักไหมคะ"];
        for (const t of texts) {
            const div = document.createElement('div'); overlay.appendChild(div);
            for (const c of t) { div.innerText += c; await new Promise(r => setTimeout(r, 100)); }
            await new Promise(r => setTimeout(r, 500));
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}
