import  { useState, useEffect } from 'react';
import json from "../../../../resultado_resta.json";
import json2 from "../../../../resultado_resta2.json";

function Celda() {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            setData(json);
        };

        fetchData();

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = () => {
            setData2(json2);
        };

        fetchData();

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    console.log(json);

    return (
        <>
            {/* Renderizado de filas de la tabla */}
            {data.map((item, index) => (
                <tr key={index} className="text-center">
                    <th className='fw-bold' scope="row">{item.id}</th>
                    <td className='fw-bold'>{item.Nombre}</td>
                    <td className='fw-bold'>{item.NuevaReputacion}</td>
                    <td className={data2[index]?.Diferencia > 45 ? 'text-success fw-bold' : data2[index]?.Diferencia < 45 ? 'text-danger fw-bold' : ''}>
                        {data2[index]?.Diferencia > 0 ? '+' : ''}{data2[index]?.Diferencia}
                    </td>
                    <td className={item.Diferencia > 45 ? 'text-success fw-bold' : item.Diferencia < 45 ? 'text-danger fw-bold' : ''}>
                        {item.Diferencia > 0 ? '+' : ''}{item.Diferencia}
                    </td>
                </tr>
            ))}
        </>
    );
}

export default Celda;
