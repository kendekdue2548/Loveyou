function checkPasscode() {
  const code = document.getElementById('passcode').value;
  if (code === '123456') { // ตั้งรหัสที่ต้องการ
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
  } else {
    alert('รหัสผ่านไม่ถูกต้องนะจ๊ะ');
  }
}
