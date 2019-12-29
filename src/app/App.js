import React, { Component } from 'react';
import '../css/App.css';

import { databaseRef as Ref } from '../firebase';
import axios from 'axios';

class App extends Component {


    getDataWithInterval(page_number, nb_per_page) {
        const data = Ref.child("resto")
        axios.get(data.toString()+'.json').then((res) => {
            // console.log(`[GET Resto] : ${JSON.stringify(res.data)}`);

            var keys = Object.keys(res.data).sort();
            var pageLength = 2;
            var pageCount = keys.length / pageLength;
            var currentPage = 1;
            var promises = [];
            var nextKey;
            var query;

            for (var i = 0; i < pageCount; i++) {
                const key = keys[i * pageLength];
                query = data.orderByKey().limitToFirst(pageLength).startAt(key);
                promises.push(query.once('value'));
                
            }

            Promise.all(promises)
                .then((snaps) => {
                    var pages = [];
                    snaps.forEach((snap) => {
                        pages.push(snap.val());
                    })
                    console.log('pages', pages);
                })
                process.exit();
            // console.log(`[GET Resto] : ${keys}`);
        })
        
    }

    componentDidMount() {
        this.getDataWithInterval(1, 2)
    }

    render() {
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
                        Nombre de Resto : xxx | xxx
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Nom</th>
                                    <th>Cuisine</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>list des resto</tbody>
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
                                    <button type="button" className="btn btn-dark" id="lastPageButton">1</button>
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
