import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import styled from "styled-components";

import {socket} from "business/socket";
import useOutsideClick from "../hooks/useOutsideClick";

const Form = ({available, codeId, number}) => {
    const [inputVal, setInputVal] = useState("");
    const onSubmit = (e) => {
        e.preventDefault();

        if (available) {
            setInputVal("");
            socket.emit("post", codeId, inputVal);
        }
    };

    return (
        available && (
            <StyledForm layout onSubmit={onSubmit}>
                <Input
                    layout
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={`${number} means...`}
                />
            </StyledForm>
        )
    );
};

export default Form;

export const StyledForm = styled(motion.form)`
    padding: 0px 16px 28px;
    border-left: 1px solid #ebebeb;
`;

export const Input = styled(motion.input)`
    font-size: 1em;
    font-family: "Roboto Mono", monospace;
    border: 0;
    line-height: 32px;
    min-width: 200px;

    &:focus {
        outline: 0;
    }
`;
