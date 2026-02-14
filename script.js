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

function goToPage3() {
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
    initScratch();
}

function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 220; canvas.height = 280;
    
    ctx.fillStyle = '#ff85a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; ctx.font = '18px Itim'; ctx.textAlign = 'center';
    ctx.fillText('ขูดเพื่อดูรูปคู่เรา ❤️', 110, 140);

    let isDrawing = false;
    const scratch = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();
        checkProgress();
    };

    const checkProgress = () => {
        const data = ctx.getImageData(0, 0, 220, 280).data;
        let count = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] === 0) count++;
        if (count > (220 * 280) * 0.45) { 
            canvas.style.transition = "opacity 0.8s"; canvas.style.opacity = "0";
            setTimeout(() => { canvas.remove(); showFinalMessage(); }, 800);
        }
    };

    // --- แก้ไขตรงนี้: พิมพ์แค่บรรทัดละครั้ง เรียงกัน 4 บรรทัดจบ ---
    async function showFinalMessage() {
        document.getElementById('scratch-hint').classList.add('hidden');
        const overlay = document.getElementById('final-message');
        overlay.classList.remove('hidden');
        overlay.innerHTML = ""; // ล้างหน้าจอให้ว่าง

        await new Promise(r => setTimeout(r, 1000)); // รอ 1 วิเห็นรูปชัดๆ

        const texts = [
            "Happy Valentine Day", 
            "แค่มีเธออยู่",          
            "ทุกวันก็พิเศษแล้ว",      
            "น่ารักไหมคะ"         
        ];

        // วนลูปพิมพ์แค่ 4 บรรทัด บรรทัดละ 1 รอบเท่านั้น
        for (let i = 0; i < texts.length; i++) {
            const line = document.createElement('div');
            line.style.margin = "8px 0"; // ระยะห่างกำลังดีไม่ให้ติดกัน
            overlay.appendChild(line);
            
            for (const char of texts[i]) {
                line.innerText += char;
                await new Promise(r => setTimeout(r, 90)); // ความเร็วพิมพ์ทีละตัว
            }
            await new Promise(r => setTimeout(r, 400)); // จังหวะพักก่อนขึ้นบรรทัดใหม่
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}
