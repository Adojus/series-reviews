import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Checkbox } from 'primereact/checkbox';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { AktoriusForCU } from './models';
import { Dropdown } from 'primereact/dropdown';


/**
 * Component state.
 */
class State
{	
	isInitialized : boolean = false;
	isLoading : boolean = false;
	isLoaded : boolean = false;

	id: number = -1;
	vardas: string ='';
    pavarde: string ='';
    gimimo_data: Date = new Date(Date.now());
    lytis: string ='';
    salis: string ='';

	isNameErr : boolean = false;
	isSaveErr : boolean = false;
	isPavardeErr : boolean = false;
	isLytisErr : boolean = false;
	isSalisErr : boolean = false;

	/**
	 * Resets error flags to off.
	 */
	resetErrors() {
		this.isNameErr = false;
		this.isSaveErr = false;
		this.isPavardeErr = false;
		this.isLytisErr = false;
		this.isSalisErr = false;
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
function AktoriusEdit() {
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
		backend.get<AktoriusForCU>(
			config.backendUrl + `/aktorius/load`,
			{
				params : {
					id : locationParams["aktoriusId"]
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
				state.vardas = data.vardas;
                state.pavarde = data.pavarde;
				state.gimimo_data = new Date(data.gimimo_data);
				state.lytis = data.lytis;
				state.salis = data.salis;
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
			if( state.vardas.trim() === "" )
				state.isNameErr = true;

			//errors found? abort
			if( state.isNameErr )
				return;

				//validate form
			if( state.pavarde.trim() === "" )
			state.isPavardeErr = true;

			//errors found? abort
			if( state.isPavardeErr )
				return;

			//validate form
			if( state.lytis.trim() === "" )
			state.isLytisErr = true;
		
			//errors found? abort
			if( state.isLytisErr )
				return;

			//validate form
			if( state.salis.trim() === "" )
			state.isSalisErr = true;

			//errors found? abort
			if( state.isSalisErr )
				return;

			//drop timezone from date, otherwise we will see wrong dates when they come back from backend
			let localDate = new Date(state.gimimo_data.getTime() - state.gimimo_data.getTimezoneOffset() * 60 *1000);

			//collect aktorius gimimo_data
			let aktorius = new AktoriusForCU();
			aktorius.id = state.id;
			aktorius.vardas = state.vardas;
			let onlyDate = localDate.toISOString().split('T');
			aktorius.gimimo_data = onlyDate[0];

			aktorius.pavarde = state.pavarde;
			aktorius.lytis = state.lytis;
			aktorius.salis = state.salis;

			//request aktorius creation
			backend.post(
				config.backendUrl + "/aktorius/update",
				aktorius
			)
			//success
			.then(resp => {
				//redirect back to aktorius list on success
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
			<div className="mb-1">Editing aktorius</div>
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

					<label htmlFor="vardas" className="form-label">Vardas:</label>
					<InputText 
						id="vardas" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.vardas}
						onChange={(e) => update(() => state.vardas = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Vardas must be non empty and non whitespace.</div>
					}
					<label htmlFor="pavarde" className="form-label">Pavardė:</label>
					<InputText 
						id="pavarde" 
						className={"form-control " + (state.isPavardeErr ? "is-invalid" : "")}
						value={state.pavarde}
						onChange={(e) => update(() => state.pavarde = e.target.value)}
						/>
					{state.isPavardeErr && 
						<div className="invalid-feedback">Pavarde must be non empty and non whitespace.</div>
					}
					
                    <label htmlFor="gimimo_data" className="form-label">Gimimo data:</label>
					<Calendar
						id="gimimo_data"
						className="form-control"
						value={state.gimimo_data}		
						onChange={(e) => update(() => state.gimimo_data = e.target.value as Date)}				
						dateFormat="yy-mm-dd"
						/>

					<label htmlFor="lytis" className="form-label">Lytis:</label>
					<Dropdown className={(state.isLytisErr ? "is-invalid" : "")} 
					value={state.lytis} options={["vyras","moteris"]}
					 onChange={(e) => update(() => state.lytis = e.target.value as string)} placeholder="Pasirinkite lytį"/>
					{state.isLytisErr && 
						<div className="invalid-feedback">Lytis must be non empty and non whitespace.</div>
					}

					<label htmlFor="salis" className="form-label">Šalis:</label>
					<InputText 
						id="salis" 
						className={"form-control " + (state.isSalisErr ? "is-invalid" : "")}
						value={state.salis}
						onChange={(e) => update(() => state.salis = e.target.value)}
						/>
					{state.isSalisErr && 
						<div className="invalid-feedback">Salis must be non empty and non whitespace.</div>
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
export default AktoriusEdit;