import { useEffect, useState } from "react";
import { ProduitTransformation } from "./produit.transformation";



type TProduit = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export function Produits()
{
    const [ produits, setProduits ] = useState<TProduit[]>([]);
    const [ nameInput, setNameInput ] = useState("");
    const [ priceInput, setPriceInput ] = useState<number>(0);
    const [ quantityInput, setQuantityInput ] = useState<number>(0);
    const [ showInput, setShowInput ] = useState(false)


    // Recovery of all products.
    async function getProduit()
    {

        const options = { method: 'GET' };

        const response = await fetch('http://localhost:8000/produits', options);
        const responseJson = await response.json();

        console.log("Success", responseJson);

        setProduits(responseJson.data)
    }

    useEffect(() =>
    {
        getProduit();
    }, []);

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
        console.log("responseJson", responseJson);

        getProduit();
        setShowInput(false)
        resetInput();
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

    const produitPatch = (item: TProduit) =>
    {
        const index = produits.findIndex(elm => elm.id === item.id);
        return produits[ index ] = item;
    }

    const produitDeleted = (id: number) =>
    {
        const resteProduit = produits.filter(item => item.id !== id)
        return resteProduit
    }

    const listProduit = produits?.map((item: TProduit) => (
        <ProduitTransformation del={produitDeleted} patch={produitPatch}
            produits={produits} setProduits={setProduits} item={item}  key={item.id} />))


    return (
        <div className='container mt-5'>
            <div className="row">
                {showInput &&
                    <div className="container md mb-2">
                        <div className="list-group">
                            <h5>Nom</h5>
                            <input type='text' className="form-control" value={nameInput} placeholder="Nom du produit" onChange={(event) => setNameInput(event.target.value)} aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                            <h5>Prix</h5>
                            <input type='text' className="form-control" value={priceInput} placeholder="Prix du produit" onChange={(event) => setPriceInput(parseInt(event.target.value))} aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                            <h5>Quantité</h5>
                            <input type='text' className="form-control" value={quantityInput} placeholder="Quantité du produit" onChange={(event) => setQuantityInput(parseInt(event.target.value))} aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                            <div className="container ">
                                <button onClick={() => createProduit()} type="button" className="btn btn-primary btn-sm" data-mdb-ripple-color="dark">Valider</button>
                                <button onClick={handleCancel} type="button" className="btn btn-secondary btn-sm" data-mdb-ripple-color="dark">Annuler</button>
                            </div>
                        </div>
                    </div>
                }
                <div className="container md ">
                    <button onClick={openInput} type="button" className="btn btn-primary btn-sm">Ajouter</button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Prix</th>
                            <th scope="col">Quantité</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listProduit}
                    </tbody>
                </table>
            </div>
        </div>
    )
}