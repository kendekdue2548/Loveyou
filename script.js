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

async function startTyping() {
    const area = document.getElementById('typing-area');
    for (const msg of messages) {
        const p = document.createElement('span'); 
        area.appendChild(p);
        for (const char of msg) { 
            p.innerText += char; 
            await new Promise(r => setTimeout(r, 80)); 
        }
        area.appendChild(document.createElement('br'));
        await new Promise(r => setTimeout(r, 400)); 
    }
    document.getElementById('btn-next').classList.remove('hidden');
}
