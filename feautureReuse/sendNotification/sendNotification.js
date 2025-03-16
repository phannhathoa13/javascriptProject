
const socket = connectWebSocket();
function connectNotification(notificationProcessing) {
    socket.onopen = () => {
        console.log("✅ Kết nối WebSocket thành công");
    };

    socket.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        console.log("🔔 Nhận thông báo:", notification);
        notificationProcessing(notification);
    };

    socket.onclose = () => {
        console.log("❌ WebSocket bị đóng!");
    };
}

function connectWebSocket() {
    return new WebSocket("ws://localhost:3000");
}


function postNotification(data) {
    return socket.send(JSON.stringify(data));
}

export const memberRank = [
    {
        rank: "Member",
        numberVoucherApply: 1
    },
    {
        rank: "VIP",
        numberVoucherApply: 2
    },
    {
        rank: "VVIP",
        numberVoucherApply: 3
    }
]

export { postNotification, connectWebSocket, connectNotification }