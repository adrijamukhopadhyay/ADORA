const events=[
{id:1,title:"AI & GenAI Hackathon",category:"Tech",date:"Nov 20, 2026",venue:"KIIT Auditorium",description:"A 24-hour hackathon to build real-world AI solutions.",details:"Work in a team to prototype an AI-powered solution, receive mentor feedback, and present your final build to the judging panel. Open to students across all departments; bring your laptop and college ID.",image:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",price:"Free entry",time:"9:00 AM – 9:00 AM"},
{id:2,title:"Kaleidoscope 2.0",category:"Cultural",date:"Nov 25, 2026",venue:"Open Air Theatre",description:"The annual cultural fest — music, dance, art and more!",details:"A campus celebration featuring live performances, dance showcases, music, art installations, food stalls, and student-led creative acts. Arrive early to enjoy the full programme.",image:"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=85",price:"₹199 onwards",time:"5:00 PM – 10:00 PM"},
{id:3,title:"KIIT Sports League",category:"Sports",date:"Dec 02, 2026",venue:"Sports Complex",description:"Inter-departmental sports showdown across multiple games.",details:"Compete or cheer across a range of inter-departmental sports. The day includes team fixtures, individual events, and a closing awards ceremony. Sportswear and student ID are recommended.",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=85",price:"Free entry",time:"8:00 AM – 5:00 PM"},
{id:4,title:"Web3 Bootcamp",category:"Workshop",date:"Dec 10, 2026",venue:"Lab 2, CSE Block",description:"A hands-on workshop on building decentralized applications.",details:"Learn the foundations of Web3 and build a simple decentralised application with guided exercises. Suitable for beginners; participants should bring a laptop.",image:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85",price:"₹149",time:"10:00 AM – 4:00 PM"},
{id:5,title:"Design Futures Meetup",category:"Others",date:"Dec 14, 2026",venue:"Innovation Hub",description:"Meet creative minds and explore the future of digital design.",details:"An informal meetup for designers, makers, and curious students, with short talks, portfolio conversations, and collaborative design activities.",image:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=85",price:"₹99",time:"2:00 PM – 6:00 PM"},
{id:6,title:"Indie Sound Sessions",category:"Cultural",date:"Dec 18, 2026",venue:"Campus Arena",description:"An evening of independent music, new voices and good energy.",details:"Discover independent artists and campus performers in an intimate live-music evening. Doors open before the first performance; entry is subject to venue capacity.",image:"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=85",price:"₹299",time:"6:30 PM – 10:00 PM"},
{id:7,title:"CodeSprint Challenge",category:"Tech",date:"Dec 21, 2026",venue:"CSE Block",description:"A fast-paced coding challenge for curious problem solvers.",details:"Solve timed programming problems, practise algorithmic thinking, and compete on a shared leaderboard. Basic programming knowledge is recommended.",image:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85",price:"₹99",time:"11:00 AM – 5:00 PM"},
{id:8,title:"Campus Wellness Day",category:"Others",date:"Dec 27, 2026",venue:"Ekamra Park",description:"A morning of movement, mindfulness and community connection.",details:"Take part in a relaxed morning of guided movement, mindfulness, and community activities. Wear comfortable clothing and carry a water bottle.",image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=85",price:"Free entry",time:"7:00 AM – 11:00 AM"}
];
const grid=document.getElementById("eventGrid"),search=document.getElementById("search");let category="All",selected=null;
function render(){const q=search.value.toLowerCase().trim(),list=events.filter(e=>(category==="All"||e.category===category)&&[e.title,e.category,e.venue,e.description].join(" ").toLowerCase().includes(q));grid.innerHTML=list.map(e=>`<article class="event-card" tabindex="0" role="button" data-id="${e.id}" aria-label="View ${e.title}"><div class="event-image"><img src="${e.image}" alt="${e.title}" loading="lazy"><span class="tag">${e.category}</span></div><div class="event-content"><h3>${e.title}</h3><div class="event-meta"><span>▣ &nbsp;${e.date}</span><span>⌖ &nbsp;${e.venue}</span></div><p>${e.description}</p><div class="card-bottom"><span>EXPLORE EVENT</span><span class="arrow">→</span></div></div></article>`).join("");document.getElementById("count").textContent=`SHOWING ${list.length} EVENTS`;document.getElementById("empty").hidden=!!list.length;grid.hidden=!list.length}
function showModal(id){const m=document.getElementById(id);m.classList.add("open");m.setAttribute("aria-hidden","false")}
function closeAll(){document.querySelectorAll(".modal-backdrop").forEach(m=>{m.classList.remove("open");m.setAttribute("aria-hidden","true")})}
function details(id){
 selected=events.find(e=>e.id===+id);
 if(!selected)return;
 document.getElementById("eventDetails").innerHTML=`
  <div class="detail-image"><img src="${selected.image}" alt="${selected.title}"></div>
  <div class="eyebrow">${selected.category.toUpperCase()} EXPERIENCE · ADORA</div>
  <h2>${selected.title}</h2>
  <p class="detail-description">${selected.details||selected.description}</p>
  <div class="detail-info">
   <span>▣ &nbsp;<strong>Date:</strong> ${selected.date}</span>
   <span>◷ &nbsp;<strong>Time:</strong> ${selected.time}</span>
   <span>⌖ &nbsp;<strong>Venue:</strong> ${selected.venue}</span>
   <span>✦ &nbsp;<strong>Entry:</strong> ${selected.price}</span>
  </div>
  <div class="detail-highlights">
   <div class="detail-highlight"><strong>REGISTRATION</strong>Complete the form with your name, email and phone number.</div>
   <div class="detail-highlight"><strong>CONFIRMATION</strong>A confirmation message appears after valid details are submitted.</div>
  </div>
  <div class="modal-actions"><strong>${selected.price}</strong><button class="btn primary" id="registerNow" type="button">Register now →</button></div>`;
 showModal("eventModal");
 document.getElementById("registerNow").onclick=()=>{closeAll();register(selected.id)};
}
function register(id){
 selected=events.find(e=>e.id===+id);
 if(!selected)return;
 document.getElementById("eventId").value=selected.id;
 document.getElementById("selectedEventName").value=selected.title;
 document.getElementById("registerEvent").textContent=`Registration for ${selected.title} · ${selected.date}`;
 document.getElementById("registerForm").hidden=false;
 document.getElementById("success").hidden=true;
 document.getElementById("error").textContent="";
 document.getElementById("registerForm").reset();
 document.getElementById("eventId").value=selected.id;
 document.getElementById("selectedEventName").value=selected.title;
 const signedIn=window.adoraCurrentUser;
 if(signedIn){
   document.getElementById("name").value=signedIn.displayName||"";
   document.getElementById("email").value=signedIn.email||"";
 }
 showModal("registerModal");
}

grid.addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)details(card.dataset.id)});grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();details(e.target.dataset.id)}});
search.addEventListener("input",render);document.getElementById("categories").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;category=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render()});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeAll));document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeAll()}));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
document.getElementById("registerForm").addEventListener("submit", async e=>{
 e.preventDefault();
 const name=document.getElementById("name").value.trim();
 const email=document.getElementById("email").value.trim();
 const phone=document.getElementById("phone").value.replace(/\D/g,"");
 const consent=document.getElementById("consent").checked;
 const err=document.getElementById("error");
 if(name.length<2){err.textContent="Please enter your full name.";return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent="Please enter a valid email address.";return}
 if(!/^[6-9]\d{9}$/.test(phone)){err.textContent="Enter a valid 10-digit Indian mobile number.";return}
 if(!consent){err.textContent="Please accept the registration update consent.";return}
 if(!window.adoraSaveBooking){
   err.textContent="Booking service is still loading. Please try again in a moment.";return;
 }
 const button=document.querySelector("#registerForm button[type=submit]");
 button.disabled=true;button.textContent="Saving booking…";err.textContent="";
 try{
   await window.adoraSaveBooking({
     eventId:selected.id,title:selected.title,category:selected.category,
     date:selected.date,time:selected.time,venue:selected.venue,price:selected.price,
     name,email,phone
   });
   document.getElementById("registerForm").hidden=true;
   document.getElementById("successText").textContent=`Thanks ${name}. Your registration for ${selected.title} has been saved to your ADORA account. You can find it under My Bookings.`;
   document.getElementById("success").hidden=false;
   await window.adoraLoadBookings?.();
 }catch(error){
   err.textContent=error.message || "We couldn't save your booking. Please try again.";
 }finally{
   button.disabled=false;button.textContent="Confirm Registration ➜";
 }
});

