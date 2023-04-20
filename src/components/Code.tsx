import {AnimatePresence, Reorder, motion} from "framer-motion";
import React, {MutableRefObject, ReactElement, useEffect, useRef, useState} from "react";
import styled from "styled-components";

import {socket} from "business/socket";

import Form from "components/Form";
import VoteCounter from "components/VoteCounter";
import ReactGA from "react-ga4";

const Code = ({number, texts, totalVotes, _id, user}) => {
    const rowRef = useRef(null);
    const [items, setItems] = useState(texts.sort((a, b) => b.votes - a.votes));
    const disabled = user?.codes?.includes(_id);

    useEffect(() => {
        const sorted = texts.sort((a, b) => b.votes - a.votes);
        setItems([...sorted]);
    }, [JSON.stringify(texts)]);

    const onVote = (codeId, textId, inc, text) => {
        socket.emit("vote", codeId, textId, inc, user._id);

        if (!disabled) {
            ReactGA.event(inc ? "voteUp" : "voteDown", {
                event_category: "codes",
                codeId,
                textId,
                text
            })
        }
    };

    return (
        <Wrapper axis="x" values={items} as={motion.ul} ref={rowRef} disabled={disabled}>
            <Left>
                <Number>{number}</Number>
                <VoteCounter votes={totalVotes} />
            </Left>
            <Right>
                <AnimatePresence initial={false}>
                    {items.map((item) => (
                        <TextWrapper
                            dragListener={false}
                            key={item._id}
                            layoutScroll
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            value={item}
                        >
                            <Text>{item.text}</Text>
                            <Votes>
                                <AnimatePresence>
                                    <VoteCounter votes={item.votes} />
                                    {!disabled && (
                                        <motion.div exit={{opacity: [null, 0], width: [null, 0]}}>
                                            <VoteUp onClick={() => onVote(_id, item._id, true, item.text)}>
                                                +
                                            </VoteUp>
                                            <VoteDown onClick={() => onVote(_id, item._id, false, item.text)}>
                                                -
                                            </VoteDown>
                                        </motion.div>
                                    )}
                                    <Pusher />
                                </AnimatePresence>
                            </Votes>
                        </TextWrapper>
                    ))}
                    {!user?.added && texts.length <= 42 && <Form key={`form-${_id}`} codeId={_id} number={number} userId={user._id}/>}
                </AnimatePresence>
            </Right>
        </Wrapper>
    );
};
export default Code;
export const Left = styled.div`
    padding: 0 8px;
    cursor: default;
    user-select: none;
    margin-right: 15px;
    height: 100%;
`;
export const Number = styled.p`
    font-weight: 700;
    font-size: 2.5em;
    line-height: 32px;
    border-bottom: 4px solid #609202;
    border: 4px;
`;

export const Wrapper = styled(Reorder.Group)`
    margin: 64px auto;
    width: 100%;
    display: flex;
    font-size: 1em;
    transition: 0.3s ease-in-out;
    ${({disabled}) => disabled && `opacity: .75;`}
`;

export const Right = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
`;

export const TextWrapper = styled(Reorder.Item)`
    list-style: none;
    font-size: 1em;
    padding: 0 16px;
    position: relative;
    border-left: 1px solid #ebebeb;
    scroll-snap-align: start;

    &:first-of-type {
        font-weight: 700;
    }
`;

export const Text = styled.p`
    line-height: 32px;
`;
export const Votes = styled.div`
    user-select: none;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s ease-out;
    ${({disabled}) =>
        disabled &&
        `
        pointer-events: none;
    `}
`;

export const VoteUp = styled(motion.span)`
    font-weight: 400;
    font-size: 18px;
    padding: 0 8px;
    cursor: pointer;
    transition: 0.25s ease-out;
    height: 28px;
    width: 28px;
    line-height: 28px;
    display: inline-block;

    &:hover {
        background: #f8f8f8;
    }
`;
export const VoteDown = styled(VoteUp)``;
export const Pusher = styled.div`
    margin-left: auto;
`;