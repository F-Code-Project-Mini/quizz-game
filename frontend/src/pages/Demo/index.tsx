import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Khai báo kiểu dữ liệu cho Socket để TypeScript hiểu rõ
interface ServerToClientEvents {
    message_from_server: (message: string) => void;
}

interface ClientToServerEvents {
    message_from_client: (message: string) => void;
}

// Khởi tạo kết nối Socket.IO
// Đảm bảo URL này khớp với nơi Server Express đang chạy (vd: port 4000)
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:8000");

function DemoPage() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [latestMessage, setLatestMessage] = useState("");
    const [messageToSend, setMessageToSend] = useState("Hello from React!");

    useEffect(() => {
        // Sự kiện kết nối thành công
        socket.on("connect", () => {
            setIsConnected(true);
            console.log("✅ Connected to Socket.IO Server");
        });

        // Sự kiện ngắt kết nối
        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("❌ Disconnected from Socket.IO Server");
        });

        // Lắng nghe sự kiện "message_from_server"
        socket.on("message_from_server", (message) => {
            setLatestMessage(message);
        });

        // Cleanup: Ngắt kết nối và loại bỏ listeners khi component unmount
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message_from_server");
        };
    }, []);

    const sendMessage = () => {
        if (isConnected) {
            // Gửi sự kiện "message_from_client" đến server
            socket.emit("message_from_client", messageToSend);
            console.log("Sent:", messageToSend);
        } else {
            console.log("Not connected. Cannot send message.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>React Socket.IO Demo</h1>
            <p>Status: **{isConnected ? "🟢 Connected" : "🔴 Disconnected"}**</p>
            <hr />

            <h3>Gửi tin nhắn lên Server</h3>
            <input
                type="text"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                placeholder="Enter message"
                style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={sendMessage} disabled={!isConnected}>
                Gửi
            </button>

            <h3>Tin nhắn mới nhất từ Server</h3>
            <p style={{ color: "blue", fontWeight: "bold" }}>{latestMessage || "Chưa nhận được tin nhắn nào..."}</p>
        </div>
    );
}

export default DemoPage;
