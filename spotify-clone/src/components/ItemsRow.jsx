import React from "react";

const ItemsRow = ({ data, Element, title }) => {
    return (
        <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">{title}</h1>
            <div className="flex overflow-auto">
                {data.map((item, index) => (
                    <Element
                        key={index}
                        name={item.name}
                        desc={item.desc}
                        id={item._id}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default ItemsRow;
