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
        <TextGroup axis="x" values={items} onReorder={setItems} as={motion.ul} ref={rowRef}>
            <Number>
                <CodeLine>{number}</CodeLine>
                <TotalLine>{totalVotes}</TotalLine>
            </Number>
            <TextsContainer>
                <AnimatePresence initial={false}>
                    {items.map((item) => (
                        <TextItem
                            dragListener={false}
                            key={item._id}
                            layout
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            value={item}
                        >
                            <TextLine>{item.text}</TextLine>
                            <Controller>
                                <VoteUp onClick={() => onVote(_id, item._id, true)}>+</VoteUp>
                                <VoteDown onClick={() => onVote(_id, item._id, false)}>-</VoteDown>
                                <Votes votes={item.votes}>{item.votes}</Votes>
                            </Controller>
                        </TextItem>
                    ))}
                    <Form available={texts.length < 10} codeId={_id} number={number} />
                </AnimatePresence>
            </TextsContainer>
        </TextGroup>
    );
};
export default Code;
export const Number = styled.div`
    padding: 8px;
    cursor: default;
    user-select: none;
    margin-right: auto;
    height: 100%;
`;
export const CodeLine = styled.p`
    font-weight: 700;
    font-size: 1.5em;
    border-bottom: 4px solid #609202;
    border: 4px;
`;
export const TotalLine = styled.span`
    margin-top: 4px;
    background: #609202;
    padding: 2px 4px;
    color: white;
    font-weight: 100;
    border-radius: 2px;
`;

export const TextGroup = styled(Reorder.Group)`
    margin: 25px auto;
    width: 100%;
    display: flex;
    font-size: 1em;
    justify-content: center;
    align-items: flex-end;
`;

export const TextsContainer = styled(motion.div)`
    width: 100%;
    padding: 26px 12px 0 26px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
`;

export const TextItem = styled(Reorder.Item)`
    list-style: none;
    padding: 8px;
    position: relative;
    white-space: nowrap;
    border-left: 1px solid #ebebeb;
    scroll-snap-align: start;

  &:first-of-type {
        font-size: 1.5em;
        font-weight: 700;
        padding: 8px 16px;
    }

    &:hover {
        > div {
            opacity: 1;
            pointer-events: all;
        }
    }
`;

export const TextLine = styled.div``;
export const Controller = styled.div`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    outline: 1px solid #ebebeb;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
`;

export const VoteUp = styled.span`
    font-weight: 400;
    font-size: 22px;
    padding: 0 12px;
    cursor: pointer;
    transition: 0.25s ease-out;

    &:hover {
        background: #f8f8f8;
    }
`;
export const VoteDown = styled(VoteUp)``;

export const Votes = styled.span`
    height: 100%;
    color: white;
    line-height: 28px;
    font-size: 16px;
    font-weight: ${({votes}) => (votes > 100 ? "700" : "400")};
    background: ${({votes}) => (votes >= 0 ? "#5D9C59" : "#DF2E38")};
    padding: 0 12px;
`;
