import {motion} from "framer-motion";
import logo from "images/logo.png";
import {ObjectId} from "mongodb";
import React, {useEffect, useState} from "react";
import styled, {createGlobalStyle} from "styled-components";

import {socket} from "business/socket";

import CodesList from "components/CodesList";
import {ConnectionManager} from "components/ConnectionManager";
import {ConnectionState} from "components/ConnectionState";

import {CodeType, TextType, UserType} from "types/db";

export default function App() {
    const GlobalStyle = createGlobalStyle`
      @font-face {
        font-family: 'Adjusted Courier New Fallback';
        src: local(Courier New);
        size-adjust: 98%;
        ascent-override: 97%;
        descent-override: normal;
        line-gap-override: normal;
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: "Source Code Pro", 'Adjusted Courier New Fallback';
        color: #1a1a1a;
      }
    `;

    const rulesVariants = {
        open: {height: "auto"},
        closed: {height: 0}
    };

    const draw = {
        hidden: {pathLength: 0, pathOffset: -0.42, opacity: 0},
        visible: {
            pathLength: 0.38,
            pathOffset: 0,
            opacity: 1,
            transition: {
                pathLength: {type: "spring", duration: 2, delay: 0.5},
                pathOffset: {type: "spring", duration: 2, bounce: 0.3},
                opacity: {duration: 0.01}
            }
        }
    };

    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const [codes, setCodes] = useState<CodeType[]>([]);
    const [user, setUser] = useState<UserType>();
    const [showRules, setShowRules] = useState<boolean>(false);

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

    const onInit = (codes: CodeType[], user: UserType) => {
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

        if (process.env.NODE_ENV !== "development") {
            const updatedUser = {...user, codes: [...(user?.codes ?? []), id]};
            // TODO: Fix typescript error here
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setUser(updatedUser);
        }

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

        if (process.env.NODE_ENV !== "development") {
            // TODO: Fix typescript error here
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setUser((user) => ({...user, added: true}));
        }
    };

    const onReceiveAlreadyVoted = (id: ObjectId) => {
        alert(`You've already voted on this code, wait until 4:20PM (GMT +1) to vote again!`);
    };

    const onReceiveAlreadyAdded = () => {
        alert(`You've already added a text today, wait until 4:20PM (GMT +1) to do so again!`);
    };

    return (
        <>
            <GlobalStyle />
            {process.env.NODE_ENV === "development" && (
                <>
                    <ConnectionState isConnected={isConnected} />
                    <ConnectionManager />
                </>
            )}
            {/*<Logo src={logo} />*/}
            <LogoAnimation
                initial="hidden"
                animate="visible"
                viewBox="0 0 170 90"
                preserveAspectRatio="xMinYMin"
            >
                <motion.path
                    variants={draw}
                    d="m 5 0 v 40 h 40 v 40 m 60 -5 h -40 v -35 h 40 v -35 h -40 m 60 0 h 40 v 70 h -40 v -75"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="10"
                ></motion.path>
            </LogoAnimation>
            <Paragraph animate={{opacity: 1, transition: {delay: 0.5}}}>
                <Header>fourtwenty.army</Header>
                Welcome to <b>The Stoner Codex</b>
                <br />
                <br />
                <ToggleRules onClick={() => setShowRules(!showRules)}>
                    {!showRules ? "Read rules..." : "Collapse"}
                </ToggleRules>
                <br />
                <br />
                <Rules animate={showRules ? "open" : "closed"} variants={rulesVariants}>
                    You can cast one vote on each code`s password and add one password every hour
                    (voting allowance resets at full hour).
                    <br />
                    <br />
                    Passwords will get removed upon reaching &quot;-6&quot; votes.
                    <br />
                    <br />
                    Passwords can be up to 100 characters long.
                    <br />
                    <br />
                    Each code can have up to 42 passwords.
                    <br />
                    <br />
                    As the content here is not moderated, please be respectful. Peace :)
                </Rules>
            </Paragraph>
            <CodesList codes={codes} user={user} />
        </>
    );
}

export const Header = styled.h1`
    text-align: center;
`;

export const Logo = styled.img`
    padding-top: 1em;
    margin: 0 auto;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 128px;
    height: 128px;
`;

export const Paragraph = styled(motion.div)`
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
    text-align: center;
    padding: 16px;
    opacity: 0;
`;

export const ToggleRules = styled.span`
    color: lightskyblue;
    cursor: pointer;
    user-select: none;
`;

export const Rules = styled(motion.p)`
    height: 0;
    overflow: hidden;
`;

export const LogoAnimation = styled(motion.svg)`
    width: 100%;
    max-width: 420px;
    margin: 16px auto 0 auto;
    padding: 16px;
    display: block;
`;