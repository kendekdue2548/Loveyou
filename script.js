let fill = 0; 
let interval;
let isFinishedTyping = false; 
let isQuizAnswered = false; 
let userScore = 0; // ตัวแปรเก็บคะแนนสำหรับหน้าสรุป

// --- หน้า 1: หัวใจเติมน้ำ (แก้ให้กดได้ปกติแล้ว) ---
function startFill() { 
    interval = setInterval(() => { 
        if (fill < 100) { 
            fill += 2.5; 
            document.getElementById('liquidFill').style.height = fill + "%"; 
        } else { 
            clearInterval(interval); 
            transitionToPage2(); 
        } 
    }, 30); 
}

function stopFill() { 
    clearInterval(interval); 
    if (fill < 100) { 
        fill = 0; 
        document.getElementById('liquidFill').style.height = "0%"; 
    } 
}

function transitionToPage2() { 
    document.getElementById('page1').classList.add('hidden'); 
    document.getElementById('page2').classList.remove('hidden'); 
    startTyping(); 
}

// --- หน้า 2: พิมพ์ข้อความซึ้งๆ ---
async function startTyping() {
    const area = document.getElementById('typing-area');
    const messages = ["ของขวัญวาเลนไทน์ปีนี้", "คือการมีเธออยู่ข้างๆ", "รักที่สุดเลยยย ❤️"];
    area.innerHTML = ""; 
    for (const msg of messages) {
        const p = document.createElement('div'); 
        area.appendChild(p);
        for (const char of msg) { 
            p.innerText += char; 
            await new Promise(r => setTimeout(r, 85)); 
        }
        await new Promise(r => setTimeout(r, 450));
    }
    document.getElementById('btn-next').classList.remove('hidden');
}

function goToPage3() {
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
    initScratch();
}

// --- หน้า 3: หน้าขูดรูป (ระบบพิมพ์บรรทัดเดียว ไม่ซ้ำ) ---
function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 220; canvas.height = 280;
    
    ctx.fillStyle = '#ff85a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; ctx.font = '18px Itim'; ctx.textAlign = 'center';
    ctx.fillText('ขูดเพื่อดูรูปคะ ❤️', 110, 140);

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
        if (count > (220 * 280) * 0.45 && !isFinishedTyping) { 
            isFinishedTyping = true; 
            canvas.style.transition = "opacity 0.8s"; canvas.style.opacity = "0";
            setTimeout(() => { canvas.remove(); showFinalMessage(); }, 800);
        }
    };

    async function showFinalMessage() {
        document.getElementById('scratch-hint').classList.add('hidden');
        const overlay = document.getElementById('final-message');
        overlay.classList.remove('hidden');
        overlay.innerHTML = ""; 

        await new Promise(r => setTimeout(r, 1000)); 
        const texts = ["Happy Valentine Day", "แค่มีเธออยู่", "ทุกวันก็พิเศษแล้ว", "รูปใครน่ารักจัง"];
        for (let i = 0; i < texts.length; i++) {
            const line = document.createElement('div');
            line.style.margin = "5px 0"; 
            overlay.appendChild(line);
            for (const char of texts[i]) {
                line.innerText += char;
                await new Promise(r => setTimeout(r, 90)); 
            }
            await new Promise(r => setTimeout(r, 400)); 
        }
        document.getElementById('btn-to-menu').classList.remove('hidden');
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}

// --- หน้า 4: เมนูหลัก ---
function goToPage4() {
    document.getElementById('page3').classList.add('hidden');
    document.getElementById('page4').classList.remove('hidden');
}

function openGift(type) {
    document.querySelectorAll('.card').forEach(c => c.classList.add('hidden')); 
    if (type === 'memory') {
        document.getElementById('page-memory').classList.remove('hidden');
        updateSlide();
    } else if (type === 'letter') {
        document.getElementById('page-letter').classList.remove('hidden');
    } else if (type === 'quiz') {
        document.getElementById('page-quiz').classList.remove('hidden');
        loadQuiz();
    }
}

// --- 1. ระบบความทรงจำ (3 รูปเลื่อนได้) ---
const memories = [
    { img: "https://img5.pic.in.th/file/secure-sv1/1604a70e0a529f353.jpg", title: "วันแรกที่คุยกัน", desc: "ตอนนั้นไม่ได้คิดอะไรเลย แค่คุยไปเรื่อย ๆ แต่ไม่รู้ทำไมถึงจำได้จนวันนี้" },
    { img: "https://img2.pic.in.th/27140cc9efb175e5f.jpg", title: "วาเลนไทน์เดย์", desc: "ตื่นเต้นมากจนทำตัวไม่ถูก แต่เป็นวันที่ที่สุดเลย" },
    { img: "https://via.placeholder.com/300x400?text=Memory+3", title: "ทริปของเรา", desc: "มีความสุขทุกครั้งที่ได้ไปเที่ยวด้วยกันนะ" }
];
let currentSlide = 0;
function updateSlide() {
    const data = memories[currentSlide];
    document.getElementById('memory-img').src = data.img;
    document.getElementById('memory-title').innerText = data.title;
    document.getElementById('memory-desc').innerText = data.desc;
}
function changeSlide(dir) { 
    currentSlide = (currentSlide + dir + memories.length) % memories.length; 
    updateSlide(); 
}

