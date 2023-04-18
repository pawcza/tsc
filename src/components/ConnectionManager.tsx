import React, {useState} from "react";

import {socket} from "business/socket";

export function ConnectionManager() {
    const [devMode, setDevMode] = useState(false);
    const handleChange = (e) => {
        setDevMode(e.target.checked);
        socket.emit("toggleDevMode", e.target.checked);
    };
    const connect = () => socket.connect();
    const disconnect = () => socket.disconnect();
    const clearUserData = () => socket.emit("clearUserData");

    const populateDb = () => socket.emit("populateDb");

    return (
        <>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
            <button onClick={clearUserData}>Clear User</button>
            <button onClick={populateDb}>Populate Db</button>
            <input type="checkbox" checked={devMode} onChange={handleChange}/>
        </>
    );
}
