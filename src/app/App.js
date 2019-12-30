import React, { Component } from 'react';
import { Resto } from '../components';
import '../css/App.css';

import { databaseRef as Ref } from '../firebase';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nbResto: 0,
            nbRestoByPage: 0,
            listResto: []
        }
    }

    createResto() {}

    updateResto() {}

    deleteResto() {}

    getDataWithInterval(page_number, nb_per_page) {
        const data = Ref
        data.orderByKey().startAt(page_number.toString()).limitToFirst(nb_per_page).on("value", (snapshot) => {
            let _restos = [];
            snapshot.forEach(resto => {
                _restos.push({"id": resto.val().restaurant_id, "name": resto.val().name, "cuisine": resto.val().cuisine})
            });
            this.setState({
                listResto: _restos,
                nbRestoByPage: _restos.length
            })
        })
    }

    getNbData() {
        axios.get(Ref.toString()+'.json').then((res) => {
            var keys = Object.keys(res.data).sort();
            this.setState({
                nbResto: keys.length
            })
        })
    }

    componentDidMount() {
        this.getDataWithInterval(0, 5);
        this.getNbData();
    }

    render() {

        const { listResto, nbResto, nbRestoByPage } = this.state;

        const nbPage = Math.ceil(nbResto / nbRestoByPage);

        let getRestos = listResto.map((elt, index) => {
            return <Resto
                key={index}
                id={elt.id}
                name={elt.name}
                cuisine={elt.cuisine}
            />;
        })

        return (
            <div className="container">
                <br/>
                <h2>Table des restaurants</h2>
                <button type="button" className="btn btn-dark mb-3"><i className="fa fa-plus"></i></button>


                <div className="row">
                    <div className={"col-lg"}>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="elementPageDropDown">Elements par page</label>
                            </div>
                            <select className="custom-select" id="elementPageDropDown">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                className="form-control"
                                placeholder="Chercher par nom"
                                type="text"/>
                        </div>
                        Nombre de Resto : {nbRestoByPage} | { nbResto !== 0 ? (nbResto) : ("...")}
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Nom</th>
                                    <th>Cuisine</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>{getRestos}</tbody>
                        </table>
                        <br/>

                        {/* Pagination */}
                        <div className="navigation">
                            <div className="btn-toolbar">
                                <div className="btn-group mr-2">
                                    <button type="button" className="btn btn-dark" id="firstButton">1</button>
                                    <button type="button" className="btn btn-dark" id="secondButton">2</button>
                                    <button type="button" className="btn btn-dark" id="thirdButton">3</button>
                                    <button className="btn btn-light">...</button>
                                    <button type="button" className="btn btn-dark" id="lastPageButton">{ nbResto !== 0 ? (nbPage) : ("...")}</button>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire de modification */}
                        <div className={"col-lg-4"} id="formulaireInsertion">
                            <div className="card">
                                <div className="card-body">
                                    <form id="formulaireModificationform">
                                        <div className="form-group">
                                            <label htmlFor="idInput">Id :</label>
                                            <input className="form-control" id="idInput" type="text" name="_id" placeholder="Id du restaurant à modifier" readOnly={true}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="restaurantInput">Nom</label>
                                            <input className="form-control" id="restaurantInput" type="text" name="nom" placeholder="Michel's restaurant"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cuisineInput">Cuisine</label>
                                            <input className="form-control" id="cuisineInput" type="text" name="cuisine" placeholder="Michel's cuisine"/>
                                        </div>
                                        <button className="btn btn-dark">Modifier ce restaurant</button>
                                  </form>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire d'ajout */}
                        <div className={"col-lg-4"} id="formulaireInsertion">
                            <div className="card">
                                <div className="card-body">
                                    <form id="formulaireInsertionform">
                                        <div className="form-group">
                                            <label htmlFor="restaurantInput">Nom</label>
                                            <input className="form-control" id="restaurantInputI" type="text" required placeholder="Michel's restaurant"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cuisineInput">Cuisine</label>
                                            <input className="form-control" id="cuisineInputI" type="text" required placeholder="Michel's cuisine"/>
                                        </div>
                                        <button className="btn btn-dark" type="submit">Créer restaurant</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { App };
