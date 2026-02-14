let fill = 0; let interval;

function startFill() {
    interval = setInterval(() => {
        if (fill < 100) {
            fill += 2.5; 
            document.getElementById('liquidFill').style.height = fill + "%";
        } else { 
            clearInterval(interval); 
            transitionToNext(); 
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

const messages = ["ของขวัญวาเลนไทน์ปีนี้...", "คือการมีเธออยู่ข้างๆ", "รักที่สุดเลยยย ❤️"];

function transitionToNext() {
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
    startTyping();
}

function goToPage3() {
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
}

async function startTyping() {
    const area = document.getElementById('typing-area');
    area.innerHTML = ""; 
    for (const msg of messages) {
        const p = document.createElement('p'); 
        p.className = 'typing-text'; 
        area.appendChild(p);
        for (const char of msg) { 
            p.innerText += char; 
            await new Promise(r => setTimeout(r, 80)); 
        }
        await new Promise(r => setTimeout(r, 400)); 
    }
    document.getElementById('btn-next').classList.remove('hidden');
}
