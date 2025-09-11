// source: https://dev-postnov.ru/cursor-trail/

const enabled = false;
if (enabled) {
    document.addEventListener("DOMContentLoaded",() => {
        const trailSettings = {
            color: "rgba(0, 0, 0, 0.85)",
            thickness: 2,
            maxSegments: 40,
            minDistance: 3,
            fadeFactor: .95,
            inactivityTimeout: 100
        };

        // minified code
        let s=[],x=null,y=null,f=!0,t=null;function h(){s.length>0&&(s.forEach((e,i)=>{setTimeout(()=>{e.style.opacity="0"},50*i)}),setTimeout(()=>{s.forEach(e=>e.remove()),s.length=0},50*s.length+300))}function r(){t&&clearTimeout(t),t=setTimeout(h,trailSettings.inactivityTimeout)}function c(e,i,n,o){const a=document.createElement("div");a.classList.add("trail-segment");const l=Math.sqrt(Math.pow(n-e,2)+Math.pow(o-i,2)),d=180*Math.atan2(o-i,n-e)/Math.PI;if(a.style.width=`${l}px`,a.style.height=`${trailSettings.thickness}px`,a.style.left=`${e}px`,a.style.top=`${i}px`,a.style.transform=`rotate(${d}deg)`,a.style.transformOrigin="0 0",a.style.backgroundColor=trailSettings.color,a.style.position="fixed",a.style.pointerEvents="none",a.style.zIndex="9998",a.style.borderRadius="0px",a.style.opacity="1",a.style.transition="opacity 0.3s",document.body.appendChild(a),s.push(a),s.length>trailSettings.maxSegments){const e=s.shift();e.style.opacity="0",setTimeout(()=>{e.remove()},300)}s.forEach((e,t)=>{e.style.opacity=(t+1)/s.length})}document.addEventListener("mousemove",e=>{if(r(),f)return x=e.clientX,y=e.clientY,void(f=!1);if(null===x||null===y)return x=e.clientX,void(y=e.clientY);const t=e.clientX-x,i=e.clientY-y,n=Math.sqrt(t*t+i*i);n>trailSettings.minDistance&&(c(x,y,e.clientX,e.clientY),x=e.clientX,y=e.clientY)}),r()
    });
};