import {AnimatePresence, Reorder} from "framer-motion";
import React, {memo, useEffect, useState} from "react";
import styled from "styled-components";

import Code from "components/Code";

const CodesList = ({codes, user}) => {
    const [items, setItems] = useState(codes.sort((a, b) => b.totalVotes - a.totalVotes));

    const groupVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3
            }
        },
        hidden: {
            opacity: 0,
            transition: {
                when: "afterChildren"
            }
        }
    };

    const itemVariants = {
        visible: {opacity: 1},
        hidden: {opacity: 0}
    };

    useEffect(() => {
        const sorted = codes.sort((a, b) => b.totalVotes - a.totalVotes);
        setItems([...sorted]);
    }, [JSON.stringify(codes)]);

    return (
        <CodeGroup
            axis="y"
            values={items}
            onReorder={setItems}
            initial="hidden"
            animate="visible"
            variants={groupVariants}
        >
            {items.map((item) => (
                <CodeItem
                    key={item._id}
                    dragListener={false}
                    value={item}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    <Code
                        _id={item._id}
                        number={item.number}
                        texts={item.texts}
                        totalVotes={item.totalVotes}
                        user={user}
                    />
                </CodeItem>
            ))}
        </CodeGroup>
    );
};

export default CodesList;

export const CodeGroup = styled(Reorder.Group)``;

export const CodeItem = styled(memo(Reorder.Item))`
    list-style: none;
    opacity: 0;
`;