async function renderMyBookings(){
 const list=document.getElementById("myBookingsList");
 const note=document.getElementById("bookingAccountNote");
 if(!list)return;
 const user=window.adoraCurrentUser||null;
 if(!user){
   note.textContent="Sign in to view your bookings";
   list.innerHTML='<div class="bookings-empty">Please <button class="inline-login" type="button" id="bookingsLogin">log in</button> to view bookings saved to your account.</div>';
   document.getElementById("bookingsLogin")?.addEventListener("click",()=>document.getElementById("signIn")?.click());
   return;
 }
 note.textContent=`Bookings for ${user.displayName||user.email||"your account"}`;
 list.innerHTML='<div class="bookings-empty">Loading your bookings…</div>';
 try{
   const bookings=await window.adoraLoadBookings();
   if(!bookings.length){
     list.innerHTML='<div class="bookings-empty">No bookings yet. Explore an event and reserve your spot.</div>';
     return;
   }
   list.innerHTML=bookings.map(b=>`<article class="booking-item">
     <div class="booking-item-main"><span class="booking-item-category">${escapeHtml(b.category||"EVENT")}</span>
     <h3>${escapeHtml(b.title||"Event")}</h3>
     <p>▣ ${escapeHtml(b.date||"Date TBA")} &nbsp; · &nbsp; ⌖ ${escapeHtml(b.venue||"Venue TBA")}</p>
     <small>Registered as ${escapeHtml(b.name||user.displayName||user.email||"ADORA member")}</small></div>
     <button class="cancel-booking" type="button" data-booking-id="${escapeHtml(b.id)}">Cancel booking</button>
   </article>`).join("");
   list.querySelectorAll("[data-booking-id]").forEach(btn=>btn.addEventListener("click",async()=>{
     if(!confirm("Cancel this event booking?"))return;
     btn.disabled=true;
     try{await window.adoraCancelBooking(btn.dataset.bookingId);await renderMyBookings();toast("Booking cancelled.");}
     catch(e){btn.disabled=false;toast(e.message||"Could not cancel booking.");}
   }));
 }catch(error){
   list.innerHTML=`<div class="bookings-empty bookings-error">${escapeHtml(error.message||"Unable to load bookings. Check your Firestore setup and security rules.")}</div>`;
 }
}
function escapeHtml(value){
 return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
window.addEventListener("adora-auth-changed",renderMyBookings);
document.addEventListener("DOMContentLoaded",renderMyBookings);
document.querySelector('a[href="#bookings"]')?.addEventListener("click",()=>setTimeout(renderMyBookings,50));

document.getElementById("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");document.getElementById("themeToggle").textContent=document.body.classList.contains("light")?"☀":"☾"});
document.getElementById("menuToggle").addEventListener("click",()=>document.querySelector(".topbar nav").classList.toggle("show"));/* Sign-in dialog and Firebase authentication are handled by auth.js. */
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
if(matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
 const root=document.documentElement;
 let raf=0,lastX=window.innerWidth/2,lastY=window.innerHeight/2;
 const moveSpotlight=e=>{
  lastX=e.clientX;lastY=e.clientY;
  if(raf)return;
  raf=requestAnimationFrame(()=>{
   root.style.setProperty("--mx",`${lastX}px`);
   root.style.setProperty("--my",`${lastY}px`);
   raf=0;
  });
 };
 window.addEventListener("pointermove",moveSpotlight,{passive:true});
 root.style.setProperty("--mx",`${lastX}px`);
 root.style.setProperty("--my",`${lastY}px`);
}
render();


