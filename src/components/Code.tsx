import {AnimatePresence, Reorder, motion} from "framer-motion";
import React, {MutableRefObject, ReactElement, useEffect, useRef, useState} from "react";
import styled from "styled-components";

import {socket} from "business/socket";

import Form from "components/Form";

const Code = ({number, texts, totalVotes, _id}) => {
    const rowRef = useRef(null);
    const [items, setItems] = useState(texts.sort((a, b) => b.votes - a.votes));

    useEffect(() => {
        const sorted = texts.sort((a, b) => b.votes - a.votes);
        setItems([...sorted]);
    }, [JSON.stringify(texts)]);

    const onVote = (codeId, textId, inc) => {
        socket.emit("vote", codeId, textId, inc);
    };

    const onDrag = (e, pan) => {
        console.log(pan);
    };

    return (
        <Wrapper axis="x" values={items} onReorder={setItems} as={motion.ul} ref={rowRef}>
            <Left>
                <Number>{number}</Number>
                <Counter votes={totalVotes}>{totalVotes}</Counter>
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
                                <VoteUp onClick={() => onVote(_id, item._id, true)}>+</VoteUp>
                                <VoteDown onClick={() => onVote(_id, item._id, false)}>-</VoteDown>
                                <Counter votes={item.votes}>{item.votes}</Counter>
                            </Votes>
                        </TextWrapper>
                    ))}
                    <Form available={texts.length < 10} codeId={_id} number={number} />
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
    line-height: 100%;
    border-bottom: 4px solid #609202;
    border: 4px;
`;

export const Wrapper = styled(Reorder.Group)`
    margin: 64px auto;
    width: 100%;
    display: flex;
    font-size: 1em;
`;

export const Right = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
`;

export const TextWrapper = styled(Reorder.Item)`
    list-style: none;
    font-size: 1em;
    padding: 4px 16px;
    position: relative;
    border-left: 1px solid #ebebeb;
    scroll-snap-align: start;

    &:first-of-type {
        font-weight: 700;
        font-size: 2em;
    }
`;

export const Text = styled.p`
    line-height: 32px;
`;
export const Votes = styled.div`
`;

export const VoteUp = styled.span`
    font-weight: 400;
    font-size: 18px;
    padding: 0 8px;
    cursor: pointer;
    transition: 0.25s ease-out;
    height: 20px;
    display: inline-block;

    &:hover {
        background: #f8f8f8;
    }
`;
export const VoteDown = styled(VoteUp)``;

export const Counter = styled.span`
    height: 100%;
    line-height: 28px;
    font-size: 16px;
    font-weight: 700;
    color: ${({votes}) => (votes >= 0 ? "#5D9C59" : "#DF2E38")};
    padding: 0 4px;
`;
