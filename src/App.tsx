import React, {useState, useEffect} from "react";
import styled, {createGlobalStyle} from "styled-components";
import {ObjectId} from "mongodb";

import {socket} from "business/socket";

import {ConnectionState} from "components/ConnectionState";
import {ConnectionManager} from "components/ConnectionManager";
import CodesList from "components/CodesList";

import {CodeType, TextType} from "types/db";

import logo from "images/logo.png";

export default function App() {
    const GlobalStyle = createGlobalStyle`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: "Source Code Pro", serif;
        color: #1a1a1a;
      }
    `;

    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const [codes, setCodes] = useState<CodeType[]>([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("init", onInit);
        socket.on("receiveVote", onReceiveVote);
        socket.on("receivePost", onReceivePost);
        socket.on("receiveDelete", onReceiveDelete);
        socket.on("alreadyVoted", onReceiveAlreadyVoted);
        socket.on("alreadyAdded", onReceiveAlreadyAdded);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("init", onInit);
            socket.off("receiveVote", onReceiveVote);
            socket.off("receivePost", onReceivePost);
            socket.off("receiveDelete", onReceiveDelete);
            socket.off("alreadyVoted", onReceiveAlreadyVoted);
            socket.off("alreadyAdded", onReceiveAlreadyAdded);
        };
    }, [codes]);

    useEffect(() => {
        console.log(codes);
    }, [codes]);

    const onConnect = () => {
        setIsConnected(true);
    };

    const onDisconnect = () => {
        setIsConnected(false);
    };

    const onReceiveDelete = (id: ObjectId, textId: ObjectId) => {
        const updated = codes;
        const codeIndex = codes?.findIndex(({_id}) => _id === id);
        const textIndex = updated[codeIndex]?.texts.findIndex(({_id}) => _id === textId);
        updated[codeIndex].texts.splice(textIndex, 1);
        setCodes([...updated]);
    };

    const onInit = (codes: CodeType[], user) => {
        setCodes(codes);
        setUser(user);
    };

    const onReceiveVote = (
        id: ObjectId,
        textId: ObjectId,
        inc: boolean,
        ignoreTotalVotes: boolean
    ) => {
        const updated = codes;
        const codeIndex = codes?.findIndex(({_id}) => _id === id);
        const textIndex = updated[codeIndex]?.texts.findIndex(({_id}) => _id === textId);

        if (inc) {
            updated[codeIndex].texts[textIndex].votes++;
            !ignoreTotalVotes && updated[codeIndex].totalVotes++;
        } else {
            updated[codeIndex].texts[textIndex].votes--;
            !ignoreTotalVotes && updated[codeIndex].totalVotes--;
        }

        setCodes([...updated]);
    };

    const onReceivePost = (id: ObjectId, text: TextType) => {
        const updated = codes;
        const codeIndex = codes?.findIndex(({_id}) => _id === id);
        updated[codeIndex].texts.push(text);
        setCodes([...updated]);
    };

    const onReceiveAlreadyVoted = (id: ObjectId) => {
        alert(`You've already voted on this code, wait until 4:20PM (GMT +1) to vote again!`)
    };

    const onReceiveAlreadyAdded = () => {
        alert(`You've already added a text today, wait until 4:20PM (GMT +1) to do so again!`)
    };

    return (
        <div>
            <GlobalStyle />
            <ConnectionState isConnected={isConnected} />
            <ConnectionManager />
            <Header>The Stoner Codex</Header>
            <Logo src={logo} />
            <CodesList codes={codes} />
        </div>
    );
}

export const Header = styled.h1`
    font-family: "Roboto Mono", monospace;
    text-align: center;
`;

export const Logo = styled.img`
    padding: 1em 0;
    margin: 0 auto;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 128px;
    height: 128px;
`;
