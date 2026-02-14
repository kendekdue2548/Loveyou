/* ระบบหน้าหนึ่งสองเดิม (ไม่แก้) */
let fill = 0; let interval;
function startFill() { interval = setInterval(() => { if (fill < 100) { fill += 2.5; document.getElementById('liquidFill').style.height = fill + "%"; } else { clearInterval(interval); transitionToNext(); } }, 30); }
function stopFill() { clearInterval(interval); if (fill < 100) { fill = 0; document.getElementById('liquidFill').style.height = "0%"; } }
function transitionToNext() { document.getElementById('page1').classList.add('hidden'); document.getElementById('page2').classList.remove('hidden'); startTyping(); }
async function startTyping() { const area = document.getElementById('typing-area'); const msgs = ["ของขวัญวาเลนไทน์ปีนี้...", "คือการมีเธออยู่ข้างๆ", "รักที่สุดเลยยย ❤️"]; for (const m of msgs) { const p = document.createElement('p'); p.className = 'typing-text'; area.appendChild(p); for (const c of m) { p.innerText += c; await new Promise(r => setTimeout(r, 80)); } await new Promise(r => setTimeout(r, 400)); } document.getElementById('btn-next').classList.remove('hidden'); }

// --- แก้ไขระบบหน้าสาม: ขูดแล้วหน่วง 1 วิแล้วพิมพ์ข้อความ ---
function goToPage3() {
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
    initScratch();
}

function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth; canvas.height = container.offsetHeight;

    ctx.fillStyle = '#ff85a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; ctx.font = '20px Itim'; ctx.textAlign = 'center';
    ctx.fillText('ขูดเพื่อดูรูปคู่เรา ❤️', canvas.width/2, canvas.height/2);

    let isDrawing = false;
    let isFinished = false;

    function scratch(e) {
        if (!isDrawing || isFinished) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();
        checkProgress();
    }

    function checkProgress() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let count = 0;
        for (let i = 0; i < imageData.data.length; i += 4) { if (imageData.data[i + 3] === 0) count++; }
        if (count > (canvas.width * canvas.height) * 0.45) { 
            isFinished = true;
            finishScratch(); 
        }
    }

    function finishScratch() {
        canvas.style.transition = "opacity 0.8s";
        canvas.style.opacity = "0";
        setTimeout(() => { 
            canvas.remove(); 
            // ขูดหมดแล้ว รอ 1 วินาทีตามที่มึงบอก
            setTimeout(showFinalMessage, 1000); 
        }, 800);
    }

    async function showFinalMessage() {
        document.getElementById('scratch-hint').classList.add('hidden');
        const overlay = document.getElementById('final-message');
        overlay.classList.remove('hidden');
        
        const finalTexts = [
            "Happy Valentine Day",
            "แค่มีเธออยู่",
            "ทุกวันก็พิเศษแล้ว",
            "น่ารักไหมคะ"
        ];

        for (const text of finalTexts) {
            const div = document.createElement('div');
            overlay.appendChild(div);
            for (const char of text) {
                div.innerText += char;
                await new Promise(r => setTimeout(r, 100)); // ลูกเล่นพิมพ์ข้อความทีละตัว
            }
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
