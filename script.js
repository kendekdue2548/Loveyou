let fill = 0; 
let interval;
let isFinishedTyping = false; 

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

async function startTyping() {
    const area = document.getElementById('typing-area');
    const messages = ["ของขวัญวาเลนไทน์ปีนี้...", "คือการมีเธออยู่ข้างๆ", "รักที่สุดเลยยย ❤️"];
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

function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 220; 
    canvas.height = 280;
    
    ctx.fillStyle = '#ff85a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; 
    ctx.font = '18px Itim'; 
    ctx.textAlign = 'center';
    ctx.fillText('ขูดเพื่อดูรูปคู่เรา ❤️', 110, 140);

    let isDrawing = false;
    const scratch = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); 
        ctx.arc(x, y, 35, 0, Math.PI * 2); 
        ctx.fill();
        checkProgress();
    };

    const checkProgress = () => {
        const data = ctx.getImageData(0, 0, 220, 280).data;
        let count = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] === 0) count++;
        if (count > (220 * 280) * 0.45 && !isFinishedTyping) { 
            isFinishedTyping = true; 
            canvas.style.transition = "opacity 0.8s"; 
            canvas.style.opacity = "0";
            setTimeout(() => { 
                canvas.remove(); 
                showFinalMessage(); 
            }, 800);
        }
    };

    async function showFinalMessage() {
        document.getElementById('scratch-hint').classList.add('hidden');
        const overlay = document.getElementById('final-message');
        overlay.classList.remove('hidden');
        overlay.innerHTML = ""; 

        await new Promise(r => setTimeout(r, 1000)); 

        const texts = [
            "Happy Valentine Day", 
            "แค่มีเธออยู่",          
            "ทุกวันก็พิเศษแล้ว",      
            "น่ารักไหมคะ"         
        ];

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

function goToPage4() {
    document.getElementById('page3').classList.add('hidden');
    document.getElementById('page4').classList.remove('hidden');
}

// --- ระบบความทรงจำ 3 รูป ---
const memories = [
    {
        img: "https://img5.pic.in.th/file/secure-sv1/1604a70e0a529f353.jpg", 
        title: "วันแรกที่คุยกัน",
        desc: "ตอนนั้นไม่ได้คิดอะไรเลย แค่คุยไปเรื่อย ๆ แต่ไม่รู้ทำไมถึงจำได้จนวันนี้"
    },
    {
        img: "https://img2.pic.in.th/27140cc9efb175e5f.jpg", 
        title: "วาเลนไทน์เดย์",
        desc: "ตื่นเต้นมากจนทำตัวไม่ถูก แต่เป็นวันที่ที่สุดเลย"
    }
];

let currentSlide = 0;

function updateSlide() {
    const data = memories[currentSlide];
    document.getElementById('memory-img').src = data.img;
    document.getElementById('memory-title').innerText = data.title;
    document.getElementById('memory-desc').innerText = data.desc;
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = memories.length - 1;
    if (currentSlide >= memories.length) currentSlide = 0;
    updateSlide();
}

function backToMenu() {
    document.getElementById('page-memory').classList.add('hidden');
    document.getElementById('page4').classList.remove('hidden');
}

// --- แก้ไขฟังก์ชันเปิดเมนูและเพิ่มระบบจดหมาย ---
function openGift(type) {
    if (type === 'memory') {
        document.getElementById('page4').classList.add('hidden');
        document.getElementById('page-memory').classList.remove('hidden');
        updateSlide();
    } else if (type === 'letter') {
        document.getElementById('page4').classList.add('hidden');
        document.getElementById('page-letter').classList.remove('hidden');
    } else {
        alert("เปิด " + type + " แล้วจ้า!");
    }
}


// ข้อมูลคำถาม 5 ข้อ
const quizData = [
    // ข้อมูลคำถาม 5 ข้อ พร้อมเฉลยตามที่มึงสั่ง
const quizData = [
    {
        q: "เราเจอกันครั้งแรกที่ไหน?",
        options: ["มหาลัย", "ออนไลน์", "ร้านกาแฟ", "โรงเรียน"],
        answer: 1 // เฉลย: ออนไลน์
    },
    {
        q: "สิ่งที่เค้าชอบทำมากที่สุด?",
        options: ["ดูหนัง", "คุยกัน", "กินข้าว", "เล่นเกม"],
        answer: 3 // เฉลย: เล่นเกม (ลำดับที่ 4 คือเลข 3)
    },
    {
        q: "เวลาเหนื่อย เราอยากอยู่กับใคร?",
        options: ["เพื่อน", "ตัวเอง", "เธอ", "ใครก็ได้"],
        answer: 2 // เฉลย: เธอ
    },
    {
        q: "ของขวัญที่ดีที่สุดคืออะไร?",
        options: ["เงิน", "ของแพง", "เวลา", "คำหวาน"],
        answer: 3 // เฉลย: คำหวาน (ลำดับที่ 4 คือเลข 3)
    },
    {
        q: "เค้าชอบเหม๋อที่ไหนที่สุด?",
        options: ["AFK", "เลเบลล่าง", "เลนน้ำเงิน", "เลเบลบน"],
        answer: 1 // เฉลย: เลเบลล่าง
    }
];

let currentQuiz = 0;

// แก้ไขฟังก์ชัน openGift เพื่อรองรับหน้า Quiz
function openGift(type) {
    if (type === 'memory') {
        document.getElementById('page4').classList.add('hidden');
        document.getElementById('page-memory').classList.remove('hidden');
        updateSlide();
    } else if (type === 'letter') {
        document.getElementById('page4').classList.add('hidden');
        document.getElementById('page-letter').classList.remove('hidden');
    } else if (type === 'quiz') {
        document.getElementById('page4').classList.add('hidden');
        document.getElementById('page-quiz').classList.remove('hidden');
        loadQuiz();
    }
}

function loadQuiz() {
    const data = quizData[currentQuiz];
    document.getElementById('quiz-progress').innerText = `ข้อที่ ${currentQuiz + 1} / 5`;
    document.getElementById('question-text').innerText = data.q;
    
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = "";
    
    data.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = "option-item";
        div.innerText = opt;
        div.onclick = function() {
            // ลบ class selected จากตัวอื่นก่อน
            document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
        };
        optionsList.appendChild(div);
    });
}

function nextQuiz() {
    // เช็คว่าเลือกคำตอบหรือยัง
    if (!document.querySelector('.option-item.selected')) {
        alert("เลือกคำตอบก่อนนะจ๊ะ!");
        return;
    }

    currentQuiz++;
    if (currentQuiz < quizData.length) {
        loadQuiz();
    } else {
        alert("เก่งมาก! รู้จักเราดีที่สุดเลย ❤️");
        currentQuiz = 0; // รีเซ็ตเผื่อเล่นใหม่
        document.getElementById('page-quiz').classList.add('hidden');
        document.getElementById('page4').classList.remove('hidden');
    }
}

// ฟังก์ชันกลับหน้าเมนูจากหน้าจดหมาย
function backToMenuFromLetter() {
    document.getElementById('page-letter').classList.add('hidden');
    document.getElementById('page4').classList.remove('hidden');
}
