const ADMIN_EMAIL = "balanzanf@gmail.com";
const ADMIN_PASS = "82185042@Djilla";
const ADMIN_WALLET_CODE = "821850";
const COFFRE_CODE = "8282";

// INDEX
if(document.getElementById('btnConnexion')){
  document.getElementById('btnLogin').onclick = () => toggleTab(true);
  document.getElementById('btnRegister').onclick = () => toggleTab(false);
  function toggleTab(login){
    document.getElementById('loginForm').classList.toggle('hidden', !login);
    document.getElementById('registerForm').classList.toggle('hidden', login);
    document.getElementById('btnLogin').classList.toggle('active', login);
    document.getElementById('btnRegister').classList.toggle('active', !login);
  }
  
  document.getElementById('btnConnexion').onclick = () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const users = JSON.parse(localStorage.getItem('maraso_users') || '[]');
    if(email === ADMIN_EMAIL && pass === ADMIN_PASS){
      localStorage.setItem('maraso_user', email);
      localStorage.setItem('maraso_isAdmin', 'true');
      window.location.href = 'accueil.html';
    } else if(users.find(u => u.email === email && u.pass === pass)){
      localStorage.setItem('maraso_user', email);
      localStorage.setItem('maraso_isAdmin', 'false');
      window.location.href = 'accueil.html';
    } else document.getElementById('erreur').textContent = 'Identifiants incorrects';
  };

  document.getElementById('btnInscription').onclick = () => {
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    if(document.getElementById('regPass').value !== document.getElementById('regPass2').value) return document.getElementById('erreur').textContent = 'Mots de passe différents';
    let users = JSON.parse(localStorage.getItem('maraso_users') || '[]');
    if(users.find(u => u.email === email)) return document.getElementById('erreur').textContent = 'Email déjà pris';
    users.push({email, pass, plan: 15, stockage: 0, videos: 0, photos: 0, fichiers: 0});
    localStorage.setItem('maraso_users', JSON.stringify(users));
    document.getElementById('erreur').textContent = 'Compte créé! Connecte-toi.';
  };
}

// ACCUEIL
if(document.getElementById('appContent')){
  const user = localStorage.getItem('maraso_user');
  const isAdmin = localStorage.getItem('maraso_isAdmin') === 'true';
  
  if(!user) document.getElementById('loginBlock').style.display = 'flex';
  else {
    document.getElementById('loginBlock').style.display = 'none';
    document.getElementById('appContent').classList.remove('hidden');
  }

  document.getElementById('userAvatar').textContent = user.charAt(0).toUpperCase();
  if(isAdmin) document.getElementById('adminBadge').style.display = 'inline-block';
  else document.getElementById('walletIcon').style.display = 'none';

  let users = JSON.parse(localStorage.getItem('maraso_users') || '[]');
  if(isAdmin && users.filter(u=>u.email!==ADMIN_EMAIL).length===0){
    users.push({email: "test@maraso.com", pass: "123456", plan: 15, stockage: 0.5, videos: 40, photos: 40, fichiers: 20});
    localStorage.setItem('maraso_users', JSON.stringify(users));
  }

  let data = isAdmin ? {plan: 999, stockage: 1.2, videos: 55, photos: 30, fichiers: 15} : users.find(u=>u.email===user) || {plan: 15, stockage: 1.2, videos: 55, photos: 30, fichiers: 15};
  
  document.getElementById('planType').textContent = isAdmin ? 'ADMIN' : data.plan > 15 ? 'PREMIUM' : 'GRATUIT';
  document.getElementById('stockageText').textContent = `${data.stockage} GB / ${data.plan} GB`;
  document.getElementById('videoPct').textContent = data.videos + '%';
  document.getElementById('photoPct').textContent = data.photos + '%';
  document.getElementById('filePct').textContent = data.fichiers + '%';

  const toast = (msg) => { const t=document.getElementById('toast'); t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',2000); };
  
  document.getElementById('btnLogout').onclick = () => { localStorage.clear(); window.location.href = 'index.html'; };
  document.getElementById('walletIcon').onclick = () => { document.getElementById('walletModal').style.display = 'flex'; document.getElementById('walletContent').classList.add('hidden'); };
  document.getElementById('btnDeverrouiller').onclick = () => {
    if(document.getElementById('walletCode').value === ADMIN_WALLET_CODE){
      document.getElementById('walletContent').classList.remove('hidden');
      document.getElementById('pubGains').textContent = parseFloat(localStorage.getItem('pubGains')||0).toFixed(2)+' $';
      document.getElementById('aboGains').textContent = parseFloat(localStorage.getItem('aboGains')||0).toFixed(2)+' $';
    } else document.getElementById('erreurWallet').textContent = 'Code faux';
  };
  document.getElementById('btnOuvrirCoffre').onclick = () => {
    if(document.getElementById('coffreCode').value === COFFRE_CODE){
      document.getElementById('coffreContent').classList.remove('hidden');
      document.getElementById('coffreAmount').textContent = parseFloat(localStorage.getItem('coffreDjilla')||0).toFixed(2)+' $';
    }
  };
  document.getElementById('btnFermerWallet').onclick = () => document.getElementById('walletModal').style.display = 'none';

  document.getElementById('btnGererUsers').onclick = () => {
    if(!isAdmin) return toast('Admin seulement');
    let users = JSON.parse(localStorage.getItem('maraso_users') || '[]');
    document.getElementById('listeUsers').innerHTML = users.filter(u=>u.email!==ADMIN_EMAIL).map((u,i)=>`
      <div class="user-item">
        <div class="email">${u.email}</div>
        <div class="stats">Plan: ${u.plan}GB <input type="number" id="p${i}" value="${u.plan}"><button onclick="mod('${u.email}',${i})">OK</button></div>
      </div>`).join('');
    document.getElementById('gestionUsersModal').style.display = 'flex';
  };
  window.mod = (email,i) => {
    let users = JSON.parse(localStorage.getItem('maraso_users') || '[]');
    users.find(u=>u.email===email).plan = parseInt(document.getElementById('p'+i).value);
    localStorage.setItem('maraso_users', JSON.stringify(users));
    toast('Plan modifié ✅');
  };
  document.getElementById('btnFermerGestion').onclick = () => document.getElementById('gestionUsersModal').style.display = 'none';

  function acheter(gb){
    if(isAdmin) return toast('Admin illimité');
    let users = JSON.parse(localStorage.getItem('maraso_users') || '[]');
    let u = users.find(x=>x.email===user);
    u.plan = gb;
    localStorage.setItem('maraso_users', JSON.stringify(users));
    document.getElementById('planType').textContent = 'PREMIUM';
    document.getElementById('stockageText').textContent = `${u.stockage} GB / ${gb} GB`;
    localStorage.setItem('aboGains', parseFloat(localStorage.getItem('aboGains')||0) + (gb===100?4.99:gb===500?14.99:49.99));
    toast(`Premium ${gb}GB activé`);
  }
  document.getElementById('btn100').onclick = () => acheter(100);
  document.getElementById('btn500').onclick = () => acheter(500);
  document.getElementById('btn2000').onclick = () => acheter(2000);
}