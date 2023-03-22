import { useState } from "react";

type TProduit = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export function ProduitTransformation(
    props: {
        item: TProduit,
        patch: (item: TProduit) => TProduit,
        del: (id: number) => TProduit[],
        produits: TProduit[],
        setProduits: React.Dispatch<React.SetStateAction<TProduit[]>>
    })
{
    const [ nameInput, setNameInput ] = useState("");
    const [ priceInput, setPriceInput ] = useState<number>(0);
    const [ quantityInput, setQuantityInput ] = useState<number>(0);
    const [ showInput, setShowInput ] = useState(false);


    // Create a product.
    async function patchProduit()
    {
        const options = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput,
                price: priceInput,
                quantity: quantityInput
            })

        }

        const response = await fetch(`http://localhost:8000/produits/${props.item.id}`, options)
        const responseJson = await response.json();
        console.log("log: responseJson", responseJson);
        if (responseJson.statusCode === 200)
        {
            const updateProduit = responseJson.data
            props.patch(updateProduit);
            const newProduits = [ ...props.produits ]
            props.setProduits(newProduits.map(elm =>
            {
                if (elm.id === props.item.id)
                {
                    return updateProduit
                }
                return elm
            }))
        }
        resetInput();
        setShowInput(false)
    }

    async function deleteProduit()
    {
        const response = await fetch(`http://localhost:8000/produits/${props.item.id}`, { method: 'DELETE' });
        const responseJson = await response.json();
        console.log('success', responseJson);
        if (responseJson.statusCode === 200)
        {
            const delProduit = responseJson.data
            props.del(delProduit);
            const deletedProduit = [ ...props.produits ]
        props.setProduits(deletedProduit.filter(elm =>
            {
                if (elm.id === props.item.id)
                {
                    return false
                }
                return true
            }))
        };
    }

    async function resetInput()
    { //remet l'input à zéro
        setNameInput("")
        setPriceInput(0)
        setQuantityInput(0)
        document.getElementById('close-btn')?.click()
    }

    function handleCancel()
    { //annul l'opération
        setNameInput(nameInput)
        setPriceInput(priceInput)
        setQuantityInput(quantityInput)
        setShowInput(false);
        resetInput()
    }

    function openInput()
    { //déclenche l'ouverture de l'input.
        setShowInput(true)
    }

    return (
        <>
            <tr>
                <th scope="row"> {props.item?.id} </th>
                <td> {props.item?.name} </td>
                <td> {props.item?.price} </td>
                <td> {props.item?.quantity} </td>
                <td>
                    <button onClick={openInput} type="button" className="btn btn-warning btn-sm">Modifier
                    </button>

                    <button onClick={deleteProduit} type="button" className="btn btn-danger btn-sm">
                        Supprimer
                    </button>
                </td>
            </tr>

            {showInput && <>
                <input type='text' className="form-control" value={nameInput} placeholder="Nom du produit" onChange={(event) => setNameInput(event.target.value)} aria-label="Recipient's username" aria-describedby="button-addon2"></input>

                <input type='number' className="form-control" value={priceInput} placeholder="Prix du produit" onChange={(event) => setPriceInput(+event.target.value)} aria-label="Recipient's username" aria-describedby="button-addon2"></input>

                <input type='number' className="form-control" value={quantityInput} placeholder="Quantité du produit" onChange={(event) => setQuantityInput(+event.target.value)} aria-label="Recipient's username" aria-describedby="button-addon2"></input>

                <button onClick={() => patchProduit()} type="button" className="btn btn-primary btn-rounded-floating ms-1" data-mdb-ripple-color="dark">OK</button>
                <button onClick={handleCancel} type="button" className="btn btn-secondary btn-rounded-floating ms-1" data-mdb-ripple-color="dark">Annuler</button>
            </>
            }
        </>
    )
}