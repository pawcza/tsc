import React, {useEffect, useState} from "react";
import {Reorder} from "framer-motion";
import styled from "styled-components";

import Code from "components/Code";

const CodesList = ({codes}) => {
    const [items, setItems] = useState(codes.sort((a, b) => b.totalVotes - a.totalVotes));

    useEffect(() => {
        const sorted = codes.sort((a, b) => b.totalVotes - a.totalVotes);
        setItems([...sorted]);
    }, [JSON.stringify(codes)]);

    return (
        <CodeGroup axis="y" values={items} onReorder={setItems}>
            {items.map((item) => (
                <CodeItem key={`code-${item._id}`} dragListener={false} value={item}>
                    <Code
                        _id={item._id}
                        number={item.number}
                        texts={item.texts}
                        totalVotes={item.totalVotes}
                    />
                </CodeItem>
            ))}
        </CodeGroup>
    );
};

export default CodesList;

export const CodeGroup = styled(Reorder.Group)``;

export const CodeItem = styled(Reorder.Item)`
    list-style: none;
`;
