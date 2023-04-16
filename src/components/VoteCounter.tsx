import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";

const VoteCounter = ({votes}) => {
    const [value, setValue] = useState(votes);
    const [direction, setDirection] = useState("");

    useEffect(() => {
        votes > value
            ? setDirection("up")
            : votes < value
            ? setDirection("down")
            : setDirection("");
    }, [votes]);

    useEffect(() => {
        setTimeout(() => {
            setValue((prev) =>
                direction === "up" ? prev + 1 : direction === "down" ? prev - 1 : prev
            );
            setDirection("");
        }, 300);
    }, [direction]);

    return (
        <Counter votes={votes} direction={direction} layout>
            <Number>{value - 1}</Number>
            <Number>{value}</Number>
            <Number>{value + 1}</Number>
        </Counter>
    );
};

const Counter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    font-weight: 700;
    color: ${({votes}) => (votes >= 0 ? "#5D9C59" : "#DF2E38")};
    padding: -28px 4px 0 4px;

    > p {
        transition-duration: ${({direction}) => (direction === "" ? "0" : "0.3s")};

        &:first-of-type {
            margin-top: ${({direction}) =>
                direction === "up" ? "-56px" : direction === "down" ? "56px" : 0};
        }
    }
`;

const Number = styled.p`
    color: currentColor;
`;

export default VoteCounter;