// Animated background: tiny stars drift slowly, twinkle, and respond subtly to pointer movement.
(() => {
  const canvas = document.getElementById("starfield");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0, height = 0, dpr = 1, frame = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const stars = [];
  const STAR_COUNT = Math.min(150, Math.max(65, Math.floor(window.innerWidth / 9)));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.35 + .35,
        speed: Math.random() * .22 + .045,
        phase: Math.random() * Math.PI * 2,
        twinkle: Math.random() * .018 + .006,
        hue: Math.random() > .72 ? 185 : (Math.random() > .5 ? 265 : 0)
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    pointerX += (targetX - pointerX) * .025;
    pointerY += (targetY - pointerY) * .025;
    const t = performance.now() * .001;

    for (const star of stars) {
      star.y -= star.speed;
      star.x += Math.sin(t * .55 + star.phase) * .12;
      if (star.y < -4) { star.y = height + 4; star.x = Math.random() * width; }
      if (star.x < -4) star.x = width + 4;
      if (star.x > width + 4) star.x = -4;

      const parallaxX = pointerX * (star.radius * .7);
      const parallaxY = pointerY * (star.radius * .7);
      const pulse = .45 + (Math.sin(t * 1.6 + star.phase) + 1) * .25;
      const alpha = Math.min(.95, pulse);
      const color = star.hue === 185 ? `90,235,240` : (star.hue === 265 ? `177,130,255` : `220,230,255`);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.shadowBlur = star.radius > 1.15 ? 10 : 4;
      ctx.shadowColor = `rgba(${color},.8)`;
      ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    frame = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, {passive:true});
  window.addEventListener("pointermove", e => {
    targetX = (e.clientX / Math.max(1, width) - .5) * 13;
    targetY = (e.clientY / Math.max(1, height) - .5) * 13;
  }, {passive:true});
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else if (!document.hidden && !frame) draw();
  });
  resize();
  draw();
})();


// Footer newsletter UI: clearly indicate that subscription delivery is not connected yet.
document.addEventListener('DOMContentLoaded', () => {
  const newsletter = document.getElementById('footerNewsletter');
  const note = document.getElementById('newsletterNote');
  if (newsletter && note) {
    newsletter.addEventListener('submit', (event) => {
      event.preventDefault();
      note.textContent = 'Thanks for your interest! Newsletter sign-up is coming soon.';
      newsletter.reset();
    });
  }
});
