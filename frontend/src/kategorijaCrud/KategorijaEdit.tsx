import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { KategorijaForCU } from './models';


/**
 * Component state.
 */
class State
{	
	isInitialized : boolean = false;
	isLoading : boolean = false;
	isLoaded : boolean = false;

	id: number = -1;
	pavadinimas: string = "";

	isNameErr : boolean = false;
	isSaveErr : boolean = false;

	/**
	 * Resets error flags to off.
	 */
	resetErrors() {
		this.isNameErr = false;
		this.isSaveErr = false;
	}

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * Log-in section in nav bar. React component.
 * @returns Component HTML.
 */
function KategorijaEdit() {
	//get state container and state updater
	const [state, setState] = useState(new State());

	//get router stuff
	const navigate = useNavigate();
	const locationParams = useParams();

	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : () => void) => {
		updater();
		setState(state.shallowClone());
	}

	let updateState = (updater : (state : State) => void) => {
		setState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	//initialize
	if( !state.isInitialized ) {
		//query data
		backend.get<KategorijaForCU>(
			config.backendUrl + `/kategorija/load`,
			{
				params : {
					id : locationParams["kategorijaId"]
				}
			}
		)
		.then(resp => {
			updateState(state => {
				//indicate loading finished successfully
				state.isLoading = false;
				state.isLoaded = true;

				//store data loaded
				let data = resp.data;

				state.id = data.id;
				state.pavadinimas = data.pavadinimas;
			})
		})

		//indicate data is loading and initialization done
		update(() => {
			state.isLoading = true;
			state.isLoaded = false;
			state.isInitialized = true;
		});
	}

	/**
	 * Handles'save' command.
	 */
	let onSave = () => {
		update(() => {
			//reset previous errors
			state.resetErrors();

			//validate form
			if( state.pavadinimas.trim() === "" )
				state.isNameErr = true;

			//errors found? abort
			if( state.isNameErr )
				return;

			//collect kategorija data
			let kategorija = new KategorijaForCU();
			kategorija.id = state.id;
			kategorija.pavadinimas = state.pavadinimas;

			//request kategorija creation
			backend.post(
				config.backendUrl + "/kategorija/update",
				kategorija
			)
			//success
			.then(resp => {
				//redirect back to kategorija list on success
				navigate("./../../", { state : "refresh" });

				//show success message
				notifySuccess("Entity updated.");
			})
			//failure
			.catch(err => {
				updateState(state => state.isSaveErr = true);
			});
		});		
	}

	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100 overflow-auto">
			<div className="mb-1">Editing kategorija</div>
			{ state.isLoading &&
				<div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
					<span className="alert alert-info mx-2">Loading data...</span>
				</div>
			}
			{ state.isInitialized && !state.isLoading && !state.isLoaded &&
				<div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
					<span className="alert alert-warning mx-2">Backend failure, please try again...</span>
				</div>
			}
			{ state.isLoaded &&
				<>
				<div className="d-flex justify-content-center">
					<div className="d-flex flex-column align-items-start" style={{width: "80ch"}}>					
						{state.isSaveErr &&
							<div 
								className="alert alert-warning w-100"
								>Saving failed due to backend failure. Please, wait a little and retry.</div>
						}	

						<label htmlFor="id" className="form-label">ID:</label>
						<span id="id">{state.id}</span>


					<label htmlFor="pavadinimas" className="form-label">Pavadinimas:</label>
					<InputText 
						id="pavadinimas" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.pavadinimas}
						onChange={(e) => update(() => state.pavadinimas = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Name must be non empty and non whitespace.</div>
					}
					</div>
				</div>

				<div className="d-flex justify-content-center align-items-center w-100 mt-1">
					<button
						type="button"
						className="btn btn-primary mx-1"
						onClick={() => onSave()}
						><i className="fa-solid fa-floppy-disk"></i> Save</button>
					<button
						type="button"
						className="btn btn-primary mx-1"
						onClick={() => navigate("./../../")}
						><i className="fa-solid fa-xmark"></i> Cancel</button>
				</div>
				</>
			}
		</div>
		</>;

	//
	return html;
}

//
export default KategorijaEdit;