// --- 2. ระบบจดหมาย ---
function backToMenu() { 
    currentQuiz = 0; userScore = 0; // รีเซ็ตค่า quiz เผื่อเล่นใหม่
    document.querySelectorAll('.card').forEach(c => c.classList.add('hidden')); 
    document.getElementById('page4').classList.remove('hidden'); 
}
function backToMenuFromLetter() { backToMenu(); }

// --- 3. ระบบแบบทดสอบ (เฉลย แดง-เขียว และหน้าสรุปคะแนน) ---
const quizData = [
    { q: "เราเจอกันครั้งแรกที่ไหน?", options: ["มหาลัย", "ออนไลน์", "ร้านกาแฟ", "โรงเรียน"], answer: 1 },
    { q: "สิ่งที่เค้าชอบทำมากที่สุด?", options: ["ดูหนัง", "คุยกัน", "กินข้าว", "เล่นเกม"], answer: 3 },
    { q: "เวลาเหนื่อย เราอยากอยู่กับใคร?", options: ["เพื่อน", "ตัวเอง", "เธอ", "ใครก็ได้"], answer: 2 },
    { q: "ของขวัญที่ดีที่สุดคืออะไร?", options: ["เงิน", "ของแพง", "เวลา", "คำหวาน"], answer: 3 },
    { q: "เค้าชอบเหม๋อที่ไหนที่สุด?", options: ["AFK", "เลเบลล่าง", "เลนน้ำเงิน", "เลเบลบน"], answer: 1 }
];
let currentQuiz = 0;
function loadQuiz() {
    isQuizAnswered = false;
    const data = quizData[currentQuiz];
    document.getElementById('quiz-progress').innerText = `ข้อที่ ${currentQuiz + 1} / 5`;
    document.getElementById('question-text').innerText = data.q;
    const list = document.getElementById('options-list');
    list.innerHTML = ""; list.classList.remove('answered');
    data.options.forEach((opt, idx) => {
        const div = document.createElement('div'); div.className = "option-item";
        div.innerText = opt; div.onclick = () => checkAnswer(idx, div);
        list.appendChild(div);
    });
}
function checkAnswer(idx, el) {
    if (isQuizAnswered) return;
    isQuizAnswered = true;
    const correct = quizData[currentQuiz].answer;
    document.getElementById('options-list').classList.add('answered');
    if (idx === correct) { 
        el.classList.add('correct'); 
        userScore++; // นับคะแนน
    } else { 
        el.classList.add('wrong'); 
        document.querySelectorAll('.option-item')[correct].classList.add('correct'); 
    }
}
function nextQuiz() {
    if (!isQuizAnswered) { alert("เลือกคำตอบก่อนนะจ๊ะ!"); return; }
    currentQuiz++;
    if (currentQuiz < quizData.length) { loadQuiz(); } 
    else { showQuizResult(); } // จบแล้วไปหน้าสรุปคะแนน
}
function showQuizResult() {
    document.getElementById('page-quiz').classList.add('hidden');
    document.getElementById('page-quiz-result').classList.remove('hidden');
    document.getElementById('final-score').innerText = userScore; // โชว์คะแนนจริง
}

// อัปเดตฟังก์ชันเปิดเมนู
function openGift(type) {
    document.querySelectorAll('.card').forEach(c => c.classList.add('hidden')); 
    if (type === 'memory') {
        document.getElementById('page-memory').classList.remove('hidden');
        updateSlide();
    } else if (type === 'letter') {
        document.getElementById('page-letter').classList.remove('hidden');
    } else if (type === 'quiz') {
        document.getElementById('page-quiz').classList.remove('hidden');
        loadQuiz();
    } else if (type === 'music') {
        const musicPage = document.getElementById('page-music');
        musicPage.classList.remove('hidden');
        
        // สั่งเล่นเพลงและหมุน CD ทันทีที่เข้าหน้า
        const song = document.getElementById('bg-music');
        const disk = document.getElementById('cd-disk');
        song.play(); 
        disk.classList.add('playing');
    }
}

// ฟังก์ชันหยุดเพลงเมื่อกดกลับเมนู
function stopMusicAndBack() {
    const song = document.getElementById('bg-music');
    const disk = document.getElementById('cd-disk');
    song.pause(); // หยุดเพลง
    song.currentTime = 0; // รีเซ็ตไปเริ่มใหม่
    disk.classList.remove('playing'); // หยุดหมุน
    backToMenu();
}
