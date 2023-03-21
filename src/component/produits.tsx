import { useState } from "react";


type TProduit = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export function Produit()
{
    const [ produit, setProduit ] = useState<TProduit[]>([]);
    const [ nameInput, setNameInput ] = useState("");
    const [ priceInput, setPriceInput ] = useState("");
    const [ quantityInput, setQuantityInput ] = useState("");

    // Create a product.
    async function createProduit()
    {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput,
                price: priceInput,
                quantity: quantityInput
            })
        }
        const response = await fetch('http://localhost:8000/produits', options);
        const responseJson = await response.json();
        console.log("sucess", responseJson.data);

        setProduit([ ...produit, responseJson.data ]);
        setNameInput("");
        setPriceInput("");
        setQuantityInput("");
    }

    // Recovery of all products.
    async function getProduit()
    {

        const options = { method: 'GET' };

        const response = await fetch('http://localhost:8000/produits', options);
        const responseJson = await response.json();

        console.log("Success", responseJson);

        setProduit(responseJson.data)
    }


    const listProduit = produit?.map((item) => (
        <li>
            <p> {item.name} </p>
            <p> {item.price} </p>
            <p> {item.quantity} </p>
        </li>
    ))

    /* const listProduit = produit.map() */

    return (
        <div className="container">
            {listProduit}
        </div>
    )
}